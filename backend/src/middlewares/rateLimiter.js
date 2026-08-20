/**
 * In-Memory Sliding Window Rate Limiter Middleware
 * Protects endpoints from DDoS and brute force without external dependencies.
 */
function createRateLimiter({ windowMs = 60 * 1000, max = 100, message = "Too many requests, please try again later." } = {}) {
  const hits = new Map();

  // Periodic cleanup of stale window timestamps
  setInterval(() => {
    const now = Date.now();
    for (const [key, record] of hits.entries()) {
      if (now - record.startTime > windowMs) {
        hits.delete(key);
      }
    }
  }, Math.max(windowMs, 30000)).unref();

  return function rateLimiter(req, res, next) {
    if (process.env.NODE_ENV === "test") return next();

    const clientIp = req.ip || req.headers["x-forwarded-for"] || req.socket.remoteAddress || "unknown-ip";
    const now = Date.now();

    let record = hits.get(clientIp);
    if (!record || now - record.startTime > windowMs) {
      record = { count: 1, startTime: now };
      hits.set(clientIp, record);
    } else {
      record.count += 1;
    }

    res.setHeader("X-RateLimit-Limit", max);
    res.setHeader("X-RateLimit-Remaining", Math.max(0, max - record.count));
    res.setHeader("X-RateLimit-Reset", Math.ceil((record.startTime + windowMs) / 1000));

    if (record.count > max) {
      const retryAfterSeconds = Math.ceil((record.startTime + windowMs - now) / 1000);
      res.setHeader("Retry-After", retryAfterSeconds);
      return res.status(429).json({
        status: "error",
        error: "Too Many Requests",
        message,
        retryAfterSeconds,
      });
    }

    next();
  };
}

module.exports = {
  createRateLimiter,
  apiLimiter: createRateLimiter({ windowMs: 60 * 1000, max: 300 }),
  authLimiter: createRateLimiter({ windowMs: 60 * 1000, max: 30, message: "Too many login attempts. Please wait a minute." }),
};
