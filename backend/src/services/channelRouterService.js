const notificationService = require("./notificationService");
const sseService          = require("./sseService");
const auditTrailService   = require("./auditTrailService");

const emailService = require("./emailService");
const smsService   = require("./smsService");
const pushService  = require("./pushService");

/**
 * Default priority → channel mapping
 *
 * LOW      → SSE
 * MEDIUM   → SSE + Email
 * HIGH     → SSE + Email + Push
 * CRITICAL → SSE + Email + Push + SMS
 */
const PRIORITY_CHANNELS = {
  low:      ["sse"],
  medium:   ["sse", "email"],
  high:     ["sse", "email", "push"],
  critical: ["sse", "email", "push", "sms"],
};

/**
 * Look up active rule for event_type.
 * Falls back to priority-based default.
 */
async function getRuleForEvent(event_type, priority) {
  const prisma = require("../config/prisma");

  try {
    const rule = await prisma.notification_rules.findFirst({
      where: {
        event_type,
        is_active: true,
      },
    });

    if (rule) return rule;
  } catch (_) {
    // DB rule unavailable → use default routing
  }

  return {
    channels: PRIORITY_CHANNELS[priority] || ["sse"],
    sla_minutes: 30,
    auto_escalate: priority === "critical" || priority === "high",
    priority,
  };
}

/**
 * Main notification routing function.
 */
async function routeNotification(payload) {
  const {
    event_type = "general",
    priority = "low",
    outlet_id,
    title,
    message,
    recipient_role,
    deep_link_url,

    // Channel recipients
    recipient_email,
    recipient_mobile,
    push_subscription,
  } = payload;

  // 1. Determine routing rule
  const rule = await getRuleForEvent(event_type, priority);

  const channels =
    rule.channels ||
    PRIORITY_CHANNELS[priority] ||
    ["sse"];

  const sla_minutes = rule.sla_minutes || 30;

  // 2. Persist notification
  const notification = await notificationService.createNotification({
    outlet_id,
    title,
    message,
    notification_type: event_type,
    channel: channels.join(","),
    priority,
    recipient_role,
    deep_link_url,
    sla_minutes,
  });

  const channelsUsed = [];

  // ============================================================
  // 3. SSE
  // ============================================================
  if (channels.includes("sse")) {
    try {
      sseService.broadcast("BUSINESS_ALERT", {
        notification_id: notification.notification_id,
        title,
        message,
        priority,
        outlet_id,
        deep_link_url,
        severity:
          priority === "critical"
            ? "critical"
            : priority === "high"
              ? "warning"
              : "info",
      });

      channelsUsed.push("sse");
    } catch (err) {
      console.error(
        "[ChannelRouter] SSE send failed:",
        err.message
      );
    }
  }

  // ============================================================
  // 4. EMAIL
  // ============================================================
  if (channels.includes("email")) {
    if (recipient_email) {
      try {
        await emailService.sendEmail({
          to: recipient_email,
          subject: title || "FranchiseOpsAI Notification",
          text: message || "You have a new notification.",
          html: `
            <h2>${title || "FranchiseOpsAI Notification"}</h2>
            <p>${message || "You have a new notification."}</p>
            <p><strong>Priority:</strong> ${priority}</p>
            <p><strong>Outlet:</strong> ${outlet_id || "N/A"}</p>
            ${
              deep_link_url
                ? `<p><a href="${deep_link_url}">View Details</a></p>`
                : ""
            }
          `,
        });

        channelsUsed.push("email");

        console.log(
          `[ChannelRouter] Email sent to ${recipient_email}`
        );
      } catch (err) {
        console.error(
          "[ChannelRouter] Email send failed:",
          err.message
        );
      }
    } else {
      console.warn(
        "[ChannelRouter] Email channel selected but recipient_email was not provided."
      );
    }
  }

  // ============================================================
  // 5. PUSH
  // ============================================================
  if (channels.includes("push")) {
    if (push_subscription) {
      try {
        const result = await pushService.sendPushNotification(
          push_subscription,
          {
            title: title || "FranchiseOpsAI",
            body: message || "You have a new notification.",
            icon: "/icon-192.png",
            data: {
              notification_id: notification.notification_id,
              outlet_id,
              priority,
              event_type,
              url: deep_link_url || null,
            },
          }
        );

        if (result.success) {
          channelsUsed.push("push");

          console.log(
            "[ChannelRouter] Push notification sent successfully."
          );
        } else {
          console.error(
            "[ChannelRouter] Push send failed:",
            result.error
          );
        }
      } catch (err) {
        console.error(
          "[ChannelRouter] Push send failed:",
          err.message
        );
      }
    } else {
      console.warn(
        "[ChannelRouter] Push channel selected but push_subscription was not provided."
      );
    }
  }

  // ============================================================
  // 6. SMS
  // ============================================================
  if (channels.includes("sms")) {
    if (recipient_mobile) {
      try {
        const result = await smsService.sendSMS({
          mobile: recipient_mobile,
          templateVariables: {
            title: title || "Critical Franchise Alert",
            message:
              `URGENT: ${title || "Critical Alert"}. ${
                message || "Immediate attention required."
              }`,
          },
        });

        if (result.success) {
          channelsUsed.push("sms");

          console.log(
            `[ChannelRouter] SMS sent to ${recipient_mobile}`
          );
        } else {
          console.error(
            "[ChannelRouter] SMS send failed:",
            result.error
          );
        }
      } catch (err) {
        console.error(
          "[ChannelRouter] SMS send failed:",
          err.message
        );
      }
    } else {
      console.warn(
        "[ChannelRouter] SMS channel selected but recipient_mobile was not provided."
      );
    }
  }

  // ============================================================
  // 7. Audit log
  // ============================================================
  auditTrailService.logEvent({
    action: "NOTIFICATION_ROUTED",
    actor: "channel_router",
    outletId: outlet_id,
    details: {
      notification_id: notification.notification_id,
      channels_used: channelsUsed,
      priority,
      event_type,
    },
  });

  console.log(
    `📡 [ChannelRouter] #${notification.notification_id} | ` +
    `${priority.toUpperCase()} | ` +
    `channels: [${channelsUsed.join(", ")}]`
  );

  return {
    notification_id: notification.notification_id,
    channels_used: channelsUsed,
  };
}

module.exports = {
  routeNotification,
};