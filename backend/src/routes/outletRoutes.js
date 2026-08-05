const express = require("express");
const router = express.Router();
const outletController = require("../controllers/outletController");

router.get("/", outletController.getAllOutlets);

router.get("/dashboard", outletController.getDashboard);

router.get("/locations", outletController.getLocations);

router.get("/revenue-trend", outletController.getRevenueTrend);

router.get("/underperforming", outletController.getUnderperforming);

router.post("/", outletController.createOutlet);

router.put("/:id", outletController.updateOutlet);

router.delete("/:id", outletController.deleteOutlet);
router.get("/:id/recommendations", outletController.getRecommendations);
router.get("/:id", outletController.getOutletById);
module.exports = router;