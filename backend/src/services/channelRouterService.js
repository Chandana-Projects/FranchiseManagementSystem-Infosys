const notificationService = require("./notificationService");
const sseService          = require("./sseService");
const auditTrailService   = require("./auditTrailService");

// ─── Phase 5 integration points ─────────────────────────────────────────────
// Uncomment these once M2 delivers the channel services:
// const emailService = require("./emailService");
// const smsService   = require("./smsService");
// const pushService  = require("./pushService");
// ────────────────────────────────────────────────────────────────────────────

/**
 * Default priority → channel mapping (used when no DB rule matches)
 *  LOW      → SSE only
 *  MEDIUM   → SSE + Email
 *  HIGH     → SSE + Email + Push
 *  CRITICAL → SSE + Email + Push + SMS
 */
const PRIORITY_CHANNELS = {
  low:      ["sse"],
  medium:   ["sse", "email"],
  high:     ["sse", "email", "push"],
  critical: ["sse", "email", "push", "sms"],
};

/**
 * Look up active rule for a given event_type from notification_rules table.
 * Falls back to PRIORITY_CHANNELS default if no matching rule exists.
 */
async function getRuleForEvent(event_type, priority) {
  const prisma = require("../config/prisma");
  try {
    const rule = await prisma.notification_rules.findFirst({
      where: { event_type, is_active: true },
    });
    if (rule) return rule;
  } catch (_) {
    // DB not ready yet — fall through to defaults
  }
  return {
    channels:      PRIORITY_CHANNELS[priority] || ["sse"],
    sla_minutes:   30,
    auto_escalate: priority === "critical" || priority === "high",
    priority,
  };
}

/**
 * Map event_type to email template ID (for use with M2's emailService)
 */
function getEmailTemplate(event_type) {
  const map = {
    low_stock:        "inventory_alert",
    sales_drop:       "sales_drop",
    audit_due:        "audit_reminder",
    escalation:       "escalation_notice",
    action_assigned:  "action_plan_assigned",
    weekly_report:    "weekly_report",
  };
  return map[event_type] || "inventory_alert";
}

/**
 * Main routing function — call this whenever a business event fires.
 *
 * @param {object} payload
 *   event_type     {string}  e.g. "low_stock" | "sales_drop" | "audit_due"
 *   priority       {string}  "low" | "medium" | "high" | "critical"
 *   outlet_id      {number}
 *   title          {string}
 *   message        {string}
 *   recipient_role {string}  "OUTLET_MANAGER" | "HQ_ADMIN" | "FRANCHISE_OWNER"
 *   deep_link_url  {string}  e.g. "/dashboard?tab=inventory&outlet=3"
 *
 * @returns {{ notification_id: number, channels_used: string[] }}
 */
async function routeNotification(payload) {
  const {
    event_type     = "general",
    priority       = "low",
    outlet_id,
    title,
    message,
    recipient_role,
    deep_link_url,
  } = payload;

  // 1. Determine routing rule
  const rule        = await getRuleForEvent(event_type, priority);
  const channels    = rule.channels || PRIORITY_CHANNELS[priority] || ["sse"];
  const sla_minutes = rule.sla_minutes || 30;

  // 2. Persist notification to DB
  const notification = await notificationService.createNotification({
    outlet_id,
    title,
    message,
    notification_type: event_type,
    channel:           channels.join(","),
    priority,
    recipient_role,
    deep_link_url,
    sla_minutes,
  });

  const channelsUsed = [];

  // 3. ── SSE (always included) ──────────────────────────────────────────────
  if (channels.includes("sse")) {
    sseService.broadcast("BUSINESS_ALERT", {
      notification_id: notification.notification_id,
      title,
      message,
      priority,
      outlet_id,
      deep_link_url,
      severity: priority === "critical" ? "critical"
              : priority === "high"     ? "warning"
              : "info",
    });
    channelsUsed.push("sse");
  }

  // 4. ── Email ─────────────────────────────────────────────────────────────
  // Uncomment once M2's emailService is delivered:
  // if (channels.includes("email")) {
  //   try {
  //     await emailService.sendEmail({
  //       templateId: getEmailTemplate(event_type),
  //       data: { outlet_id, title, message, deep_link_url, priority },
  //       priority,
  //     });
  //     channelsUsed.push("email");
  //   } catch (err) {
  //     console.error("[ChannelRouter] Email send failed:", err.message);
  //   }
  // }

  // 5. ── Push ──────────────────────────────────────────────────────────────
  // Uncomment once M2's pushService is delivered:
  // if (channels.includes("push")) {
  //   try {
  //     await pushService.sendPushToRole(recipient_role, {
  //       title,
  //       body: message,
  //       url:  deep_link_url,
  //     });
  //     channelsUsed.push("push");
  //   } catch (err) {
  //     console.error("[ChannelRouter] Push send failed:", err.message);
  //   }
  // }

  // 6. ── SMS (CRITICAL only) ────────────────────────────────────────────────
  // Uncomment once M2's smsService is delivered:
  // if (channels.includes("sms")) {
  //   try {
  //     await smsService.sendSMS({
  //       message:  `URGENT: ${title}. ${message}`,
  //       priority,
  //     });
  //     channelsUsed.push("sms");
  //   } catch (err) {
  //     console.error("[ChannelRouter] SMS send failed:", err.message);
  //   }
  // }

  // 7. Audit log
  auditTrailService.logEvent({
    action:   "NOTIFICATION_ROUTED",
    actor:    "channel_router",
    outletId: outlet_id,
    details: {
      notification_id: notification.notification_id,
      channels_used:   channelsUsed,
      priority,
      event_type,
    },
  });

  console.log(
    `📡 [ChannelRouter] #${notification.notification_id} | ${priority.toUpperCase()} | ` +
    `channels: [${channelsUsed.join(", ")}]`
  );

  return { notification_id: notification.notification_id, channels_used: channelsUsed };
}

module.exports = { routeNotification };
