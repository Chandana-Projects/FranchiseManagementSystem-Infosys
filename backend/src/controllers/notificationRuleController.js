const prisma = require("../config/prisma");

/**
 * GET /api/notification-rules
 */
async function list(req, res, next) {
  try {
    const data = await prisma.notification_rules.findMany({
      orderBy: { rule_id: "asc" },
    });
    res.json({ status: "success", count: data.length, data });
  } catch (err) { next(err); }
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

    const rule = await prisma.notification_rules.create({
      data: {
        event_type,
        priority,
        channels,
        sla_minutes:   sla_minutes   ?? 30,
        auto_escalate: auto_escalate ?? true,
      },
    });
    res.status(201).json({ status: "success", data: rule });
  } catch (err) { next(err); }
}

/**
 * PATCH /api/notification-rules/:id
 */
async function update(req, res, next) {
  try {
    const rule = await prisma.notification_rules.update({
      where: { rule_id: Number(req.params.id) },
      data:  req.body,
    });
    res.json({ status: "success", data: rule });
  } catch (err) { next(err); }
}

/**
 * DELETE /api/notification-rules/:id
 */
async function remove(req, res, next) {
  try {
    await prisma.notification_rules.delete({
      where: { rule_id: Number(req.params.id) },
    });
    res.json({ status: "success", message: "Rule deleted successfully" });
  } catch (err) { next(err); }
}

module.exports = { list, create, update, remove };
