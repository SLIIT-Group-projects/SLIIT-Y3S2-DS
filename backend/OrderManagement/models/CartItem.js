// models/cartItem.js
const mongoose = require("mongoose");

const cartItemSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },
    restaurantId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Restaurant",
      required: true,
    },
    menuItemId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "MenuItem",
      required: true,
    },
    quantity: {
      type: Number,
      required: true,
      default: 1,
      min: 1,
    },
    name: String,
    price: Number,
    imageUrl: String,
    preparationTime: Number,
  },
  { timestamps: true }
);

// Compound index for user + restaurant (1 cart per restaurant per user)
cartItemSchema.index({ userId: 1, restaurantId: 1 });

module.exports = mongoose.model("CartItem", cartItemSchema);
