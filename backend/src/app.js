const express = require("express");
const cors = require("cors");

const outletRoutes = require("./routes/outletRoutes");
const productRoutes = require("./routes/productRoutes");
const employeeRoutes = require("./routes/employeeRoutes");
const setupSwagger = require("./swagger");
const errorHandler = require("./middlewares/errorHandler");

const app = express();

app.use(cors());
app.use(express.json());

app.use("/api/outlets", outletRoutes);
app.use("/api/products", productRoutes);
app.use("/api/employees", employeeRoutes);

setupSwagger(app);

app.use(errorHandler);

module.exports = app;