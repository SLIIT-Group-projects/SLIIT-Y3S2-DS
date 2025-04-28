import { useLocation, useParams, useNavigate } from "react-router-dom";
import { useState } from "react";
import axios from "axios";
import { Dialog } from "@headlessui/react";
import { loadStripe } from "@stripe/stripe-js";
import {
  Elements,
  CardNumberElement,
  CardExpiryElement,
  CardCvcElement,
  useStripe,
  useElements,
} from "@stripe/react-stripe-js";

const stripePromise = loadStripe("pk_test_51RGKwjQhd2Ny3K59mCs1TIaenoQpQUv7Yn4VHMEi7xFlpxWgSpLrnBJSbL57qFbYCJeqgpqoqjgpkOPtLiva0SlK00uEjqZ2Jy");

const PaymentForm = ({ amount, restaurantId, orderItems, onSuccess, onClose }) => {
  const stripe = useStripe();
  const elements = useElements();
  const [message, setMessage] = useState("");
  const [isProcessing, setIsProcessing] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!stripe || !elements) return;

    setIsProcessing(true);
    try {
      const token = localStorage.getItem("token");
      const { data } = await axios.post(
        "http://localhost:5005/api/payment/intent",
        {
          amount: Math.round(amount * 100), // Convert LKR to cents
          restaurantId,
          orderItems,
        },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      const result = await stripe.confirmCardPayment(data.clientSecret, {
        payment_method: {
          card: elements.getElement(CardNumberElement),
          billing_details: {
            name: "Test User", // Replace with user data if available
          },
        },
      });

      if (result.error) {
        setMessage(`❌ Payment failed: ${result.error.message}`);
        await axios.post(
          "http://localhost:5005/api/payment/update",
          { paymentId: data.paymentId, status: "failed" },
          { headers: { Authorization: `Bearer ${token}` } }
        );
      } else if (result.paymentIntent.status === "succeeded") {
        setMessage("✅ Payment successful!");
        onSuccess(data.paymentId);
      }
    } catch (error) {
      setMessage("❌ Error: " + error.message);
    } finally {
      setIsProcessing(false);
    }
  };

  const elementOptions = {
    style: {
      base: {
        fontSize: "16px",
        color: "#1F2937",
        "::placeholder": { color: "#9CA3AF" },
      },
      invalid: { color: "#EF4444" },
    },
  };

  return (
    <div className="p-6">
      <Dialog.Title className="text-2xl font-semibold text-gray-800 mb-6 text-center">
        Secure Payment
      </Dialog.Title>
      {message && (
        <div className="text-sm mb-6 text-center text-gray-700">{message}</div>
      )}
      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label htmlFor="card-number" className="block text-sm font-medium text-gray-700 mb-1">
            Card Number
          </label>
          <div className="p-3 border border-gray-300 rounded-lg">
            <CardNumberElement id="card-number" options={elementOptions} />
          </div>
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label htmlFor="card-expiry" className="block text-sm font-medium text-gray-700 mb-1">
              Expiration Date
            </label>
            <div className="p-3 border border-gray-300 rounded-lg">
              <CardExpiryElement id="card-expiry" options={elementOptions} />
            </div>
          </div>
          <div>
            <label htmlFor="card-cvc" className="block text-sm font-medium text-gray-700 mb-1">
              CVC
            </label>
            <div className="p-3 border border-gray-300 rounded-lg">
              <CardCvcElement id="card-cvc" options={elementOptions} />
            </div>
          </div>
        </div>
        <div className="flex justify-center gap-4">
          <button
            type="submit"
            className="bg-orange-500 text-white px-6 py-2 rounded-lg hover:bg-orange-600 transition font-medium disabled:bg-gray-400 disabled:cursor-not-allowed"
            disabled={!stripe || isProcessing}
          >
            {isProcessing ? "Processing..." : "Pay Now"}
          </button>
          <button
            type="button"
            onClick={onClose}
            className="bg-gray-300 text-gray-800 px-6 py-2 rounded-lg hover:bg-gray-400 transition"
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
};

function CheckoutPage() {
  const { restaurantId } = useParams();
  const location = useLocation();
  const navigate = useNavigate();
  const subtotal = location.state?.subtotal || 0;
  const items = location.state?.items || [];
  const deliveryCharge = 300;
  const total = subtotal + deliveryCharge;

  const [addressNo, setAddressNo] = useState("");
  const [addressStreet, setAddressStreet] = useState("");
  const [paymentMethod, setPaymentMethod] = useState("CashOnDelivery");
  const [mobileNumber, setMobileNumber] = useState("");
  const [isPaymentDialogOpen, setIsPaymentDialogOpen] = useState(false);

  const orderItems = items.map(item => ({
    name: item.name,
    quantity: item.quantity,
    price: item.price,
  }));

  const handlePlaceOrder = async () => {
    try {
      const token = localStorage.getItem("token");

      if (paymentMethod === "Card") {
        setIsPaymentDialogOpen(true);
        return;
      }

      const orderData = {
        restaurantId,
        paymentMethod,
        addressNo,
        addressStreet,
        longitude: 80.6385,
        latitude: 7.2906,
        deliveryCharge,
        mobileNumber,
        items: orderItems,
      };

      console.log("Sending order:", orderData);

      await axios.post("http://localhost:5003/api/order/place", orderData, {
        headers: { Authorization: `Bearer ${token}` },
      });

      alert("Order placed successfully!");
      navigate("/viewBasket");
    } catch (error) {
      console.error("Error placing order:", error);
      alert("Failed to place order. Please try again.");
    }
  };

  const handlePaymentSuccess = async (paymentId) => {
    const token = localStorage.getItem("token"); // Declare token outside try-catch
    try {
      const orderData = {
        restaurantId,
        paymentMethod,
        addressNo,
        addressStreet,
        longitude: 80.6385,
        latitude: 7.2906,
        deliveryCharge,
        mobileNumber,
        items: orderItems,
      };

      console.log("Sending order after payment:", orderData);

      const orderResponse = await axios.post("http://localhost:5003/api/order/place", orderData, {
        headers: { Authorization: `Bearer ${token}` },
      });

      await axios.post(
        "http://localhost:5005/api/payment/update",
        {
          paymentId,
          orderId: orderResponse.data._id,
          status: "succeeded",
        },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      alert("Order placed successfully!");
      setIsPaymentDialogOpen(false);
      navigate("/viewBasket");
    } catch (error) {
      console.error("Error placing order after payment:", error);
      await axios.post(
        "http://localhost:5005/api/payment/update",
        {
          paymentId,
          status: "failed",
        },
        {
          headers: { Authorization: `Bearer ${token}` }, // Now token is defined
        }
      );
      alert("Failed to place order after payment. Please try again.");
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <h1 className="text-3xl font-bold mb-6">Checkout</h1>

      {/* Address Fields */}
      <div className="bg-white p-6 rounded-lg shadow-md mb-6 space-y-4">
        <h2 className="text-xl font-semibold mb-4">Delivery Address</h2>
        <input
          type="text"
          placeholder="Building / Address No"
          value={addressNo}
          onChange={(e) => setAddressNo(e.target.value)}
          className="w-full p-3 border rounded"
          required
        />
        <input
          type="text"
          placeholder="Street"
          value={addressStreet}
          onChange={(e) => setAddressStreet(e.target.value)}
          className="w-full p-3 border rounded"
          required
        />
      </div>

      {/* Mobile Number */}
      <div className="bg-white p-6 rounded-lg shadow-md mb-6 space-y-4">
        <h2 className="text-xl font-semibold mb-4">Mobile Number</h2>
        <input
          type="text"
          placeholder="Enter your mobile number"
          value={mobileNumber}
          onChange={(e) => setMobileNumber(e.target.value)}
          className="w-full p-3 border rounded"
          required
        />
      </div>

      {/* Payment Method */}
      <div className="bg-white p-6 rounded-lg shadow-md mb-6">
        <h2 className="text-xl font-semibold mb-4">Payment Method</h2>
        <div className="flex gap-6">
          <label className="flex items-center gap-2">
            <input
              type="radio"
              value="Card"
              checked={paymentMethod === "Card"}
              onChange={(e) => setPaymentMethod(e.target.value)}
            />
            Card
          </label>
          <label className="flex items-center gap-2">
            <input
              type="radio"
              value="CashOnDelivery"
              checked={paymentMethod === "CashOnDelivery"}
              onChange={(e) => setPaymentMethod(e.target.value)}
            />
            Cash on Delivery
          </label>
        </div>
      </div>

      {/* Order Summary */}
      <div className="bg-white p-6 rounded-lg shadow-md mb-6">
        <h2 className="text-xl font-semibold mb-4">Summary</h2>
        {items.map((item, index) => (
          <div key={index} className="flex justify-between mb-2">
            <span>{item.name} x {item.quantity}</span>
            <span>Rs {(item.price * item.quantity).toFixed(2)}</span>
          </div>
        ))}
        <div className="flex justify-between mb-2">
          <span>Subtotal:</span>
          <span>Rs {subtotal.toFixed(2)}</span>
        </div>
        <div className="flex justify-between mb-2">
          <span>Delivery Charge:</span>
          <span>Rs {deliveryCharge.toFixed(2)}</span>
        </div>
        <div className="flex justify-between font-bold text-lg">
          <span>Total Amount:</span>
          <span>Rs {total.toFixed(2)}</span>
        </div>
      </div>

      {/* Place Order Button */}
      <div className="flex justify-end">
        <button
          onClick={handlePlaceOrder}
          className="bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded-lg font-semibold"
        >
          Place Order
        </button>
      </div>

      {/* Payment Popup */}
      <Dialog
        open={isPaymentDialogOpen}
        onClose={() => setIsPaymentDialogOpen(false)}
        className="relative z-50"
      >
        <div className="fixed inset-0 bg-black/30" aria-hidden="true" />
        <div className="fixed inset-0 flex items-center justify-center p-4">
          <Dialog.Panel className="bg-white rounded-lg max-w-lg w-full shadow-lg">
            <Elements stripe={stripePromise}>
              <PaymentForm
                amount={total}
                restaurantId={restaurantId}
                orderItems={orderItems}
                onSuccess={handlePaymentSuccess}
                onClose={() => setIsPaymentDialogOpen(false)}
              />
            </Elements>
          </Dialog.Panel>
        </div>
      </Dialog>
    </div>
  );
}

export default CheckoutPage;