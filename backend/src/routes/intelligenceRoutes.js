const express = require("express");
const router  = express.Router();
const http    = require("http");
const intelligenceController = require("../controllers/intelligenceController");
const intelligenceService = require("../services/intelligenceService");

// Existing intelligence endpoint — unchanged
router.get("/", intelligenceController.getFranchiseIntelligence);
router.get("/recommendations", intelligenceController.getRecommendations);
router.get("/recommendations/stats", intelligenceController.getRecommendationStats);
router.get(
    "/critical-outlets",
    intelligenceController.getCriticalOutlets
);
router.get(
    "/inventory-risk",
    intelligenceController.getInventoryRiskSummary
);
router.get(
    "/sales-summary",
    intelligenceController.getSalesPerformanceSummary
);
router.get("/health-breakdown", intelligenceController.getHealthBreakdown);
router.get("/outlet/:outletId", async (req, res, next) => {
    try {
        const data = await intelligenceService.getOutletIntelligence(
            req.params.outletId
        );

        res.json(data);
    } catch (err) {
        next(err);
    }
});
router.get(
    "/outlet/:outletId",
    intelligenceController.getOutletIntelligence
);

// ML service health proxy — lets the frontend check if ML is running
router.get("/ml-status", (req, res) => {
    const options = {
        hostname: "localhost",
        port:     8000,
        path:     "/ml/health",
        method:   "GET",
        timeout:  1500,
    };
    const probe = http.request(options, (mlRes) => {
        let data = "";
        mlRes.on("data", (c) => { data += c; });
        mlRes.on("end",  () => {
            try {
                res.json({ ml_online: true, ...JSON.parse(data) });
            } catch {
                res.json({ ml_online: false });
            }
        });
    });
    probe.on("timeout", () => { probe.destroy(); res.json({ ml_online: false }); });
    probe.on("error",   () => { res.json({ ml_online: false }); });
    probe.end();
});

// ML service metrics proxy
router.get("/ml-metrics", (req, res) => {
    const options = {
        hostname: "localhost",
        port:     8000,
        path:     "/ml/metrics",
        method:   "GET",
        timeout:  2000,
    };
    const request = http.request(options, (mlRes) => {
        let data = "";
        mlRes.on("data", (c) => { data += c; });
        mlRes.on("end",  () => {
            try {
                res.json(JSON.parse(data));
            } catch {
                res.status(500).json({ error: "Failed to parse ML metrics" });
            }
        });
    });
    request.on("timeout", () => { request.destroy(); res.status(504).json({ error: "ML service timed out" }); });
    request.on("error",   () => { res.status(502).json({ error: "ML service offline" }); });
    request.end();
});

// ML model retraining proxy
router.post("/ml-train", (req, res) => {
    const options = {
        hostname: "localhost",
        port:     8000,
        path:     "/ml/train",
        method:   "POST",
        timeout:  5000,
    };
    const request = http.request(options, (mlRes) => {
        let data = "";
        mlRes.on("data", (c) => { data += c; });
        mlRes.on("end",  () => {
            try {
                res.json(JSON.parse(data));
            } catch {
                res.status(500).json({ error: "Failed to parse training response" });
            }
        });
    });
    request.on("timeout", () => { request.destroy(); res.status(504).json({ error: "ML service timed out" }); });
    request.on("error",   () => { res.status(502).json({ error: "ML service offline" }); });
    request.end();
});

// ML predict simulate proxy
router.post("/ml-simulate", (req, res) => {
    const body = JSON.stringify(req.body);
    const options = {
        hostname: "localhost",
        port:     8000,
        path:     "/ml/predict/simulate",
        method:   "POST",
        headers: {
            "Content-Type": "application/json",
            "Content-Length": Buffer.byteLength(body),
        },
        timeout:  2000,
    };
    const request = http.request(options, (mlRes) => {
        let data = "";
        mlRes.on("data", (c) => { data += c; });
        mlRes.on("end",  () => {
            try {
                res.json(JSON.parse(data));
            } catch {
                res.status(500).json({ error: "Failed to parse simulation response" });
            }
        });
    });
    request.on("timeout", () => { request.destroy(); res.status(504).json({ error: "ML service timed out" }); });
    request.on("error",   () => { res.status(502).json({ error: "ML service offline" }); });
    request.write(body);
    request.end();
});

module.exports = router;
