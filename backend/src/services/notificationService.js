const prisma = require("../config/prisma");

/**
 * Create a new notification record in the database
 */
async function createNotification({
  outlet_id, title, message, notification_type,
  channel = "sse", priority = "low",
  recipient_role, recipient_user_id,
  deep_link_url, sla_minutes = 30,
}) {
  return prisma.notifications.create({
    data: {
      outlet_id:         outlet_id ? Number(outlet_id) : null,
      title,
      message,
      notification_type,
      channel,
      priority,
      recipient_role,
      recipient_user_id: recipient_user_id ? Number(recipient_user_id) : null,
      deep_link_url,
      sla_minutes,
    },
  });
}

/**
 * Get notifications with optional filters
 */
async function getNotifications({ outlet_id, priority, type, channel, resolved, limit = 50, offset = 0 } = {}) {
  const where = {};
  if (outlet_id) where.outlet_id         = Number(outlet_id);
  if (priority)  where.priority           = priority;
  if (type)      where.notification_type  = type;
  if (channel)   where.channel            = channel;
  if (resolved !== undefined) where.resolved = resolved === "true";

  return prisma.notifications.findMany({
    where,
    orderBy: { created_at: "desc" },
    take:    Number(limit),
    skip:    Number(offset),
    include: { outlets: { select: { outlet_name: true } } },
  });
}

/**
 * Mark a notification as read
 */
async function markRead(notification_id) {
  return prisma.notifications.update({
    where: { notification_id: Number(notification_id) },
    data:  { is_read: true },
  });
}

/**
 * Acknowledge a notification — stops the SLA escalation clock
 */
async function acknowledge(notification_id) {
  return prisma.notifications.update({
    where: { notification_id: Number(notification_id) },
    data:  { is_acknowledged: true, acknowledged_at: new Date() },
  });
}

/**
 * Get aggregated stats for the Tracking Dashboard (Slide 11)
 */
async function getStats() {
  const [total, acknowledged, escalated, resolved] = await Promise.all([
    prisma.notifications.count(),
    prisma.notifications.count({ where: { is_acknowledged: true } }),
    prisma.notifications.count({ where: { escalated: true } }),
    prisma.notifications.count({ where: { resolved: true } }),
  ]);

  // SLA breaches = escalated but never acknowledged
  const slaBreaches = await prisma.notifications.count({
    where: { escalated: true, is_acknowledged: false },
  });

  // Average resolution time in minutes
  const resolvedNotifs = await prisma.notifications.findMany({
    where:  { resolved: true, resolved_at: { not: null } },
    select: { created_at: true, resolved_at: true },
  });

  const avgResolutionMinutes =
    resolvedNotifs.length > 0
      ? Math.round(
          resolvedNotifs.reduce(
            (sum, n) => sum + (new Date(n.resolved_at) - new Date(n.created_at)) / 60000,
            0
          ) / resolvedNotifs.length
        )
      : 0;

  // Group by channel
  const byChannel = await prisma.notifications.groupBy({
    by: ["channel"],
    _count: { channel: true },
  });

  // Group by priority
  const byPriority = await prisma.notifications.groupBy({
    by: ["priority"],
    _count: { priority: true },
  });

  return {
    total_sent:             total,
    acknowledged_count:     acknowledged,
    acknowledgement_rate:   total > 0 ? `${Math.round((acknowledged / total) * 100)}%` : "0%",
    escalated_count:        escalated,
    resolved_count:         resolved,
    sla_breaches:           slaBreaches,
    avg_resolution_minutes: avgResolutionMinutes,
    by_channel:  Object.fromEntries(byChannel.map(b  => [b.channel  || "unknown", b._count.channel])),
    by_priority: Object.fromEntries(byPriority.map(b => [b.priority || "unknown", b._count.priority])),
  };
}

module.exports = { createNotification, getNotifications, markRead, acknowledge, getStats };
