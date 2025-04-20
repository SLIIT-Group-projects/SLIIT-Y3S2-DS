require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const authRoutes = require("./src/routes/userRoute");
const cors = require("cors");

const app = express();
app.use(cors());
app.use(express.json());



mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log("MongoDB connected"));

app.use("/api/auth", authRoutes);

const PORT = process.env.PORT || 5001;
app.listen(PORT, () => console.log(`User service running on port ${PORT}`));
