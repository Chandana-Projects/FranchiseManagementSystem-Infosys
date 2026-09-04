const prisma = require("../config/prisma");

const memoryRules = [
  {
    rule_id: 1,
    event_type: "inventory_critical",
    priority: "critical",
    channels: ["push", "email", "sms", "sse"],
    sla_minutes: 15,
    auto_escalate: true,
    is_active: true,
    created_at: "2026-08-01T00:00:00.000Z",
  },
  {
    rule_id: 2,
    event_type: "temp_breach",
    priority: "high",
    channels: ["push", "email", "sse"],
    sla_minutes: 30,
    auto_escalate: true,
    is_active: true,
    created_at: "2026-08-01T00:00:00.000Z",
  },
  {
    rule_id: 3,
    event_type: "cash_discrepancy",
    priority: "high",
    channels: ["email", "push", "sse"],
    sla_minutes: 30,
    auto_escalate: true,
    is_active: true,
    created_at: "2026-08-01T00:00:00.000Z",
  },
  {
    rule_id: 4,
    event_type: "staffing_shortfall",
    priority: "medium",
    channels: ["sms", "sse"],
    sla_minutes: 45,
    auto_escalate: false,
    is_active: true,
    created_at: "2026-08-01T00:00:00.000Z",
  },
  {
    rule_id: 5,
    event_type: "audit_due",
    priority: "medium",
    channels: ["email", "sse"],
    sla_minutes: 60,
    auto_escalate: false,
    is_active: true,
    created_at: "2026-08-01T00:00:00.000Z",
  },
  {
    rule_id: 6,
    event_type: "revenue_target",
    priority: "low",
    channels: ["sse"],
    sla_minutes: 120,
    auto_escalate: false,
    is_active: true,
    created_at: "2026-08-01T00:00:00.000Z",
  },
];

let nextRuleId = 7;

/**
 * GET /api/notification-rules
 */
async function list(req, res, next) {
  try {
    const data = await prisma.notification_rules.findMany({
      orderBy: { rule_id: "asc" },
    });
    if (data && data.length > 0) {
      return res.json({ status: "success", count: data.length, data });
    }
  } catch (_) {}

  return res.json({ status: "success", count: memoryRules.length, data: memoryRules });
}

/**
 * POST /api/notification-rules
 * Body: { event_type, priority, channels[], sla_minutes, auto_escalate }
 */
async function create(req, res, next) {
  try {
    const { event_type, priority, channels, sla_minutes, auto_escalate } = req.body;

    if (!event_type || !priority || !channels || !Array.isArray(channels)) {
      return res.status(400).json({
        status: "error",
        error:  "event_type, priority, and channels (array) are required",
      });
    }

    try {
      const rule = await prisma.notification_rules.create({
        data: {
          event_type,
          priority,
          channels,
          sla_minutes:   sla_minutes   ?? 30,
          auto_escalate: auto_escalate ?? true,
        },
      });
      return res.status(201).json({ status: "success", data: rule });
    } catch (_) {
      const newRule = {
        rule_id: nextRuleId++,
        event_type,
        priority,
        channels,
        sla_minutes: sla_minutes ?? 30,
        auto_escalate: auto_escalate ?? true,
        is_active: true,
        created_at: new Date().toISOString(),
      };
      memoryRules.push(newRule);
      return res.status(201).json({ status: "success", data: newRule });
    }
  } catch (err) { next(err); }
}

/**
 * PATCH /api/notification-rules/:id
 */
async function update(req, res, next) {
  const numId = Number(req.params.id);
  try {
    const rule = await prisma.notification_rules.update({
      where: { rule_id: numId },
      data:  req.body,
    });
    return res.json({ status: "success", data: rule });
  } catch (_) {
    const idx = memoryRules.findIndex((r) => r.rule_id === numId);
    if (idx !== -1) {
      memoryRules[idx] = { ...memoryRules[idx], ...req.body };
      return res.json({ status: "success", data: memoryRules[idx] });
    }
    return res.status(404).json({ status: "error", error: "Rule not found" });
  }
}

/**
 * DELETE /api/notification-rules/:id
 */
async function remove(req, res, next) {
  const numId = Number(req.params.id);
  try {
    await prisma.notification_rules.delete({
      where: { rule_id: numId },
    });
    return res.json({ status: "success", message: "Rule deleted successfully" });
  } catch (_) {
    const idx = memoryRules.findIndex((r) => r.rule_id === numId);
    if (idx !== -1) {
      memoryRules.splice(idx, 1);
      return res.json({ status: "success", message: "Rule deleted successfully" });
    }
    return res.status(404).json({ status: "error", error: "Rule not found" });
  }
}

module.exports = { list, create, update, remove, memoryRules };
