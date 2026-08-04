const express = require("express");
const cors = require("cors");
const helmet = require("helmet");

const outletRoutes = require("./routes/outletRoutes");
const authRoutes = require("./routes/authRoutes");
const inventoryRoutes = require("./routes/inventoryRoutes");
const productRoutes = require("./routes/productRoutes");
const employeeRoutes = require("./routes/employeeRoutes");
const intelligenceRoutes = require("./routes/intelligenceRoutes");
const setupSwagger = require("./swagger");
const errorHandler = require("./middlewares/errorHandler");

const app = express();

app.use(helmet());

const allowedOrigins = process.env.ALLOWED_ORIGINS 
  ? process.env.ALLOWED_ORIGINS.split(",") 
  : ["http://localhost:3000"];

app.use(cors({
  origin: (origin, callback) => {
    if (!origin) return callback(null, true);
    if (allowedOrigins.indexOf(origin) === -1 && !allowedOrigins.includes("*")) {
      const msg = "The CORS policy for this site does not allow access from the specified Origin.";
      return callback(new Error(msg), false);
    }
    return callback(null, true);
  },
  credentials: true
}));

app.use(express.json());

app.use("/api/outlets", outletRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/inventory", inventoryRoutes);
app.use("/api/products", productRoutes);
app.use("/api/employees", employeeRoutes);
app.use("/api/agent/franchise-intelligence", intelligenceRoutes);

setupSwagger(app);

app.use(errorHandler);

module.exports = app;