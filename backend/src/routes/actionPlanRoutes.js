const express = require("express");

const router = express.Router();

const {
  createActionPlan,
  getActionPlans,
  updateActionPlan,
  getActionPlanStats,
  deleteActionPlan
} = require("../controllers/actionPlanController");

router.post("/", createActionPlan);

router.get("/", getActionPlans);

router.get("/stats", getActionPlanStats);

router.patch("/:id", updateActionPlan);

router.delete("/:id", deleteActionPlan);

module.exports = router;