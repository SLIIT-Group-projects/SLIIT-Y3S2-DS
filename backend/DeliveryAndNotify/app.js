const express = require("express");
const cors = require("cors");
const app = express();
const deliveryPersonRoutes = require("./routes/deliveryPerson.js");
const deliveryOrderRoutes = require("./routes/deliveryOrder.js");

app.use(cors());
app.use(express.json());

app.use("/api/delivery/delivery-person", deliveryPersonRoutes);
app.use("/api/delivery-orders", deliveryOrderRoutes);

module.exports = app;
