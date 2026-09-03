const prisma            = require("../config/prisma");
const auditTrailService = require("./auditTrailService");
const sseService        = require("./sseService");

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

  // 1. Create escalation record
  const escalation = await prisma.escalations.create({
    data: {
      notification_id:   notification.notification_id,
      escalated_to_role: nextRole,
      reason:            `SLA of ${notification.sla_minutes || 30} minutes breached without acknowledgement.`,
    },
  });

  // 2. Mark notification as escalated
  await prisma.notifications.update({
    where: { notification_id: notification.notification_id },
    data:  { escalated: true, escalated_at: new Date() },
  });

  // 3. Broadcast via SSE
  sseService.broadcast("ESCALATION_TRIGGERED", {
    notification_id:   notification.notification_id,
    title:             notification.title,
    outlet:            notification.outlets?.outlet_name || "Unknown Outlet",
    escalated_to_role: nextRole,
    reason:            escalation.reason,
    severity:          "critical",
  });

  // 4. Audit trail
  auditTrailService.logEvent({
    action:   "NOTIFICATION_ESCALATED",
    actor:    "escalation_engine",
    outletId: notification.outlet_id,
    details: {
      notification_id:   notification.notification_id,
      escalation_id:     escalation.escalation_id,
      escalated_to_role: nextRole,
    },
  });

  console.log(`🔺 [Escalation] Notification #${notification.notification_id} → escalated to ${nextRole}`);
  return escalation;
}

/**
 * List escalations for the API
 */
async function getEscalations({ limit = 50, offset = 0 } = {}) {
  return prisma.escalations.findMany({
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
}

module.exports = { getSLABreachedNotifications, escalateNotification, getEscalations };
