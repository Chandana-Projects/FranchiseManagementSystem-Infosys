const cron              = require("node-cron");
const escalationService = require("./escalationService");

let cronJob = null;

/**
 * Starts the SLA Escalation Engine.
 * Runs every 60 seconds — checks for unacknowledged HIGH/CRITICAL
 * notifications that have passed their SLA window and escalates them.
 */
function startEscalationEngine() {
  console.log("⏱️  [EscalationEngine] SLA cron started — checking every 60 seconds.");

  cronJob = cron.schedule("* * * * *", async () => {
    try {
      const breached = await escalationService.getSLABreachedNotifications();
      if (breached.length === 0) return;

      console.log(`🔍 [EscalationEngine] ${breached.length} SLA breach(es) detected. Escalating...`);
      for (const notif of breached) {
        await escalationService.escalateNotification(notif);
      }
    } catch (err) {
      console.error("⚠️  [EscalationEngine] Cron error:", err.message);
    }
  });
}

/**
 * Stops the escalation cron — called on graceful shutdown.
 */
function stopEscalationEngine() {
  if (cronJob) {
    cronJob.stop();
    console.log("🛑 [EscalationEngine] SLA cron stopped.");
  }
}

module.exports = { startEscalationEngine, stopEscalationEngine };
