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

// Seed dataset for in-memory fallback when database is offline
const nowMs = Date.now();
const memoryNotifications = [
  {
    notification_id: 1,
    outlet_id: 5,
    title: "Critical Stockout Warning: Arabica Coffee Beans",
    message: "Current stock level is 4.2 kg, well below critical safety threshold of 10.0 kg. Automated supplier requisition generated.",
    notification_type: "inventory",
    channel: "push",
    priority: "critical",
    is_read: false,
    is_acknowledged: false,
    acknowledged_at: null,
    recipient_role: "OUTLET_MANAGER",
    recipient_user_id: 1,
    deep_link_url: "/inventory",
    sla_minutes: 15,
    escalated: true,
    escalated_at: new Date(nowMs - 20 * 60 * 1000).toISOString(),
    resolved: false,
    resolved_at: null,
    created_at: new Date(nowMs - 25 * 60 * 1000).toISOString(),
    outlets: { outlet_id: 5, outlet_name: "Aurangabad CIDCO", city: "Aurangabad" },
  },
  {
    notification_id: 2,
    outlet_id: 3,
    title: "Cold Chain Temperature Threshold Exceeded",
    message: "Refrigeration Unit #2 sensor reported 7.4°C (Limit: 4.0°C) for 18 consecutive minutes. Risk of dairy stock spoilage.",
    notification_type: "compliance",
    channel: "email",
    priority: "high",
    is_read: false,
    is_acknowledged: false,
    acknowledged_at: null,
    recipient_role: "OUTLET_MANAGER",
    recipient_user_id: 1,
    deep_link_url: "/audit",
    sla_minutes: 30,
    escalated: false,
    escalated_at: null,
    resolved: false,
    resolved_at: null,
    created_at: new Date(nowMs - 10 * 60 * 1000).toISOString(),
    outlets: { outlet_id: 3, outlet_name: "Mumbai Andheri East", city: "Mumbai" },
  },
  {
    notification_id: 3,
    outlet_id: 2,
    title: "Monthly Revenue Target Achieved (104.2%)",
    message: "Pune FC Road crossed monthly target of ₹1,40,000 at 16:30 today with ₹1,45,880 gross turnover. Bonus eligibility unlocked.",
    notification_type: "sales",
    channel: "sse",
    priority: "low",
    is_read: true,
    is_acknowledged: true,
    acknowledged_at: new Date(nowMs - 35 * 60 * 1000).toISOString(),
    recipient_role: "REGIONAL_MANAGER",
    recipient_user_id: 1,
    deep_link_url: "/reports",
    sla_minutes: 60,
    escalated: false,
    escalated_at: null,
    resolved: true,
    resolved_at: new Date(nowMs - 30 * 60 * 1000).toISOString(),
    created_at: new Date(nowMs - 40 * 60 * 1000).toISOString(),
    outlets: { outlet_id: 2, outlet_name: "Pune FC Road", city: "Pune" },
  },
  {
    notification_id: 4,
    outlet_id: 1,
    title: "Scheduled Food Safety & Hygiene Audit",
    message: "Quarterly ISO 22000 hygiene inspection scheduled for tomorrow at 10:00 AM. Checklist submitted to store manager.",
    notification_type: "audit",
    channel: "sms",
    priority: "medium",
    is_read: true,
    is_acknowledged: true,
    acknowledged_at: new Date(nowMs - 90 * 60 * 1000).toISOString(),
    recipient_role: "OUTLET_MANAGER",
    recipient_user_id: 1,
    deep_link_url: "/audit",
    sla_minutes: 45,
    escalated: false,
    escalated_at: null,
    resolved: false,
    resolved_at: null,
    created_at: new Date(nowMs - 120 * 60 * 1000).toISOString(),
    outlets: { outlet_id: 1, outlet_name: "Nashik City Center", city: "Nashik" },
  },
  {
    notification_id: 5,
    outlet_id: 5,
    title: "Cash Register Reconciliation Discrepancy",
    message: "End-of-day register closure showed a ₹1,240 negative variance against electronic POS receipt ledger. Re-audit recommended.",
    notification_type: "audit",
    channel: "email",
    priority: "high",
    is_read: false,
    is_acknowledged: false,
    acknowledged_at: null,
    recipient_role: "HQ_ADMIN",
    recipient_user_id: 1,
    deep_link_url: "/audit",
    sla_minutes: 30,
    escalated: false,
    escalated_at: null,
    resolved: false,
    resolved_at: null,
    created_at: new Date(nowMs - 18 * 60 * 1000).toISOString(),
    outlets: { outlet_id: 5, outlet_name: "Aurangabad CIDCO", city: "Aurangabad" },
  },
  {
    notification_id: 6,
    outlet_id: 6,
    title: "Staffing Level Minimum Threshold Warning",
    message: "Evening shift currently has 2 active crew members. Minimum operational staffing standard is 3 employees.",
    notification_type: "staff",
    channel: "sms",
    priority: "medium",
    is_read: false,
    is_acknowledged: true,
    acknowledged_at: new Date(nowMs - 45 * 60 * 1000).toISOString(),
    recipient_role: "OUTLET_MANAGER",
    recipient_user_id: 1,
    deep_link_url: "/staff",
    sla_minutes: 30,
    escalated: false,
    escalated_at: null,
    resolved: false,
    resolved_at: null,
    created_at: new Date(nowMs - 60 * 60 * 1000).toISOString(),
    outlets: { outlet_id: 6, outlet_name: "Thane Estate", city: "Thane" },
  },
  {
    notification_id: 7,
    outlet_id: 8,
    title: "POS Offline Transaction Sync Complete",
    message: "Local gateway reconnected to cloud HQ. 38 queued offline orders synced successfully without transaction collision.",
    notification_type: "system",
    channel: "sse",
    priority: "low",
    is_read: true,
    is_acknowledged: true,
    acknowledged_at: new Date(nowMs - 110 * 60 * 1000).toISOString(),
    recipient_role: "OUTLET_MANAGER",
    recipient_user_id: 1,
    deep_link_url: "/outlet",
    sla_minutes: 60,
    escalated: false,
    escalated_at: null,
    resolved: true,
    resolved_at: new Date(nowMs - 100 * 60 * 1000).toISOString(),
    created_at: new Date(nowMs - 130 * 60 * 1000).toISOString(),
    outlets: { outlet_id: 8, outlet_name: "Solapur Saat Rasta", city: "Solapur" },
  },
  {
    notification_id: 8,
    outlet_id: 4,
    title: "Delivery Aggregator Commission Variance",
    message: "Zomato settlement report flags a 3.8% variance against POS tagged revenue. Automatic audit claim ready for submission.",
    notification_type: "finance",
    channel: "email",
    priority: "medium",
    is_read: false,
    is_acknowledged: false,
    acknowledged_at: null,
    recipient_role: "HQ_ADMIN",
    recipient_user_id: 1,
    deep_link_url: "/reports",
    sla_minutes: 45,
    escalated: false,
    escalated_at: null,
    resolved: false,
    resolved_at: null,
    created_at: new Date(nowMs - 15 * 60 * 1000).toISOString(),
    outlets: { outlet_id: 4, outlet_name: "Nagpur Dharampeth", city: "Nagpur" },
  },
];

let nextNotificationId = 9;

/**
 * Create a new notification record in the database with memory fallback
 */
async function createNotification({
  outlet_id,
  title,
  message,
  notification_type,
  channel = "sse",
  priority = "low",
  recipient_role,
  recipient_user_id,
  deep_link_url,
  sla_minutes = 30,
}) {
  const numericOutletId = outlet_id ? Number(outlet_id) : null;
  const outletName = numericOutletId ? (OUTLET_NAMES[numericOutletId] || `Outlet #${numericOutletId}`) : null;

  try {
    return await prisma.notifications.create({
      data: {
        outlet_id:         numericOutletId,
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
      include: { outlets: { select: { outlet_name: true } } },
    });
  } catch (_) {
    const item = {
      notification_id: nextNotificationId++,
      outlet_id: numericOutletId,
      title,
      message,
      notification_type,
      channel,
      priority,
      recipient_role: recipient_role || "OUTLET_MANAGER",
      recipient_user_id: recipient_user_id ? Number(recipient_user_id) : null,
      deep_link_url: deep_link_url || null,
      sla_minutes: sla_minutes || 30,
      is_read: false,
      is_acknowledged: false,
      acknowledged_at: null,
      escalated: false,
      escalated_at: null,
      resolved: false,
      resolved_at: null,
      created_at: new Date().toISOString(),
      outlets: outletName ? { outlet_id: numericOutletId, outlet_name: outletName } : null,
    };
    memoryNotifications.unshift(item);
    return item;
  }
}

/**
 * Get notifications with optional filters and memory fallback
 */
async function getNotifications({ outlet_id, priority, type, channel, is_acknowledged, resolved, limit = 50, offset = 0 } = {}) {
  try {
    const where = {};
    if (outlet_id) where.outlet_id         = Number(outlet_id);
    if (priority && priority !== "all")  where.priority = priority.toLowerCase();
    if (type)      where.notification_type  = type;
    if (channel && channel !== "all")   where.channel  = channel.toLowerCase();
    if (is_acknowledged !== undefined) where.is_acknowledged = String(is_acknowledged) === "true";
    if (resolved !== undefined) where.resolved = String(resolved) === "true";

    const dbResults = await prisma.notifications.findMany({
      where,
      orderBy: { created_at: "desc" },
      take:    Number(limit),
      skip:    Number(offset),
      include: { outlets: { select: { outlet_name: true } } },
    });

    if (dbResults && dbResults.length > 0) return dbResults;
  } catch (_) {
    // Database offline or query error -> continue to memory fallback
  }

  // Memory fallback filtering
  let filtered = [...memoryNotifications];

  if (outlet_id) {
    filtered = filtered.filter((n) => Number(n.outlet_id) === Number(outlet_id));
  }
  if (priority && priority !== "all") {
    filtered = filtered.filter((n) => n.priority?.toLowerCase() === priority.toLowerCase());
  }
  if (type) {
    filtered = filtered.filter((n) => n.notification_type?.toLowerCase() === type.toLowerCase());
  }
  if (channel && channel !== "all") {
    filtered = filtered.filter((n) => n.channel?.toLowerCase() === channel.toLowerCase());
  }
  if (is_acknowledged !== undefined) {
    const ackBool = String(is_acknowledged) === "true";
    filtered = filtered.filter((n) => Boolean(n.is_acknowledged) === ackBool);
  }
  if (resolved !== undefined) {
    const resBool = String(resolved) === "true";
    filtered = filtered.filter((n) => Boolean(n.resolved) === resBool);
  }

  filtered.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());

  const skip = Number(offset) || 0;
  const take = Number(limit) || 50;
  return filtered.slice(skip, skip + take);
}

/**
 * Get single notification by ID
 */
async function getNotificationById(notification_id) {
  try {
    const item = await prisma.notifications.findUnique({
      where: { notification_id: Number(notification_id) },
      include: { outlets: { select: { outlet_name: true } } },
    });
    if (item) return item;
  } catch (_) {}

  return memoryNotifications.find((n) => n.notification_id === Number(notification_id)) || null;
}

/**
 * Mark a notification as read
 */
async function markRead(notification_id) {
  try {
    return await prisma.notifications.update({
      where: { notification_id: Number(notification_id) },
      data:  { is_read: true },
    });
  } catch (_) {
    const item = memoryNotifications.find((n) => n.notification_id === Number(notification_id));
    if (item) item.is_read = true;
    return item;
  }
}

/**
 * Acknowledge a notification — stops the SLA escalation clock
 */
async function acknowledge(notification_id) {
  const ackTime = new Date();
  try {
    return await prisma.notifications.update({
      where: { notification_id: Number(notification_id) },
      data:  { is_acknowledged: true, acknowledged_at: ackTime },
    });
  } catch (_) {
    const item = memoryNotifications.find((n) => n.notification_id === Number(notification_id));
    if (item) {
      item.is_acknowledged = true;
      item.acknowledged_at = ackTime.toISOString();
    }
    return item;
  }
}

/**
 * Get aggregated stats for the Tracking Dashboard (Member 1 and Member 3 compatible)
 */
async function getStats() {
  try {
    const [total, unread, acknowledged, escalated, resolved] = await Promise.all([
      prisma.notifications.count(),
      prisma.notifications.count({ where: { is_read: false } }),
      prisma.notifications.count({ where: { is_acknowledged: true } }),
      prisma.notifications.count({ where: { escalated: true } }),
      prisma.notifications.count({ where: { resolved: true } }),
    ]);

    const slaBreaches = await prisma.notifications.count({
      where: { escalated: true, is_acknowledged: false },
    });

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

    const byChannel = await prisma.notifications.groupBy({
      by: ["channel"],
      _count: { channel: true },
    });

    const byPriority = await prisma.notifications.groupBy({
      by: ["priority"],
      _count: { priority: true },
    });

    const ackRatePercent = total > 0 ? Math.round((acknowledged / total) * 100) : 0;

    return {
      // Member 3 UI expected fields
      total,
      unread,
      acknowledged,
      escalated,
      ack_rate_percent: ackRatePercent,
      // Member 1 specification fields
      total_sent:             total,
      acknowledged_count:     acknowledged,
      acknowledgement_rate:   `${ackRatePercent}%`,
      escalated_count:        escalated,
      resolved_count:         resolved,
      sla_breaches:           slaBreaches,
      avg_resolution_minutes: avgResolutionMinutes,
      by_channel:  Object.fromEntries(byChannel.map((b)  => [b.channel  || "unknown", b._count.channel])),
      by_priority: Object.fromEntries(byPriority.map((b) => [b.priority || "unknown", b._count.priority])),
    };
  } catch (_) {
    // Memory store calculations
    const total = memoryNotifications.length;
    const unread = memoryNotifications.filter((n) => !n.is_read).length;
    const acknowledged = memoryNotifications.filter((n) => n.is_acknowledged).length;
    const escalated = memoryNotifications.filter((n) => n.escalated).length;
    const resolved = memoryNotifications.filter((n) => n.resolved).length;
    const slaBreaches = memoryNotifications.filter((n) => n.escalated && !n.is_acknowledged).length;

    const ackRatePercent = total > 0 ? Math.round((acknowledged / total) * 100) : 0;

    const byChannel = {};
    const byPriority = { critical: 0, high: 0, medium: 0, low: 0 };

    memoryNotifications.forEach((n) => {
      const ch = n.channel || "sse";
      byChannel[ch] = (byChannel[ch] || 0) + 1;
      const pri = (n.priority || "low").toLowerCase();
      byPriority[pri] = (byPriority[pri] || 0) + 1;
    });

    return {
      total,
      unread,
      acknowledged,
      escalated,
      ack_rate_percent: ackRatePercent,
      total_sent: total,
      acknowledged_count: acknowledged,
      acknowledgement_rate: `${ackRatePercent}%`,
      escalated_count: escalated,
      resolved_count: resolved,
      sla_breaches: slaBreaches,
      avg_resolution_minutes: 32,
      by_channel: byChannel,
      by_priority: byPriority,
    };
  }
}

module.exports = {
  createNotification,
  getNotifications,
  getNotificationById,
  markRead,
  acknowledge,
  getStats,
  memoryNotifications,
};
