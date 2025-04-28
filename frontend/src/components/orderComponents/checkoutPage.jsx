import { useLocation, useParams, useNavigate } from "react-router-dom";
import { useState } from "react";
import axios from "axios";

function CheckoutPage() {
  const { restaurantId } = useParams();
  const location = useLocation();
  const navigate = useNavigate();
  const subtotal = location.state?.subtotal || 0;
  const deliveryCharge = 300; // fixed delivery charge

  const [addressNo, setAddressNo] = useState("");
  const [addressStreet, setAddressStreet] = useState("");
  const [paymentMethod, setPaymentMethod] = useState("CashOnDelivery");
  const [mobileNumber, setMobileNumber] = useState(""); // New state for mobile number

  const handlePlaceOrder = async () => {
    try {
      const token = localStorage.getItem("token");

      // If payment method is Card, redirect to the payment page
      if (paymentMethod === "Card") {
        navigate("/payment"); // Redirect to /payment route
        return;
      }

      const orderData = {
        restaurantId: restaurantId,
        paymentMethod: paymentMethod,
        addressNo: addressNo,
        addressStreet: addressStreet,
        longitude: 80.6385,  // hardcoded
        latitude: 7.2906,    // hardcoded
        deliveryCharge: deliveryCharge,
        mobileNumber: mobileNumber,  // Include mobile number in order data
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
          <span>Rs {(subtotal + deliveryCharge).toFixed(2)}</span>
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
    </div>
  );
}

export default CheckoutPage;
