const express = require("express");
const cors = require("cors");

const outletRoutes = require("./routes/outletRoutes");
const authRoutes = require("./routes/authRoutes");
const inventoryRoutes = require("./routes/inventoryRoutes");
const productRoutes = require("./routes/productRoutes");
const employeeRoutes = require("./routes/employeeRoutes");
const intelligenceRoutes = require("./routes/intelligenceRoutes");
const setupSwagger = require("./swagger");
const errorHandler = require("./middlewares/errorHandler");

const app = express();

app.use(cors());
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