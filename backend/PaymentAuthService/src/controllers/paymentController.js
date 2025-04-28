const stripe = require("../config/stripe.js");
const Payment = require("../models/Payment.js");

exports.createPaymentIntent = async (req, res) => {
  const { amount } = req.body;

  if (!amount) return res.status(400).json({ message: "Amount is required" });

  try {
    const paymentIntent = await stripe.paymentIntents.create({
      amount,
      currency: "lkr",
      payment_method_types: ["card"],
    });

    

    await Payment.create({
      amount,
      customerName: "Test User", // or dynamic from frontend
      paymentIntentId: paymentIntent.id,
      status: "succeeded",
      date: new Date(),
    });

    res.status(200).json({ clientSecret: paymentIntent.client_secret });


  } catch (error) {
    console.error("Stripe error:", error.message);
    res.status(500).json({ message: "Payment failed", error: error.message });
  }
};


// 🆕 New controller to get all transactions
exports.getAllTransactions = async (req, res) => {
  try {
    const transactions = await Payment.find().sort({ date: -1 });
    res.status(200).json(transactions);
  } catch (error) {
    console.error("Transaction fetch error:", error.message);
    res.status(500).json({ message: "Failed to fetch transactions" });
  }
};
