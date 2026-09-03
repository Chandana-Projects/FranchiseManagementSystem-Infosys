const prisma = require("../config/prisma");

async function createActionPlan(data) {
  const {
    notification_id,
    outlet_id,
    title,
    description,
    priority,
    assigned_to,
    due_date,
    created_by,
    evidence_url,
    comments
  } = data;

  return await prisma.action_plans.create({
    data: {
      notification_id: notification_id || null,
      outlet_id: outlet_id || null,
      title,
      description: description || null,
      priority: priority || "medium",
      status: "open",
      assigned_to: assigned_to || null,
      due_date: due_date ? new Date(due_date) : null,
      created_by: created_by || null,
      evidence_url: evidence_url || null,
      comments: comments || null
    },
    include: {
      outlets: true,
      assignee: {
        select: {
          user_id: true,
          full_name: true,
          email: true
        }
      },
      creator: {
        select: {
          user_id: true,
          full_name: true,
          email: true
        }
      }
    }
  });
}

async function getActionPlans() {
  return await prisma.action_plans.findMany({
    orderBy: {
      created_at: "desc"
    },
    include: {
      outlets: {
        select: {
          outlet_id: true,
          outlet_name: true
        }
      },
      assignee: {
        select: {
          user_id: true,
          full_name: true,
          email: true
        }
      },
      creator: {
        select: {
          user_id: true,
          full_name: true,
          email: true
        }
      }
    }
  });
}

async function updateActionPlan(planId, data) {
  const updateData = { ...data };

  if (updateData.due_date) {
    updateData.due_date = new Date(updateData.due_date);
  }

  if (updateData.status === "resolved") {
    updateData.resolved_at = new Date();
  }

  if (updateData.status && updateData.status !== "resolved") {
    updateData.resolved_at = null;
  }

  updateData.updated_at = new Date();

  return await prisma.action_plans.update({
    where: {
      plan_id: Number(planId)
    },
    data: updateData,
    include: {
      outlets: true,
      assignee: {
        select: {
          user_id: true,
          full_name: true,
          email: true
        }
      }
    }
  });
}

async function getActionPlanStats() {
  const [
    total,
    open,
    inProgress,
    resolved,
    overdue,
    highPriority,
    archived
  ] = await Promise.all([
    prisma.action_plans.count(),

    prisma.action_plans.count({
      where: { status: "open" }
    }),

    prisma.action_plans.count({
      where: { status: "in_progress" }
    }),

    prisma.action_plans.count({
      where: { status: "resolved" }
    }),

    prisma.action_plans.count({
      where: {
        due_date: {
          lt: new Date()
        },
        status: {
          notIn: ["resolved", "archived"]
        }
      }
    }),

    prisma.action_plans.count({
      where: { priority: "high" }
    }),

    prisma.action_plans.count({
      where: { status: "archived" }
    })
  ]);

  return {
    total,
    open,
    in_progress: inProgress,
    resolved,
    overdue,
    high_priority: highPriority,
    archived
  };
}

async function archiveActionPlan(planId) {
  return await prisma.action_plans.update({
    where: {
      plan_id: Number(planId)
    },
    data: {
      status: "archived",
      updated_at: new Date()
    }
  });
}

module.exports = {
  createActionPlan,
  getActionPlans,
  updateActionPlan,
  getActionPlanStats,
  archiveActionPlan
};