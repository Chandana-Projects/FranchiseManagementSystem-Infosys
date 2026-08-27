const express = require("express");

const router = express.Router();

const dashboardController =
    require("../controllers/dashboardController");

router.get(
    "/summary",
    dashboardController.getDashboardSummary
);

router.get(
    "/outlet/:outletId",
    dashboardController.getOutletDashboard
);

module.exports = router;
router.get(
    "/agent/:agent",
    dashboardController.getAgentDashboard
);
router.get(
    "/agent/:agent",
    dashboardController.getAgentDashboard
);