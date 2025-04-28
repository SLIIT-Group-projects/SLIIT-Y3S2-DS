// backend/PaymentAuthService/src/models/payment.js
const mongoose = require('mongoose');

const paymentSchema = new mongoose.Schema({
  amount: Number,
  customerName: String,
  paymentIntentId: String,
  status: String,
  date: { type: Date, default: Date.now }
});

module.exports= mongoose.model("Payment", paymentSchema);
