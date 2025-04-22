const express = require("express");
const cors = require("cors");
const app = express();
const deliveryPersonRoutes = require("./routes/deliveryPerson.js");

app.use(cors());
app.use(express.json());

app.use("/api/delivery/delivery-person", deliveryPersonRoutes);

module.exports = app;
