import { useLocation, useParams, useNavigate } from "react-router-dom";
import { useState } from "react";
import axios from "axios";
import Swal from "sweetalert2";
import { Dialog } from "@headlessui/react";
import { MapContainer, TileLayer, Marker, useMapEvents } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import { loadStripe } from "@stripe/stripe-js";
import { Elements, CardNumberElement, CardExpiryElement, CardCvcElement, useStripe, useElements } from "@stripe/react-stripe-js";

const stripePromise = loadStripe("pk_test_51RGKwjQhd2Ny3K59mCs1TIaenoQpQUv7Yn4VHMEi7xFlpxWgSpLrnBJSbL57qFbYCJeqgpqoqjgpkOPtLiva0SlK00uEjqZ2Jy");

// Fix Leaflet default icon
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
  iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
  shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
});

function PaymentForm({ amount, onSuccess, onClose }) {
  const stripe = useStripe();
  const elements = useElements();
  const [message, setMessage] = useState("");
  const [isProcessing, setIsProcessing] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!stripe || !elements) return;

    setIsProcessing(true);
    const token = localStorage.getItem("token");

    try {
      const { data } = await axios.post(
        "http://localhost:5005/api/payment/intent",
        { amount: Math.round(amount * 100) },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      const result = await stripe.confirmCardPayment(data.clientSecret, {
        payment_method: {
          card: elements.getElement(CardNumberElement),
          billing_details: { name: "Test User" },
        },
      });

      if (result.error) {
        setMessage(`❌ Payment failed: ${result.error.message}`);
        await axios.post("http://localhost:5005/api/payment/update", { paymentId: data.paymentId, status: "failed" }, { headers: { Authorization: `Bearer ${token}` } });
      } else if (result.paymentIntent.status === "succeeded") {
        setMessage("✅ Payment successful!");
        onSuccess(data.paymentId);
      }
    } catch (err) {
      console.error(err);
      setMessage("❌ Error processing payment.");
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="p-6">
      <Dialog.Title className="text-2xl font-semibold text-gray-800 mb-6 text-center">Secure Payment</Dialog.Title>
      {message && <div className="text-sm mb-6 text-center text-gray-700">{message}</div>}
      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label className="block text-sm font-medium mb-1">Card Number</label>
          <div className="p-3 border rounded"><CardNumberElement /></div>
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium mb-1">Expiration Date</label>
            <div className="p-3 border rounded"><CardExpiryElement /></div>
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">CVC</label>
            <div className="p-3 border rounded"><CardCvcElement /></div>
          </div>
        </div>
        <div className="flex justify-center gap-4">
          <button disabled={!stripe || isProcessing} type="submit" className="bg-orange-500 text-white px-6 py-2 rounded hover:bg-orange-600 disabled:bg-gray-400">
            {isProcessing ? "Processing..." : "Pay Now"}
          </button>
          <button onClick={onClose} type="button" className="bg-gray-300 text-black px-6 py-2 rounded hover:bg-gray-400">Cancel</button>
        </div>
      </form>
    </div>
  );
}

function CheckoutPage() {
  const { restaurantId } = useParams();
  const location = useLocation();
  const navigate = useNavigate();

  const subtotal = location.state?.subtotal || 0;
  const items = location.state?.items || [];
  const [addressNo, setAddressNo] = useState("");
  const [addressStreet, setAddressStreet] = useState("");
  const [mobileNumber, setMobileNumber] = useState("");
  const [paymentMethod, setPaymentMethod] = useState("CashOnDelivery");
  const [userCoords, setUserCoords] = useState(null);
  const [deliveryCharge, setDeliveryCharge] = useState(0);
  const [distanceKm, setDistanceKm] = useState(null);
  const [isPaymentDialogOpen, setIsPaymentDialogOpen] = useState(false);

  const restaurantCoords = { latitude: 7.2906, longitude: 80.6385 };

  function calculateDistance(lat1, lon1, lat2, lon2) {
    const R = 6371;
    const dLat = (lat2 - lat1) * (Math.PI / 180);
    const dLon = (lon2 - lon1) * (Math.PI / 180);
    const a = Math.sin(dLat/2) ** 2 + Math.cos(lat1 * Math.PI/180) * Math.cos(lat2 * Math.PI/180) * Math.sin(dLon/2) ** 2;
    return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
  }

  const processCoords = async (coords) => {
    setUserCoords(coords);
    const distance = calculateDistance(coords.latitude, coords.longitude, restaurantCoords.latitude, restaurantCoords.longitude);
    setDistanceKm(distance);
    if (distance > 5) {
      Swal.fire("Delivery Error", `You are ${distance.toFixed(2)} km away. Delivery available only within 5 km.`, "error");
      setDeliveryCharge(0);
    } else {
      const charge = Math.ceil(distance) * 100;
      setDeliveryCharge(charge);
      Swal.fire("Location Confirmed", `You're ${distance.toFixed(2)} km away. Delivery charge: Rs ${charge}.`, "success");
    }
  };

  const LocationSelector = () => {
    useMapEvents({
      click(e) {
        processCoords({ latitude: e.latlng.lat, longitude: e.latlng.lng });
      }
    });
    return null;
  };

  const handlePlaceOrder = async () => {
    if (!addressNo || !addressStreet || !mobileNumber) {
      Swal.fire("Error", "Please fill in all fields.", "error");
      return;
    }

    if (paymentMethod === "Card") {
      setIsPaymentDialogOpen(true);
      return;
    }

    await placeOrder();
  };

  const placeOrder = async (paymentId = null) => {
    try {
      const token = localStorage.getItem("token");
      const orderData = {
        restaurantId,
        paymentMethod,
        addressNo,
        addressStreet,
        longitude: userCoords?.longitude || restaurantCoords.longitude,
        latitude: userCoords?.latitude || restaurantCoords.latitude,
        deliveryCharge,
        mobileNumber,
        items,
      };

      const { data } = await axios.post("http://localhost:5003/api/order/place", orderData, {
        headers: { Authorization: `Bearer ${token}` }
      });

      if (paymentId) {
        await axios.post("http://localhost:5005/api/payment/update", { paymentId, orderId: data._id, status: "succeeded" }, { headers: { Authorization: `Bearer ${token}` } });
      }

      Swal.fire("Order Placed!", "Your food is on the way!", "success");
      navigate("/viewBasket");
    } catch (err) {
      console.error(err);
      Swal.fire("Error", "Failed to place order.", "error");
    }
  };

  return (
    <div className="min-h-screen p-6 bg-gray-100">
      <h1 className="text-3xl font-bold mb-6">Checkout</h1>

      {/* Address section */}
      <div className="bg-white p-6 rounded shadow mb-6">
        <h2 className="text-xl font-semibold mb-4">Delivery Address</h2>
        <input type="text" placeholder="Building / Address No" value={addressNo} onChange={(e) => setAddressNo(e.target.value)} className="w-full mb-4 p-3 border rounded" />
        <input type="text" placeholder="Street" value={addressStreet} onChange={(e) => setAddressStreet(e.target.value)} className="w-full mb-4 p-3 border rounded" />
        <MapContainer center={[restaurantCoords.latitude, restaurantCoords.longitude]} zoom={13} style={{ height: 300, width: "100%" }} className="rounded shadow">
          <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
          <Marker position={[restaurantCoords.latitude, restaurantCoords.longitude]} />
          {userCoords && <Marker position={[userCoords.latitude, userCoords.longitude]} />}
          <LocationSelector />
        </MapContainer>
        {distanceKm !== null && <p className="mt-2 text-gray-600">Distance: {distanceKm.toFixed(2)} km — Delivery Charge: Rs {deliveryCharge}</p>}
      </div>

      {/* Mobile number */}
      <div className="bg-white p-6 rounded shadow mb-6">
        <h2 className="text-xl font-semibold mb-4">Mobile Number</h2>
        <input type="text" placeholder="Mobile Number" value={mobileNumber} onChange={(e) => setMobileNumber(e.target.value)} className="w-full p-3 border rounded" />
      </div>

      {/* Payment method */}
      <div className="bg-white p-6 rounded shadow mb-6">
        <h2 className="text-xl font-semibold mb-4">Payment Method</h2>
        <div className="flex gap-6">
          <label><input type="radio" value="Card" checked={paymentMethod === "Card"} onChange={(e) => setPaymentMethod(e.target.value)} /> Card</label>
          <label><input type="radio" value="CashOnDelivery" checked={paymentMethod === "CashOnDelivery"} onChange={(e) => setPaymentMethod(e.target.value)} /> Cash on Delivery</label>
        </div>
      </div>

      {/* Summary */}
      <div className="bg-white p-6 rounded shadow mb-6">
        <h2 className="text-xl font-semibold mb-4">Order Summary</h2>
        {items.map((item, i) => (
          <div key={i} className="flex justify-between mb-2">
            <span>{item.name} x {item.quantity}</span>
            <span>Rs {(item.price * item.quantity).toFixed(2)}</span>
          </div>
        ))}
        <div className="flex justify-between mb-2"><span>Subtotal:</span><span>Rs {subtotal.toFixed(2)}</span></div>
        <div className="flex justify-between mb-2"><span>Delivery Charge:</span><span>Rs {deliveryCharge}</span></div>
        <div className="flex justify-between font-bold text-lg"><span>Total:</span><span>Rs {(subtotal + deliveryCharge).toFixed(2)}</span></div>
      </div>

      {/* Place order */}
      <div className="flex justify-end">
        <button onClick={handlePlaceOrder} className="bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded-lg">Place Order</button>
      </div>

      {/* Payment dialog */}
      <Dialog open={isPaymentDialogOpen} onClose={() => setIsPaymentDialogOpen(false)} className="relative z-50">
        <div className="fixed inset-0 bg-black/30" aria-hidden="true" />
        <div className="fixed inset-0 flex items-center justify-center p-4">
          <Dialog.Panel className="bg-white rounded-lg max-w-lg w-full shadow-lg">
            <Elements stripe={stripePromise}>
              <PaymentForm amount={subtotal + deliveryCharge} onSuccess={(paymentId) => placeOrder(paymentId)} onClose={() => setIsPaymentDialogOpen(false)} />
            </Elements>
          </Dialog.Panel>
        </div>
      </Dialog>
    </div>
  );
}

export default CheckoutPage;