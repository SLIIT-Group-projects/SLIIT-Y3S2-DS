const express = require("express");
const app = express();
const deliveryPersonRoutes = require("./routes/deliveryPerson.js");

app.use(express.json());

app.use("/delivery/deliveryPerson", deliveryPersonRoutes);

module.exports = app;
