require("dotenv").config();

const app = require("./app");
const posSimulator = require("./services/posSimulator");
const {
  startEscalationEngine,
  stopEscalationEngine
} = require("./services/escalationEngineService");
const prisma = require("./config/prisma");

const PORT = process.env.PORT || 5000;

const server = app.listen(PORT, () => {
  console.log(`🟢 [Server] Listening on http://localhost:${PORT}`);
  console.log(`📄 [Docs] Swagger available at http://localhost:${PORT}/api-docs`);
  console.log(`🩺 [Health] Diagnostics at http://localhost:${PORT}/api/health/diagnostics`);

  // Start live POS transactions simulation loop
  posSimulator.startSimulator();

  // Start SLA Escalation Engine (runs every 60s)
  startEscalationEngine();
});

// Graceful Shutdown on termination signals
function gracefulShutdown(signal) {
  console.log(`\n🛑 [Server] Received ${signal}. Starting graceful shutdown...`);

  stopEscalationEngine();

  server.close(async () => {
    console.log("🔒 [Server] Closed active HTTP listeners.");

    try {
      if (prisma && prisma.$disconnect) {
        await prisma.$disconnect();
        console.log("📦 [Database] Prisma connection closed safely.");
      }
    } catch (err) {
      console.error("⚠️ [Database] Disconnect error:", err);
    }

    process.exit(0);
  });

  // Force close after 10 seconds
  setTimeout(() => {
    console.error("⚠️ [Server] Forcefully terminating after timeout.");
    process.exit(1);
  }, 10000).unref();
}

process.on("SIGINT", () => gracefulShutdown("SIGINT"));
process.on("SIGTERM", () => gracefulShutdown("SIGTERM"));

process.on("unhandledRejection", (reason) => {
  console.error("⚠️ [Process] Unhandled Promise Rejection:", reason);
});

process.on("uncaughtException", (err) => {
  console.error("🔴 [Process] Uncaught Exception:", err);
});