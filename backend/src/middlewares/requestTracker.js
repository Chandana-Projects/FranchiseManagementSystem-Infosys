const crypto = require("crypto");

/**
 * Enterprise Request Tracker Middleware
 * Assigns X-Request-ID before response, measures latency, and logs requests.
 */
function requestTracker(req, res, next) {
  const startHrTime = process.hrtime();
  const requestId = req.headers["x-request-id"] || crypto.randomUUID();

  req.id = requestId;
  res.setHeader("X-Request-ID", requestId);

  // Hook into response finish for structured performance logging
  res.on("finish", () => {
    const elapsedHrTime = process.hrtime(startHrTime);
    const elapsedTimeInMs = (elapsedHrTime[0] * 1000 + elapsedHrTime[1] / 1e6).toFixed(2);

    const status = res.statusCode;
    const logPrefix = status >= 500 ? "🔴 [ERROR]" : status >= 400 ? "🟡 [WARN]" : "🟢 [INFO]";

    if (process.env.NODE_ENV !== "test" && !req.url.startsWith("/api/events")) {
      console.log(`${logPrefix} ${req.method} ${req.originalUrl || req.url} - ${status} (${elapsedTimeInMs}ms) [${requestId.slice(0, 8)}]`);
    }
  });

  next();
}

module.exports = requestTracker;
