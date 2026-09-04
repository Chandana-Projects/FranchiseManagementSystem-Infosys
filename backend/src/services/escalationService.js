const prisma            = require("../config/prisma");
const auditTrailService = require("./auditTrailService");
const sseService        = require("./sseService");
const { memoryNotifications } = require("./notificationService");

// In-memory fallback for escalations when DB is offline
const memoryEscalations = [];
let nextEscalationId = 1;

/**
 * Escalation chain — order of roles to escalate through
 */
const ESCALATION_CHAIN = ["OUTLET_MANAGER", "REGIONAL_MANAGER", "HQ_ADMIN"];

/**
 * Get the next role in the escalation chain
 */
function getNextRole(currentRole) {
  const idx = ESCALATION_CHAIN.indexOf(currentRole);
  if (idx === -1 || idx >= ESCALATION_CHAIN.length - 1) return "HQ_ADMIN";
  return ESCALATION_CHAIN[idx + 1];
}

/**
 * Find all notifications that have breached their SLA:
 *  - priority HIGH or CRITICAL
 *  - not yet acknowledged
 *  - not yet escalated
 *  - created_at is older than sla_minutes ago
 */
async function getSLABreachedNotifications() {
  try {
    const candidates = await prisma.notifications.findMany({
      where: {
        is_acknowledged: false,
        escalated:       false,
        priority:        { in: ["high", "critical"] },
      },
      include: { outlets: { select: { outlet_name: true } } },
    });

    const now = Date.now();
    return candidates.filter((n) => {
      const slaMs = (n.sla_minutes || 30) * 60 * 1000;
      return now - new Date(n.created_at).getTime() > slaMs;
    });
  } catch (_) {
    // Fallback to memory
    const now = Date.now();
    return memoryNotifications.filter((n) => {
      if (n.is_acknowledged || n.escalated) return false;
      if (n.priority !== "high" && n.priority !== "critical") return false;
      const slaMs = (n.sla_minutes || 30) * 60 * 1000;
      return now - new Date(n.created_at).getTime() > slaMs;
    });
  }
}

/**
 * Escalate a single notification:
 *  1. Create escalation record in DB
 *  2. Mark original notification as escalated
 *  3. Broadcast via SSE so frontend knows immediately
 *  4. Log to audit trail
 *  5. (Phase 5) channelRouterService will send email/SMS to next-tier user
 */
async function escalateNotification(notification) {
  const nextRole = getNextRole(notification.recipient_role);
  const reason = `SLA of ${notification.sla_minutes || 30} minutes breached without acknowledgement.`;

  let escalation;
  try {
    // 1. Create escalation record in DB
    escalation = await prisma.escalations.create({
      data: {
        notification_id:   notification.notification_id,
        escalated_to_role: nextRole,
        reason,
      },
    });

    // 2. Mark notification as escalated in DB
    await prisma.notifications.update({
      where: { notification_id: notification.notification_id },
      data:  { escalated: true, escalated_at: new Date() },
    });
  } catch (_) {
    // Fallback to memory store
    escalation = {
      escalation_id:    nextEscalationId++,
      notification_id:  notification.notification_id,
      escalated_to_role: nextRole,
      reason,
      sent_at: new Date().toISOString(),
    };
    memoryEscalations.unshift(escalation);

    // Mark in memory
    const memItem = memoryNotifications.find((n) => n.notification_id === notification.notification_id);
    if (memItem) {
      memItem.escalated = true;
      memItem.escalated_at = new Date().toISOString();
    }
  }

  // 3. Broadcast via SSE
  try {
    sseService.broadcast("ESCALATION_TRIGGERED", {
      notification_id:   notification.notification_id,
      title:             notification.title,
      outlet:            notification.outlets?.outlet_name || "Unknown Outlet",
      escalated_to_role: nextRole,
      reason,
      severity:          "critical",
    });
  } catch (_) {}

  // 4. Audit trail
  try {
    auditTrailService.logEvent({
      action:   "NOTIFICATION_ESCALATED",
      actor:    "escalation_engine",
      outletId: notification.outlet_id,
      details:  { notification_id: notification.notification_id, escalated_to_role: nextRole },
    });
  } catch (_) {}

  console.log(`🔺 [Escalation] Notification #${notification.notification_id} → escalated to ${nextRole}`);
  return escalation;
}

/**
 * List escalations for the API
 */
async function getEscalations({ limit = 50, offset = 0 } = {}) {
  try {
    const dbResult = await prisma.escalations.findMany({
      orderBy: { sent_at: "desc" },
      take:    Number(limit),
      skip:    Number(offset),
      include: {
        notification: {
          select: {
            title:     true,
            priority:  true,
            outlet_id: true,
            outlets:   { select: { outlet_name: true } },
          },
        },
      },
    });
    if (dbResult && dbResult.length >= 0) return dbResult;
  } catch (_) {}

  // Memory fallback
  const skip = Number(offset) || 0;
  const take = Number(limit) || 50;
  return memoryEscalations.slice(skip, skip + take);
}

module.exports = { getSLABreachedNotifications, escalateNotification, getEscalations };
