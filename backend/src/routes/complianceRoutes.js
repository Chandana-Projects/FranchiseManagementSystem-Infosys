const express = require("express");
const router = express.Router();
const complianceController = require("../controllers/complianceController");
const { authenticateToken } = require("../middlewares/authMiddleware");

router.get("/", authenticateToken, complianceController.getAllAudits);
router.post("/", authenticateToken, complianceController.submitAudit);
router.get("/operational-metrics", authenticateToken, complianceController.getOperationalMetrics);
router.post("/analyze-photo", authenticateToken, complianceController.analyzeStorePhoto);

module.exports = router;

