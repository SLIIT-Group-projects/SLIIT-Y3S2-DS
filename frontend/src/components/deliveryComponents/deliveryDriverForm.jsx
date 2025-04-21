import React, { useState } from "react";
import { registerDeliveryPerson } from "../../services/deliveryAPI";
import MapBox from "./mapBox";

const DeliveryDriverForm = () => {
  const [formData, setFormData] = useState({
    name: "",
    vehicaleType: "bike",
    address: "",
    lat: "",
    lng: "",
  });

  const getCurrentLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          setFormData((prev) => ({ ...prev, lat: latitude, lng: longitude }));
          console.log(latitude, longitude);
        },
        (error) => {
          console.error(error);
          alert("Unable to retrieve your location");
        }
      );
    } else {
      alert("Geolocation is not supported by this browser.");
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleAddressChange = async () => {
    const address = formData.address; // Get the address from state
    if (address.length > 3) {
      try {
        const res = await fetch(
          `https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(
            address
          )}&format=json&limit=1`
        );
        const data = await res.json();
        console.log(data);
        if (data.length > 0) {
          const { lat, lon } = data[0];
          setFormData((prev) => ({
            ...prev,
            lat: parseFloat(lat),
            lng: parseFloat(lon),
          }));
          console.log(lat, lon);
        }
      } catch (err) {
        console.error("Error fetching geocode:", err);
      }
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      await registerDeliveryPerson(formData);
      alert("Delivery person registered!");
      setFormData({
        name: "",
        vehicaleType: "bike",
        address: "",
        lat: "",
        lng: "",
      });
    } catch (err) {
      console.error(err);
      alert(err.message || "Submission failed");
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 py-10">
      <form
        onSubmit={handleSubmit}
        className="max-w-2xl mx-auto p-6 bg-white rounded-2xl shadow-lg space-y-6"
      >
        <h2 className="text-3xl font-bold text-center text-gray-700">
          Delivery Person Registration
        </h2>

        <input
          type="text"
          name="name"
          value={formData.name}
          onChange={handleChange}
          placeholder="Name"
          className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-300"
          required
        />

        <select
          name="vehicaleType"
          value={formData.vehicaleType}
          onChange={handleChange}
          className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-300"
          required
        >
          <option value="bike">Bike</option>
          <option value="car">Car</option>
          <option value="scooter">Scooter</option>
        </select>

        <input
          type="text"
          name="address"
          value={formData.address}
          onChange={handleChange} // Regular handleChange for input field
          onBlur={handleAddressChange} // Trigger address change on blur
          placeholder="Enter address (street, city)"
          className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-300"
        />
        {/* <div className="flex justify-center">
          <button
            type="button"
            onClick={handleAddressChange} // Trigger address change manually
            className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-md shadow"
          >
            Search Address
          </button>
        </div> */}

        <div className="flex justify-center">
          <button
            type="button"
            onClick={getCurrentLocation}
            className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-md shadow"
          >
            Set Current Location as Address
          </button>
        </div>

        {/* Render Map only if lat and lng are set */}
        {formData.lat && formData.lng && (
          <div className="h-64 rounded-lg overflow-hidden border border-gray-300">
            <MapBox lat={formData.lat} lng={formData.lng} />
          </div>
        )}

        <button
          type="submit"
          className="w-full bg-green-600 hover:bg-green-700 text-white text-lg py-3 rounded-lg transition"
        >
          Submit
        </button>
      </form>
    </div>
  );
};

export default DeliveryDriverForm;
