const express = require("express");
const cors = require("cors");
const helmet = require("helmet");

const requestTracker = require("./middlewares/requestTracker");
const inputSanitizer = require("./middlewares/sanitizer");
const { apiLimiter, authLimiter } = require("./middlewares/rateLimiter");

const healthRoutes = require("./routes/healthRoutes");
const outletRoutes = require("./routes/outletRoutes");
const authRoutes = require("./routes/authRoutes");
const inventoryRoutes = require("./routes/inventoryRoutes");
const productRoutes = require("./routes/productRoutes");
const employeeRoutes = require("./routes/employeeRoutes");
const intelligenceRoutes = require("./routes/intelligenceRoutes");
const campaignRoutes = require("./routes/campaignRoutes");
const reportsRoutes = require("./routes/reportsRoutes");
const sseRoutes = require("./routes/sseRoutes");
const complianceRoutes = require("./routes/complianceRoutes");
const enterpriseRoutes = require("./routes/enterpriseRoutes");
const setupSwagger = require("./swagger");
const errorHandler = require("./middlewares/errorHandler");
const actionPlanRoutes = require("./routes/actionPlanRoutes");  

const notificationRoutes = require("./routes/notificationRoutes");
const escalationRoutes = require("./routes/escalationRoutes");
const notificationRuleRoutes = require("./routes/notificationRuleRoutes");
const dashboardRoutes = require("./routes/dashboardRoutes");

// Push notification routes
const pushRoutes = require("./routes/pushRoutes");

const app = express();

app.use(helmet({
  contentSecurityPolicy: false, // Enabled for Swagger & SSE compatibility
  crossOriginEmbedderPolicy: false,
  crossOriginResourcePolicy: { policy: "cross-origin" },
  frameguard: { action: "sameorigin" },
  hsts: {
    maxAge: 31536000,
    includeSubDomains: true,
    preload: true
  },
  noSniff: true,
  referrerPolicy: {
    policy: "strict-origin-when-cross-origin"
  },
}));

app.use(requestTracker);

const allowedOrigins = process.env.ALLOWED_ORIGINS
  ? process.env.ALLOWED_ORIGINS.split(",")
  : ["http://localhost:3000"];

app.use(cors({
  origin: (origin, callback) => {
    if (!origin) return callback(null, true);

    if (
      allowedOrigins.indexOf(origin) === -1 &&
      !allowedOrigins.includes("*")
    ) {
      const msg =
        "The CORS policy for this site does not allow access from the specified Origin.";

      return callback(new Error(msg), false);
    }

    return callback(null, true);
  },
  credentials: true
}));

app.use(express.json({ limit: "5mb" }));
app.use(express.urlencoded({
  extended: true,
  limit: "5mb"
}));

app.use(inputSanitizer);

// Rate limit general API requests
app.use("/api", apiLimiter);

// Health & Diagnostic Telemetry
app.use("/api/health", healthRoutes);

// Core Business Routes
app.use("/api/auth", authLimiter, authRoutes);
app.use("/api/outlets", outletRoutes);
app.use("/api/inventory", inventoryRoutes);
app.use("/api/events", sseRoutes);
app.use("/api/compliance", complianceRoutes);
app.use("/api/products", productRoutes);
app.use("/api/employees", employeeRoutes);
app.use("/api/agent/franchise-intelligence", intelligenceRoutes);
app.use("/api/intelligence", intelligenceRoutes);
app.use("/api/campaigns", campaignRoutes);
app.use("/api/reports", reportsRoutes);
app.use("/api/enterprise", enterpriseRoutes);
app.use("/api/dashboard", dashboardRoutes);
app.use("/api/notifications", notificationRoutes);
app.use("/api/escalations", escalationRoutes);
app.use("/api/notification-rules", notificationRuleRoutes);
app.use("/api/action-plans", actionPlanRoutes);

// Push notification routes
app.use("/api/push", pushRoutes);

// Swagger Documentation
setupSwagger(app);

// 404 Fallback for unmatched API routes
app.use((req, res, next) => {
  res.status(404).json({
    status: "error",
    error: "Not Found",
    message: `Cannot ${req.method} ${req.originalUrl || req.url}`,
  });
});

// Centralized Global Error Handler
app.use(errorHandler);

module.exports = app;