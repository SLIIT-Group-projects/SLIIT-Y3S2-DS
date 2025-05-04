import { useLocation, useParams, useNavigate } from "react-router-dom";
import { useState } from "react";
import axios from "axios";
import Swal from "sweetalert2";
import { Dialog } from "@headlessui/react";
import { MapContainer, TileLayer, Marker, useMapEvents } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import { loadStripe } from "@stripe/stripe-js";
import {
  Elements,
  CardNumberElement,
  CardExpiryElement,
  CardCvcElement,
  useStripe,
  useElements,
} from "@stripe/react-stripe-js";
import NavBar from "../NavBar";

const stripePromise = loadStripe("pk_test_51RGKwjQhd2Ny3K59mCs1TIaenoQpQUv7Yn4VHMEi7xFlpxWgSpLrnBJSbL57qFbYCJeqgpqoqjgpkOPtLiva0SlK00uEjqZ2Jy");

// Fix Leaflet default icon
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
  iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
  shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
});

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
            name: "Test User",
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
  const restaurantCoords = { latitude: 7.2906, longitude: 80.6385 };

  const [addressNo, setAddressNo] = useState("");
  const [addressStreet, setAddressStreet] = useState("");
  const [paymentMethod, setPaymentMethod] = useState("CashOnDelivery");
  const [mobileNumber, setMobileNumber] = useState("");
  const [isPaymentDialogOpen, setIsPaymentDialogOpen] = useState(false);
  const [userCoords, setUserCoords] = useState(null);
  const [deliveryCharge, setDeliveryCharge] = useState(0);
  const [distanceKm, setDistanceKm] = useState(null);
  const [useMap, setUseMap] = useState(false);
  const [disableOrder, setDisableOrder] = useState(false);

  const orderItems = items.map((item) => ({
    name: item.name,
    quantity: item.quantity,
    price: item.price,
  }));

  function calculateDistance(lat1, lon1, lat2, lon2) {
    const R = 6371;
    const dLat = (lat2 - lat1) * (Math.PI / 180);
    const dLon = (lon2 - lon1) * (Math.PI / 180);
    const a =
      Math.sin(dLat / 2) ** 2 +
      Math.cos(lat1 * (Math.PI / 180)) *
        Math.cos(lat2 * (Math.PI / 180)) *
        Math.sin(dLon / 2) ** 2;
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c;
  }

  const processCoords = async (coords) => {
    setUserCoords(coords);

    try {
      const res = await axios.get(
        `https://nominatim.openstreetmap.org/reverse?format=jsonv2&lat=${coords.latitude}&lon=${coords.longitude}`
      );

      const address = res.data?.address;
      if (address) {
        setAddressNo(Math.floor(Math.random() * 900 + 100).toString());
        setAddressStreet(
          address.road ||
            address.neighbourhood ||
            address.suburb ||
            address.village ||
            ""
        );
      }
    } catch (err) {
      console.error("Reverse geocoding error:", err);
    }

    const distance = calculateDistance(
      coords.latitude,
      coords.longitude,
      restaurantCoords.latitude,
      restaurantCoords.longitude
    );

    const roundedDistance = Math.ceil(distance);
    setDistanceKm(distance);

    if (distance > 5) {
      Swal.fire(
        "Delivery Error",
        `You are ${distance.toFixed(2)} km away. Delivery is only available within 5 km.`,
        "error"
      );
      setDisableOrder(true);
      setDeliveryCharge(0);
    } else {
      const calculatedCharge = roundedDistance * 100;
      setDeliveryCharge(calculatedCharge);
      Swal.fire(
        "Location Confirmed",
        `You're ${distance.toFixed(2)} km away. Delivery charge: Rs ${calculatedCharge}`,
        "success"
      );
      setDisableOrder(false);
    }
  };

  const handleAddressOk = async () => {
    const fullAddress = `${addressNo}, ${addressStreet}`;
    if (!addressNo || !addressStreet) {
      Swal.fire("Error", "Please enter full address before confirming.", "error");
      return;
    }

    Swal.fire({
      title: "Confirm Address",
      text: `Use this address for delivery?\n${fullAddress}`,
      icon: "question",
      showCancelButton: true,
      confirmButtonText: "OK",
    }).then(async (result) => {
      if (!result.isConfirmed) return;

      try {
        const geoRes = await axios.get(
          `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(
            fullAddress
          )}`
        );

        if (!geoRes.data.length) {
          Swal.fire("Error", "Unable to locate the address.", "error");
          return;
        }

        const coords = {
          latitude: parseFloat(geoRes.data[0].lat),
          longitude: parseFloat(geoRes.data[0].lon),
        };
        processCoords(coords);
      } catch (error) {
        console.error("Geocoding error:", error);
        Swal.fire("Error", "Failed to validate address. Try again.", "error");
      }
    });
  };

  const handlePlaceOrder = async () => {
    if (!addressNo || !addressStreet || !mobileNumber || !userCoords) {
      Swal.fire("Error", "Please complete all required fields and select a location.", "error");
      return;
    }

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
        longitude: userCoords.longitude,
        latitude: userCoords.latitude,
        deliveryCharge,
        mobileNumber,
        items: orderItems,
      };

      console.log("Sending order:", orderData);

      await axios.post("http://localhost:5003/api/order/place", orderData, {
        headers: { Authorization: `Bearer ${token}` },
      });

      Swal.fire({
        title: "Order Placed!",
        text: "Your delicious food is on its way!",
        icon: "success",
        showConfirmButton: false,
        timer: 2000,
      });

      setTimeout(() => {
        navigate("/viewBasket");
      }, 2000);
    } catch (error) {
      console.error("Error placing order:", error);
      Swal.fire("Error", "Failed to place order. Please try again.", "error");
    }
  };

  const handlePaymentSuccess = async (paymentId) => {
    const token = localStorage.getItem("token");
    try {
      const orderData = {
        restaurantId,
        paymentMethod,
        addressNo,
        addressStreet,
        longitude: userCoords.longitude,
        latitude: userCoords.latitude,
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

      Swal.fire({
        title: "Order Placed!",
        text: "Your delicious food is on its way!",
        icon: "success",
        showConfirmButton: false,
        timer: 2000,
      });

      setTimeout(() => {
        setIsPaymentDialogOpen(false);
        navigate("/viewBasket");
      }, 2000);
    } catch (error) {
      console.error("Error placing order after payment:", error);
      await axios.post(
        "http://localhost:5005/api/payment/update",
        {
          paymentId,
          status: "failed",
        },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      Swal.fire("Error", "Failed to place order after payment. Please try again.", "error");
    }
  };

  const LocationSelector = () => {
    useMapEvents({
      click(e) {
        const { lat, lng } = e.latlng;
        setUseMap(true);
        processCoords({ latitude: lat, longitude: lng });
      },
    });
    return null;
  };

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <div className="pb-4">
                <NavBar/>
            </div>
      <h1 className="text-3xl font-bold mb-6">Checkout</h1>

      {/* Address Fields */}
      <div className="bg-white p-6 rounded-lg shadow-md mb-6 space-y-4">
        <h2 className="text-xl font-semibold mb-4">Delivery Address</h2>
        <div className="flex gap-2">
          <input
            type="text"
            placeholder="Building / Address No"
            value={addressNo}
            onChange={(e) => setAddressNo(e.target.value)}
            disabled={useMap}
            className="w-full p-3 border rounded"
            required
          />
          <input
            type="text"
            placeholder="Street"
            value={addressStreet}
            onChange={(e) => setAddressStreet(e.target.value)}
            disabled={useMap}
            className="w-full p-3 border rounded"
            required
          />
          <button
            onClick={handleAddressOk}
            disabled={useMap}
            className={`px-4 py-2 rounded text-white ${
              useMap
                ? "bg-gray-400 cursor-not-allowed"
                : "bg-blue-600 hover:bg-blue-700"
            }`}
          >
            OK
          </button>
        </div>
        <p className="text-sm text-gray-600">
          📍 Or click on the map below to select location.
        </p>
        <MapContainer
          center={[restaurantCoords.latitude, restaurantCoords.longitude]}
          zoom={13}
          style={{ height: "300px", width: "100%" }}
          className="rounded shadow"
        >
          <TileLayer
            attribution='© <a href="https://osm.org/copyright">OSM</a>'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />
          <Marker position={[restaurantCoords.latitude, restaurantCoords.longitude]} />
          {userCoords && <Marker position={[userCoords.latitude, userCoords.longitude]} />}
          <LocationSelector />
        </MapContainer>
        {distanceKm !== null && (
          <p className="text-sm text-gray-600 mt-2">
            📏 Distance: {distanceKm.toFixed(2)} km — Delivery Charge: Rs {deliveryCharge}
          </p>
        )}
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
          <span>Rs {(subtotal + deliveryCharge).toFixed(2)}</span>
        </div>
      </div>

      {/* Place Order Button */}
      <div className="flex justify-end">
        <button
          onClick={handlePlaceOrder}
          disabled={disableOrder}
          className={`px-6 py-3 rounded-lg text-white font-semibold ${
            disableOrder ? "bg-gray-400 cursor-not-allowed" : "bg-green-600 hover:bg-green-700"
          }`}
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
                amount={subtotal + deliveryCharge}
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