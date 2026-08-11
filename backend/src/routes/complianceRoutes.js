const express = require("express");
const router = express.Router();
const complianceController = require("../controllers/complianceController");
const { authenticateToken } = require("../middlewares/authMiddleware");

router.get("/", authenticateToken, complianceController.getAllAudits);
router.post("/", authenticateToken, complianceController.submitAudit);

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
