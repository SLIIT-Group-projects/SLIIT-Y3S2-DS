const express = require("express");
const  {createPaymentIntent, getAllTransactions}  = require("../controllers/paymentController.js");

const router = express.Router();
router.post("/intent", createPaymentIntent);

// Get all transactions
router.get("/transactions", getAllTransactions);

module.exports = router;