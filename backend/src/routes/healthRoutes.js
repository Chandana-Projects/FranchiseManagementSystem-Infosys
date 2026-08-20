const express = require("express");
const router = express.Router();
const prisma = require("../config/prisma");
const sseService = require("../services/sseService");

// Quick Liveness Probe (Kubernetes / Docker health check)
router.get("/", (req, res) => {
  res.json({
    status: "ok",
    service: "FranchiseOpsAI Backend API",
    uptimeSeconds: Math.floor(process.uptime()),
    timestamp: new Date().toISOString(),
  });
});

// Comprehensive Deep Diagnostic Report
router.get("/diagnostics", async (req, res) => {
  const startTime = Date.now();
  let dbStatus = "connected";
  let dbLatencyMs = 0;

  try {
    const dbStart = Date.now();
    await prisma.$queryRaw`SELECT 1`;
    dbLatencyMs = Date.now() - dbStart;
  } catch (err) {
    dbStatus = "fallback_memory_active";
  }

  // Check ML Microservice Status
  let mlStatus = "checking";
  let mlLatencyMs = 0;
  try {
    const mlStart = Date.now();
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 1200);

    const mlRes = await fetch("http://127.0.0.1:8000/docs", { signal: controller.signal });
    clearTimeout(timeoutId);
    mlLatencyMs = Date.now() - mlStart;
    mlStatus = mlRes.ok ? "healthy" : `status_${mlRes.status}`;
  } catch (mlErr) {
    mlStatus = "offline_or_starting";
  }

  const mem = process.memoryUsage();

  res.json({
    status: "healthy",
    environment: process.env.NODE_ENV || "development",
    uptime: `${Math.floor(process.uptime() / 60)}m ${Math.floor(process.uptime() % 60)}s`,
    timestamp: new Date().toISOString(),
    totalDiagnosticTimeMs: Date.now() - startTime,
    components: {
      database: {
        status: dbStatus,
        latencyMs: dbLatencyMs,
      },
      mlMicroservice: {
        url: "http://127.0.0.1:8000",
        status: mlStatus,
        latencyMs: mlLatencyMs,
      },
      realtimeSSE: {
        activeClients: sseService.getClientCount ? sseService.getClientCount() : 0,
        channel: "/api/events",
      },
    },
    systemMetrics: {
      heapUsedMB: (mem.heapUsed / 1024 / 1024).toFixed(2),
      heapTotalMB: (mem.heapTotal / 1024 / 1024).toFixed(2),
      rssMB: (mem.rss / 1024 / 1024).toFixed(2),
      nodeVersion: process.version,
      platform: process.platform,
    },
  });
});

module.exports = router;
