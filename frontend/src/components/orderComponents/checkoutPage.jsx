import { useLocation, useParams, useNavigate } from "react-router-dom";
import { useState } from "react";
import axios from "axios";
import Swal from "sweetalert2";
import { MapContainer, TileLayer, Marker, useMapEvents } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";

// Fix default marker icon issue in leaflet
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
  iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
  shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
});

function CheckoutPage() {
  const { restaurantId } = useParams();
  const location = useLocation();
  const navigate = useNavigate();
  const subtotal = location.state?.subtotal || 0;

  const [addressNo, setAddressNo] = useState("");
  const [addressStreet, setAddressStreet] = useState("");
  const [paymentMethod, setPaymentMethod] = useState("CashOnDelivery");
  const [mobileNumber, setMobileNumber] = useState("");
  const [disableOrder, setDisableOrder] = useState(false);
  const [userCoords, setUserCoords] = useState(null);
  const [deliveryCharge, setDeliveryCharge] = useState(0);
  const [distanceKm, setDistanceKm] = useState(null);
  const [useMap, setUseMap] = useState(false); // Toggle for map or manual input

  const restaurantCoords = { latitude: 7.2906, longitude: 80.6385 };

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

    // Reverse geocode
    try {
      const res = await axios.get(
        `https://nominatim.openstreetmap.org/reverse?format=jsonv2&lat=${coords.latitude}&lon=${coords.longitude}`
      );

      const address = res.data?.address;
      if (address) {
        setAddressNo(address.house_number || "");
        setAddressStreet(
          address.road || address.neighbourhood || address.suburb || address.village || ""
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
    if (!mobileNumber || !userCoords) {
      Swal.fire("Error", "Please complete all required fields.", "error");
      return;
    }

    const token = localStorage.getItem("token");

    if (paymentMethod === "Card") {
      navigate("/payment");
      return;
    }

    try {
      const orderData = {
        restaurantId,
        paymentMethod,
        addressNo,
        addressStreet,
        longitude: userCoords?.longitude,
        latitude: userCoords?.latitude,
        deliveryCharge,
        mobileNumber,
      };

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
      console.error("Order error:", error);
      Swal.fire("Error", "Failed to place order. Try again.", "error");
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
      <h1 className="text-3xl font-bold mb-6">Checkout</h1>

      {/* Address Entry */}
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
          />
          <input
            type="text"
            placeholder="Street"
            value={addressStreet}
            onChange={(e) => setAddressStreet(e.target.value)}
            disabled={useMap}
            className="w-full p-3 border rounded"
          />
          <button
            onClick={handleAddressOk}
            disabled={useMap}
            className={`px-4 py-2 rounded text-white ${
              useMap ? "bg-gray-400 cursor-not-allowed" : "bg-blue-600 hover:bg-blue-700"
            }`}
          >
            OK
          </button>
        </div>

        <p className="text-sm text-gray-600">📍 Or click on the map below to select location.</p>
        <MapContainer
          center={[restaurantCoords.latitude, restaurantCoords.longitude]}
          zoom={13}
          style={{ height: "300px", width: "100%" }}
          className="rounded shadow"
        >
          <TileLayer
            attribution='&copy; <a href="https://osm.org/copyright">OSM</a>'
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

      {/* Mobile Input */}
      <div className="bg-white p-6 rounded-lg shadow-md mb-6">
        <h2 className="text-xl font-semibold mb-4">Mobile Number</h2>
        <input
          type="text"
          placeholder="Enter your mobile number"
          value={mobileNumber}
          onChange={(e) => setMobileNumber(e.target.value)}
          className="w-full p-3 border rounded"
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

      {/* Summary */}
      <div className="bg-white p-6 rounded-lg shadow-md mb-6">
        <h2 className="text-xl font-semibold mb-4">Summary</h2>
        <div className="flex justify-between mb-2">
          <span>Subtotal:</span>
          <span>Rs {subtotal.toFixed(2)}</span>
        </div>
        <div className="flex justify-between mb-2">
          <span>Delivery Charge:</span>
          <span>Rs {deliveryCharge}</span>
        </div>
        <div className="flex justify-between font-bold text-lg">
          <span>Total:</span>
          <span>Rs {(subtotal + deliveryCharge).toFixed(2)}</span>
        </div>
      </div>

      <button
        onClick={handlePlaceOrder}
        disabled={disableOrder}
        className={`w-full py-3 rounded text-white font-semibold text-lg ${
          disableOrder ? "bg-gray-400 cursor-not-allowed" : "bg-green-600 hover:bg-green-700"
        }`}
      >
        Place Order
      </button>
    </div>
  );
}

export default CheckoutPage;
