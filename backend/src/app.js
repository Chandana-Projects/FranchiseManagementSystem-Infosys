const express = require("express");
const cors = require("cors");

const outletRoutes = require("./routes/outletRoutes");

const app = express();

app.use(cors());
app.use(express.json());

app.use("/api/outlets", outletRoutes);

module.exports = app;