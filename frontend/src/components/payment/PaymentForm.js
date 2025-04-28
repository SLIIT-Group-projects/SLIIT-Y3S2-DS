import { useState } from "react";
import { loadStripe } from "@stripe/stripe-js";
import {
  Elements,
  CardNumberElement,
  CardExpiryElement,
  CardCvcElement,
  useStripe,
  useElements,
} from "@stripe/react-stripe-js";
import axios from "axios";

// Replace with your Stripe publishable key
const stripePromise = loadStripe("pk_test_51RGKwjQhd2Ny3K59mCs1TIaenoQpQUv7Yn4VHMEi7xFlpxWgSpLrnBJSbL57qFbYCJeqgpqoqjgpkOPtLiva0SlK00uEjqZ2Jy");

const CheckoutForm = () => {
  const [amount, setAmount] = useState("75000"); // Dummy amount in LKR cents (75.00 LKR)
  const [message, setMessage] = useState("");
  const stripe = useStripe();
  const elements = useElements();

  // Dummy order details
  const orderDetails = {
    items: [
      { name: "Margherita Pizza", quantity: 5, price: 2500 }, // 25.00 LKR
      { name: "Cheese Burger", quantity: 10, price: 1500 },   // 15.00 LKR each
      { name: "French Fries", quantity: 1, price: 1000 },    // 10.00 LKR
    ],
    deliveryFee: 500, // 5.00 LKR
    total: 75000,      // 75.00 LKR
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!stripe || !elements) return;

    try {
      const { data } = await axios.post("http://localhost:5005/api/payment/intent", {
        amount: parseInt(amount),
      });

      const result = await stripe.confirmCardPayment(data.clientSecret, {
        payment_method: {
          card: elements.getElement(CardNumberElement),
          billing_details: {
            name: "Test User",
          },
        },
      });

      if (result.error) {
        setMessage(`❌ Payment failed: ${result.error.message}`);
      } else {
        if (result.paymentIntent.status === "succeeded") {
          setMessage("✅ Payment successful!");
        }
      }
    } catch (error) {
      setMessage("❌ Error: " + error.message);
    }
  };

  const elementOptions = {
    style: {
      base: {
        fontSize: "16px",
        color: "#1F2937",
        "::placeholder": {
          color: "#9CA3AF",
        },
      },
      invalid: {
        color: "#EF4444",
      },
    },
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 p-6">
      <div className="max-w-4xl w-full bg-white shadow-md rounded-lg flex overflow-hidden">
        {/* Left Side - Order Details */}
        <div className="w-full md:w-1/2 p-8 bg-gray-50 border-r border-gray-200">
          <h3 className="text-xl font-semibold text-gray-800 mb-6">Order Summary</h3>
          <div className="space-y-4">
            {orderDetails.items.map((item, index) => (
              <div key={index} className="flex justify-between text-gray-700">
                <span>{item.name} x {item.quantity}</span>
                <span>{(item.price * item.quantity)} LKR</span>
              </div>
            ))}
            <div className="flex justify-between text-gray-700 pt-4 border-t border-gray-200">
              <span>Delivery Fee</span>
              <span>{orderDetails.deliveryFee } LKR</span>
            </div>
            <div className="flex justify-between text-lg font-semibold text-gray-800 pt-4 border-t border-gray-200">
              <span>Total</span>
              <span>{orderDetails.total} LKR</span>
            </div>
          </div>
        </div>

        {/* Right Side - Payment Form */}
        <div className="w-full md:w-1/2 p-8">
          <h2 className="text-2xl font-semibold text-gray-800 mb-6 text-center">Secure Payment</h2>
          {message && (
            <div className="text-sm mb-6 text-center text-gray-700">{message}</div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label htmlFor="amount" className="block text-sm font-medium text-gray-700 mb-1">
                Amount (in LKR cents)
              </label>
              <input
                id="amount"
                type="number"
                placeholder="Enter amount"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 text-gray-800 placeholder-gray-400"
                readOnly
              />
            </div>
            <div>
              <label htmlFor="card-number" className="block text-sm font-medium text-gray-700 mb-1">
                Card Number
              </label>
              <div className="p-3 border border-gray-300 rounded-lg">
                <CardNumberElement
                  id="card-number"
                  options={elementOptions}
                />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label htmlFor="card-expiry" className="block text-sm font-medium text-gray-700 mb-1">
                  Expiration Date
                </label>
                <div className="p-3 border border-gray-300 rounded-lg">
                  <CardExpiryElement
                    id="card-expiry"
                    options={elementOptions}
                  />
                </div>
              </div>
              <div>
                <label htmlFor="card-cvc" className="block text-sm font-medium text-gray-700 mb-1">
                  CVC
                </label>
                <div className="p-3 border border-gray-300 rounded-lg">
                  <CardCvcElement
                    id="card-cvc"
                    options={elementOptions}
                  />
                </div>
              </div>
            </div>
            <button
              type="submit"
              className="w-full bg-orange-500 text-white p-3 rounded-lg hover:bg-orange-600 transition duration-300 font-medium disabled:bg-gray-400 disabled:cursor-not-allowed"
              disabled={!stripe}
            >
              Process Payment
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

const PaymentForm = () => {
  return (
    <Elements stripe={stripePromise}>
      <CheckoutForm />
    </Elements>
  );
};

export default PaymentForm;