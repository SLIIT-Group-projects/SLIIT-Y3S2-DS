require("dotenv").config();
const mongoose = require("mongoose");
const app = require("./app");

const PORT = process.env.PORT || 8000;

mongoose
  .connect(process.env.MONGO_URI, {})
  .then(() => {
    console.log("mongo db connected");
    app.listen(PORT, () => {
      console.log(`server is running on port ${PORT}`);
    });
  })
  .catch((err) => {
    console.log(err.message);
  });
