const express = require("express");
const router = express.Router();
const outletController = require("../controllers/outletController");
const validateRequest = require("../middlewares/validateRequest");
const { createOutletSchema } = require("../schemas/outletSchema");
const { authenticateToken, requireRole } = require("../middlewares/authMiddleware");

router.get("/", authenticateToken, outletController.getAllOutlets);
router.get("/dashboard", authenticateToken, outletController.getDashboard);
router.get("/locations", authenticateToken, outletController.getLocations);
router.get("/revenue-trend", authenticateToken, outletController.getRevenueTrend);
router.get("/underperforming", authenticateToken, outletController.getUnderperforming);

router.post("/", authenticateToken, requireRole(["admin", "owner"]), validateRequest(createOutletSchema), outletController.createOutlet);
router.put("/:id", authenticateToken, requireRole(["admin", "owner"]), validateRequest(createOutletSchema), outletController.updateOutlet);
router.delete("/:id", authenticateToken, requireRole(["admin", "owner"]), outletController.deleteOutlet);
router.get("/:id", authenticateToken, outletController.getOutletById);

module.exports = router;