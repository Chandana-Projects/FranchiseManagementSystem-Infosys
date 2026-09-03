const escalationService = require("../services/escalationService");
const prisma            = require("../config/prisma");

/**
 * GET /api/escalations
 */
async function list(req, res, next) {
  try {
    const data = await escalationService.getEscalations(req.query);
    res.json({ status: "success", count: data.length, data });
  } catch (err) { next(err); }
}

/**
 * POST /api/escalations
 * Manually trigger escalation for a notification
 */
async function manualTrigger(req, res, next) {
  try {
    const { notification_id } = req.body;
    if (!notification_id) {
      return res.status(400).json({ status: "error", error: "notification_id is required" });
    }

    const notif = await prisma.notifications.findUnique({
      where:   { notification_id: Number(notification_id) },
      include: { outlets: { select: { outlet_name: true } } },
    });

    if (!notif) {
      return res.status(404).json({ status: "error", error: "Notification not found" });
    }

    const result = await escalationService.escalateNotification(notif);
    res.status(201).json({ status: "success", data: result });
  } catch (err) { next(err); }
}

module.exports = { list, manualTrigger };
