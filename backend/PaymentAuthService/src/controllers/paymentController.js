const stripe = require("../config/stripe.js");
const Payment = require("../models/Payment.js");
const axios = require("axios");

exports.createPaymentIntent = async (req, res) => {
  const { amount, restaurantId, orderItems } = req.body;

  if (!amount || !restaurantId) {
    return res.status(400).json({ message: "Amount and restaurantId are required" });
  }

  try {
    const { id } = req.user; // User ID from JWT token

    // Fetch user data from User Service
    let user;
    try {
      const userResponse = await axios.get(`http://localhost:5001/api/auth/user/${id}`, {
        headers: { Authorization: req.headers.authorization },
      });
      user = userResponse.data;
    } catch (userError) {
      console.error("User Service error:", userError.message);
      return res.status(500).json({ message: "Failed to fetch user details" });
    }

    if (!user || !user.name) {
      return res.status(404).json({ message: "User not found or invalid" });
    }

    const paymentIntent = await stripe.paymentIntents.create({
      amount,
      currency: "lkr",
      payment_method_types: ["card"],
      metadata: {
        userId: id,
        userName: user.name,
        restaurantId,
      },
    });

    const payment = await Payment.create({
      amount,
      customerName: user.name,
      customerId: id,
      paymentIntentId: paymentIntent.id,
      status: "pending",
      restaurantId,
      orderItems: orderItems || [],
      date: new Date(),
    });

    res.status(200).json({ 
      clientSecret: paymentIntent.client_secret,
      paymentId: payment._id
    });
  } catch (error) {
    console.error("Stripe error:", error.message);
    res.status(500).json({ message: "Payment failed", error: error.message });
  }
};

exports.updatePayment = async (req, res) => {
  const { paymentId, orderId, status } = req.body;

  if (!paymentId || !status) {
    return res.status(400).json({ message: "paymentId and status are required" });
  }

  try {
    const payment = await Payment.findById(paymentId);
    if (!payment) {
      return res.status(404).json({ message: "Payment not found" });
    }

    payment.orderId = orderId || payment.orderId; // orderId is optional
    payment.status = status;
    await payment.save();

    res.status(200).json({ message: "Payment updated successfully", payment });
  } catch (error) {
    console.error("Payment update error:", error.message);
    res.status(500).json({ message: "Failed to update payment", error: error.message });
  }
};

exports.getAllTransactions = async (req, res) => {
  try {
    const transactions = await Payment.find().sort({ date: -1 });
    res.status(200).json(transactions);
  } catch (error) {
    console.error("Transaction fetch error:", error.message);
    res.status(500).json({ message: "Failed to fetch transactions" });
  }
};