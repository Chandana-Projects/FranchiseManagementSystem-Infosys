const express = require("express");
const cors = require("cors");

const outletRoutes = require("./routes/outletRoutes");
const authRoutes = require("./routes/authRoutes");
const inventoryRoutes = require("./routes/inventoryRoutes");

const app = express();

app.use(cors());
app.use(express.json());

app.use("/api/outlets", outletRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/inventory", inventoryRoutes);

module.exports = app;