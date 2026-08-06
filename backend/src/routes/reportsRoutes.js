const express = require("express");
const router = express.Router();
const reportsController = require("../controllers/reportsController");
const { authenticateToken } = require("../middlewares/authMiddleware");

router.get("/revenue", authenticateToken, reportsController.getRevenueReport);
router.get("/campaigns", authenticateToken, reportsController.getCampaignReport);
router.get("/staff", authenticateToken, reportsController.getStaffReport);
router.get("/inventory", authenticateToken, reportsController.getInventoryReport);

module.exports = router;
