const mongoose = require("mongoose");

const paymentSchema = new mongoose.Schema({
  amount: { type: Number, required: true },
  customerName: { type: String, required: true },
  customerId: { type: String, required: true },
  paymentIntentId: { type: String, required: true },
  status: { type: String, required: true },
  restaurantId: { type: String, required: true },
  orderId: { type: String }, // Populated after order creation
  orderItems: [
    {
      name: String,
      quantity: Number,
      price: Number,
    },
  ],
  date: { type: Date, default: Date.now },
});

module.exports = mongoose.model("Payment", paymentSchema);
