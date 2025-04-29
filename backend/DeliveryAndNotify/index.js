require("dotenv").config();
const mongoose = require("mongoose");
const app = require("./app");
const http = require("http"); // ✅ new: import http
const { Server } = require("socket.io"); // ✅ new: import socket.io

const PORT = process.env.PORT || 8000;

// Create an HTTP server manually from your Express app
const server = http.createServer(app); // ✅

const io = new Server(server, {
  cors: {
    origin: "*", // or your frontend URL if you want to restrict
    methods: ["GET", "POST"],
  },
});

// Setup Socket.IO connection
io.on("connection", (socket) => {
  console.log("A user connected:", socket.id);

  // Customer joins the delivery room
  socket.on("joinDeliveryRoom", (deliveryId) => {
    socket.join(deliveryId);
    console.log(`User ${socket.id} joined room: ${deliveryId}`);
  });

  // Driver sends their live location
  socket.on("driverLocationUpdate", (data) => {
    const { deliveryId, latitude, longitude } = data;
    console.log(
      `Driver for delivery ${deliveryId} moved to:`,
      latitude,
      longitude
    );

    // ✅ Emit only to customers in the same room
    io.to(deliveryId).emit("driverLocationUpdate", { latitude, longitude });
  });

  socket.on("disconnect", () => {
    console.log("User disconnected:", socket.id);
  });
});

// Now connect MongoDB
mongoose
  .connect(process.env.MONGO_URI, {})
  .then(() => {
    console.log("MongoDB connected");

    // Notice we listen on server, not app
    server.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });
  })
  .catch((err) => {
    console.log(err.message);
  });
