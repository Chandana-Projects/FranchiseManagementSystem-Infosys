const express = require("express");
const router = express.Router();
const complianceController = require("../controllers/complianceController");
const { optionalAuth, authenticateToken } = require("../middlewares/authMiddleware");

router.get("/", optionalAuth, complianceController.getAllAudits);
router.post("/", optionalAuth, complianceController.submitAudit);
router.get("/operational-metrics", optionalAuth, complianceController.getOperationalMetrics);
router.post("/analyze-photo", optionalAuth, complianceController.analyzeStorePhoto);

router.get(
  "/:outletId/operational",
  authenticateToken,
  complianceController.getOperationalCompliance
);
router.get(
  "/:outletId/summary",
  authenticateToken,
  complianceController.getComplianceSummary
);
router.post(
  "/run",
  authenticateToken,
  complianceController.runAuditEngine
);
router.get(
  "/history/:outletId",
  authenticateToken,
  complianceController.getAuditHistory
);
router.post(
  "/policy-check",
  authenticateToken,
  complianceController.checkPolicies
);
module.exports = router;

