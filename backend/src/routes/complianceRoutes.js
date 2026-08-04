const express = require("express");
const router = express.Router();
const complianceController = require("../controllers/complianceController");
const { authenticateToken } = require("../middlewares/authMiddleware");

router.get("/", authenticateToken, complianceController.getAllAudits);
router.post("/", authenticateToken, complianceController.submitAudit);

module.exports = router;
