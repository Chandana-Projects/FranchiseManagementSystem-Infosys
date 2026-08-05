const express = require("express");
const router = express.Router();
const campaignController = require("../controllers/campaignController");
const { authenticateToken } = require("../middlewares/authMiddleware");

router.get("/", authenticateToken, campaignController.getAllCampaigns);
router.post("/", authenticateToken, campaignController.createCampaign);
router.get("/engagement", authenticateToken, campaignController.getCustomerEngagement);
router.post("/simulate", authenticateToken, campaignController.simulatePromotion);
router.post("/generate-copy", authenticateToken, campaignController.generateCopy);

module.exports = router;
