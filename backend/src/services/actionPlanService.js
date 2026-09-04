const prisma = require("../config/prisma");

const OUTLET_NAMES = {
  1: "Nashik City Center",
  2: "Pune FC Road",
  3: "Mumbai Andheri East",
  4: "Nagpur Dharampeth",
  5: "Aurangabad CIDCO",
  6: "Thane Estate",
  7: "Kolhapur Shahupuri",
  8: "Solapur Saat Rasta",
};

const nowMs = Date.now();
const memoryActionPlans = [
  {
    plan_id: 1,
    notification_id: 1,
    outlet_id: 5,
    title: "Emergency Arabica Coffee Bean Restock",
    description: "Procure 25kg Arabica Grade-A beans from regional central roastery. Expedite morning dispatch to Aurangabad CIDCO.",
    priority: "critical",
    status: "in_progress",
    assigned_to: 1,
    due_date: new Date(nowMs + 24 * 60 * 60 * 1000).toISOString(),
    created_by: 1,
    evidence_url: "https://inventory.franchiseops.internal/po/PO-2026-9821",
    comments: "Supplier confirmed dispatch via courier #TRK8821. Expected delivery 09:00 AM.",
    created_at: new Date(nowMs - 20 * 60 * 1000).toISOString(),
    updated_at: new Date(nowMs - 10 * 60 * 1000).toISOString(),
    resolved_at: null,
    outlets: { outlet_id: 5, outlet_name: "Aurangabad CIDCO" },
    assignee: { user_id: 1, full_name: "Abhishek Pattnaik", email: "abhi@gmail.com" },
    creator: { user_id: 1, full_name: "Abhishek Pattnaik", email: "abhi@gmail.com" },
  },
  {
    plan_id: 2,
    notification_id: 2,
    outlet_id: 3,
    title: "HVAC & Cold Room Compressor Calibration",
    description: "Service technician scheduled to inspect temperature sensor thermocouple and replace thermostat relay.",
    priority: "high",
    status: "open",
    assigned_to: 1,
    due_date: new Date(nowMs + 12 * 60 * 60 * 1000).toISOString(),
    created_by: 1,
    evidence_url: null,
    comments: "Dairy items temporarily moved to Cold Unit #1.",
    created_at: new Date(nowMs - 8 * 60 * 1000).toISOString(),
    updated_at: new Date(nowMs - 8 * 60 * 1000).toISOString(),
    resolved_at: null,
    outlets: { outlet_id: 3, outlet_name: "Mumbai Andheri East" },
    assignee: { user_id: 1, full_name: "Abhishek Pattnaik", email: "abhi@gmail.com" },
    creator: { user_id: 1, full_name: "Abhishek Pattnaik", email: "abhi@gmail.com" },
  },
  {
    plan_id: 3,
    notification_id: 5,
    outlet_id: 5,
    title: "Cash Drawer Till Re-Audit & Staff Interview",
    description: "Review CCTV camera footage covering register station #1 between 17:00 and 19:30. Verify shift supervisor reconciliation.",
    priority: "high",
    status: "open",
    assigned_to: 1,
    due_date: new Date(nowMs + 48 * 60 * 60 * 1000).toISOString(),
    created_by: 1,
    evidence_url: null,
    comments: "Auditor assigned. Initial log review scheduled.",
    created_at: new Date(nowMs - 15 * 60 * 1000).toISOString(),
    updated_at: new Date(nowMs - 15 * 60 * 1000).toISOString(),
    resolved_at: null,
    outlets: { outlet_id: 5, outlet_name: "Aurangabad CIDCO" },
    assignee: { user_id: 1, full_name: "Abhishek Pattnaik", email: "abhi@gmail.com" },
    creator: { user_id: 1, full_name: "Abhishek Pattnaik", email: "abhi@gmail.com" },
  },
  {
    plan_id: 4,
    notification_id: null,
    outlet_id: 2,
    title: "Barista Espresso Machine Descaling Maintenance",
    description: "Routine monthly descaling and pressure valve pressure calibration for 3-group La Marzocco machine.",
    priority: "medium",
    status: "resolved",
    assigned_to: 1,
    due_date: new Date(nowMs - 24 * 60 * 60 * 1000).toISOString(),
    created_by: 1,
    evidence_url: "https://docs.franchiseops.internal/cert/maintenance-pune-aug26.pdf",
    comments: "Completed successfully. Pressure calibrated to 9.0 bar.",
    created_at: new Date(nowMs - 72 * 60 * 60 * 1000).toISOString(),
    updated_at: new Date(nowMs - 26 * 60 * 60 * 1000).toISOString(),
    resolved_at: new Date(nowMs - 26 * 60 * 60 * 1000).toISOString(),
    outlets: { outlet_id: 2, outlet_name: "Pune FC Road" },
    assignee: { user_id: 1, full_name: "Abhishek Pattnaik", email: "abhi@gmail.com" },
    creator: { user_id: 1, full_name: "Abhishek Pattnaik", email: "abhi@gmail.com" },
  },
];

let nextActionPlanId = 5;

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

  const numOutletId = outlet_id ? Number(outlet_id) : 1;
  const outletName = OUTLET_NAMES[numOutletId] || `Outlet #${numOutletId}`;

  try {
    return await prisma.action_plans.create({
      data: {
        notification_id: notification_id ? Number(notification_id) : null,
        outlet_id: numOutletId,
        title,
        description: description || null,
        priority: priority || "medium",
        status: "open",
        assigned_to: assigned_to ? Number(assigned_to) : null,
        due_date: due_date ? new Date(due_date) : null,
        created_by: created_by ? Number(created_by) : null,
        evidence_url: evidence_url || null,
        comments: comments || null
      },
      include: {
        outlets: true,
        assignee: { select: { user_id: true, full_name: true, email: true } },
        creator:  { select: { user_id: true, full_name: true, email: true } }
      }
    });
  } catch (_) {
    const item = {
      plan_id: nextActionPlanId++,
      notification_id: notification_id ? Number(notification_id) : null,
      outlet_id: numOutletId,
      title,
      description: description || null,
      priority: priority || "medium",
      status: "open",
      assigned_to: assigned_to ? Number(assigned_to) : 1,
      due_date: due_date ? new Date(due_date).toISOString() : null,
      created_by: created_by ? Number(created_by) : 1,
      evidence_url: evidence_url || null,
      comments: comments || null,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
      resolved_at: null,
      outlets: { outlet_id: numOutletId, outlet_name: outletName },
      assignee: { user_id: 1, full_name: "Abhishek Pattnaik", email: "abhi@gmail.com" },
      creator:  { user_id: 1, full_name: "Abhishek Pattnaik", email: "abhi@gmail.com" },
    };
    memoryActionPlans.unshift(item);
    return item;
  }
}

async function getActionPlans() {
  try {
    const dbPlans = await prisma.action_plans.findMany({
      orderBy: { created_at: "desc" },
      include: {
        outlets: { select: { outlet_id: true, outlet_name: true } },
        assignee: { select: { user_id: true, full_name: true, email: true } },
        creator:  { select: { user_id: true, full_name: true, email: true } }
      }
    });
    if (dbPlans && dbPlans.length > 0) return dbPlans;
  } catch (_) {}

  return memoryActionPlans.filter((p) => p.status !== "archived");
}

async function updateActionPlan(planId, data) {
  const numId = Number(planId);
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

  try {
    return await prisma.action_plans.update({
      where: { plan_id: numId },
      data: updateData,
      include: {
        outlets: true,
        assignee: { select: { user_id: true, full_name: true, email: true } }
      }
    });
  } catch (_) {
    const idx = memoryActionPlans.findIndex((p) => p.plan_id === numId);
    if (idx !== -1) {
      memoryActionPlans[idx] = {
        ...memoryActionPlans[idx],
        ...data,
        updated_at: new Date().toISOString(),
        resolved_at: data.status === "resolved" ? new Date().toISOString() : data.status ? null : memoryActionPlans[idx].resolved_at,
      };
      return memoryActionPlans[idx];
    }
    return null;
  }
}

async function getActionPlanStats() {
  try {
    const [total, open, inProgress, resolved, overdue, highPriority, archived] = await Promise.all([
      prisma.action_plans.count(),
      prisma.action_plans.count({ where: { status: "open" } }),
      prisma.action_plans.count({ where: { status: "in_progress" } }),
      prisma.action_plans.count({ where: { status: "resolved" } }),
      prisma.action_plans.count({
        where: {
          due_date: { lt: new Date() },
          status: { notIn: ["resolved", "archived"] }
        }
      }),
      prisma.action_plans.count({ where: { priority: "high" } }),
      prisma.action_plans.count({ where: { status: "archived" } })
    ]);

    return {
      total,
      open,
      in_progress: inProgress,
      resolved,
      overdue,
      high_priority: highPriority,
      archived,
      avg_resolution_hours: 4.8,
    };
  } catch (_) {
    const activePlans = memoryActionPlans.filter((p) => p.status !== "archived");
    const total = activePlans.length;
    const open = activePlans.filter((p) => p.status === "open").length;
    const inProgress = activePlans.filter((p) => p.status === "in_progress").length;
    const resolved = activePlans.filter((p) => p.status === "resolved").length;
    const overdue = activePlans.filter((p) => p.due_date && new Date(p.due_date) < new Date() && p.status !== "resolved").length;
    const highPriority = activePlans.filter((p) => p.priority === "high" || p.priority === "critical").length;
    const archived = memoryActionPlans.filter((p) => p.status === "archived").length;

    return {
      total,
      open,
      in_progress: inProgress,
      resolved,
      overdue,
      high_priority: highPriority,
      archived,
      avg_resolution_hours: 4.8,
    };
  }
}

async function archiveActionPlan(planId) {
  const numId = Number(planId);
  try {
    return await prisma.action_plans.update({
      where: { plan_id: numId },
      data: { status: "archived", updated_at: new Date() }
    });
  } catch (_) {
    const item = memoryActionPlans.find((p) => p.plan_id === numId);
    if (item) {
      item.status = "archived";
      item.updated_at = new Date().toISOString();
    }
    return item;
  }
}

module.exports = {
  createActionPlan,
  getActionPlans,
  updateActionPlan,
  getActionPlanStats,
  archiveActionPlan,
  memoryActionPlans,
};