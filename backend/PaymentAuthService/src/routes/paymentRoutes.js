const express = require("express");
const { createPaymentIntent, updatePayment, getAllTransactions } = require("../controllers/paymentController.js");
const verifyToken = require("../middleware/auth.js");

const router = express.Router();

router.post("/intent", verifyToken, createPaymentIntent);
router.post("/update", verifyToken, updatePayment);
router.get("/transactions", verifyToken, getAllTransactions);

module.exports = router;