const actionPlanService = require("../services/actionPlanService");

async function createActionPlan(req, res, next) {
  try {
    const plan = await actionPlanService.createActionPlan(req.body);

    res.status(201).json({
      success: true,
      message: "Action plan created successfully",
      data: plan
    });
  } catch (error) {
    next(error);
  }
}

async function getActionPlans(req, res, next) {
  try {
    const plans = await actionPlanService.getActionPlans();

    res.status(200).json({
      success: true,
      data: plans
    });
  } catch (error) {
    next(error);
  }
}

async function updateActionPlan(req, res, next) {
  try {
    const plan = await actionPlanService.updateActionPlan(
      req.params.id,
      req.body
    );

    res.status(200).json({
      success: true,
      message: "Action plan updated successfully",
      data: plan
    });
  } catch (error) {
    next(error);
  }
}

async function getActionPlanStats(req, res, next) {
  try {
    const stats = await actionPlanService.getActionPlanStats();

    res.status(200).json({
      success: true,
      data: stats
    });
  } catch (error) {
    next(error);
  }
}

async function deleteActionPlan(req, res, next) {
  try {
    const plan = await actionPlanService.archiveActionPlan(
      req.params.id
    );

    res.status(200).json({
      success: true,
      message: "Action plan archived successfully",
      data: plan
    });
  } catch (error) {
    next(error);
  }
}

module.exports = {
  createActionPlan,
  getActionPlans,
  updateActionPlan,
  getActionPlanStats,
  deleteActionPlan
};