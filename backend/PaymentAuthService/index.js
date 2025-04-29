require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const paymentRoute = require("./src/routes/paymentRoutes")

const app = express();
app.use(cors());
app.use(express.json());



mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log("MongoDB connected"));



const PORT = process.env.PORT || 5005;
app.listen(PORT, () => console.log(`User service running on port ${PORT}`));

app.use("/api/payment", paymentRoute)
