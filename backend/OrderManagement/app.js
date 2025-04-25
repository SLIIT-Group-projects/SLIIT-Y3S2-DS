const express = require("express");
const cors = require("cors");
const app = express();
const cartRoutes = require("./routes/cartRoutes.js");
const orderRoutes = require("./routes/orderRoutes.js");

app.use(cors());
app.use(express.json());

app.use("/api/cart", cartRoutes);
app.use("/api/order",orderRoutes);

module.exports = app;
