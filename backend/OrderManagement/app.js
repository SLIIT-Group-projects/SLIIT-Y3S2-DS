const express = require("express");
const cors = require("cors");
const app = express();
const orderRoutes = require("./routes/cartRoutes.js");

app.use(cors());
app.use(express.json());

app.use("/api/order", orderRoutes);

module.exports = app;
