const notificationService  = require("../services/notificationService");
const channelRouterService = require("../services/channelRouterService");
const auditTrailService    = require("../services/auditTrailService");


/**
 * GET /api/notifications
 */
async function list(req, res, next) {
  try {
    const data = await notificationService.getNotifications(req.query);
    res.json({ status: "success", count: data.length, data });
  } catch (err) { next(err); }
}

/**
 * POST /api/notifications
 * Routes through channelRouterService — picks channels by priority + DB rules
 */
async function create(req, res, next) {
  try {
    const result = await channelRouterService.routeNotification(req.body);
    res.status(201).json({ status: "success", data: result });
  } catch (err) { next(err); }
}


/**
 * PATCH /api/notifications/:id/read
 */
async function markRead(req, res, next) {
  try {
    const data = await notificationService.markRead(req.params.id);
    res.json({ status: "success", data });
  } catch (err) { next(err); }
}

/**
 * PATCH /api/notifications/:id/ack
 */
async function acknowledge(req, res, next) {
  try {
    const data = await notificationService.acknowledge(req.params.id);
    auditTrailService.logEvent({
      action:  "NOTIFICATION_ACKNOWLEDGED",
      actor:   req.user?.email || "system",
      details: { notification_id: req.params.id },
    });
    res.json({ status: "success", data });
  } catch (err) { next(err); }
}

/**
 * GET /api/notifications/stats
 */
async function getStats(req, res, next) {
  try {
    const stats = await notificationService.getStats();
    res.json({ status: "success", data: stats });
  } catch (err) { next(err); }
}

module.exports = { list, create, markRead, acknowledge, getStats };
