const mongoose = require("mongoose");

const orderSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    restaurantId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Restaurant",
      required: true,
    },
    items: [
      {
        menuItem: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "MenuItem",
        },
        name: String,
        quantity: Number,
        price: Number,
        totalPrice: Number,
      },
    ],
    subtotal: {
      type: Number,
      required: true,
    },
    deliveryCharge: {
      type: Number,
      required: true,
    },
    totalAmount: {
      type: Number,
      required: true,
    },
    paymentMethod: {
      type: String,
      enum: ["CashOnDelivery", "Card"],
      required: true,
    },
    address: {
      no: { type: String, required: true },
      street: { type: String, required: true },
    },
    location: {
      longitude: { type: Number, required: true },
      latitude: { type: Number, required: true },
    },
    status: {
      type: String,
      enum: ["Pending", "Confirmed", "Preparing", "OutForDelivery", "Delivered"],
      default: "Pending",
    },
  },
  { timestamps: true }
);


module.exports = mongoose.model("Order", orderSchema);
