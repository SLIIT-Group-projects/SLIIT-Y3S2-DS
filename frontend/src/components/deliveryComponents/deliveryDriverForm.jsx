import React, { useState } from "react";
import { registerDeliveryPerson } from "../../services/deliveryAPI";
import MapBox from "./mapBox";

const DeliveryDriverForm = () => {
  const [currentLocation, setCurrentLocation] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    vehicaleType: "bike",
    address: "",
    lat: "",
    lng: "",
  });

  const [locationSet, setLocationSet] = useState(false);

  const getCurrentLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          setFormData((prev) => ({
            ...prev,
            lat: latitude,
            lng: longitude,
            address: "", // Clear address if using current location
          }));
          setLocationSet(true);
          setCurrentLocation(true);
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

  const cancelCurrentLocation = () => {
    setFormData((prev) => ({ ...prev, lat: "", lng: "" }));
    setCurrentLocation(false);
    setLocationSet(false);
    console.log(formData);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleAddressSearch = async () => {
    if (formData.address.length > 3) {
      try {
        const res = await fetch(
          `https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(
            formData.address
          )}&format=json&limit=1`
        );
        const data = await res.json();
        if (data.length > 0) {
          const { lat, lon } = data[0];
          setFormData((prev) => ({
            ...prev,
            lat: parseFloat(lat),
            lng: parseFloat(lon),
          }));
          setLocationSet(true);
        } else {
          alert("Address not found");
        }
      } catch (err) {
        console.error("Error fetching geocode:", err);
        alert("Failed to fetch location from address");
      }
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.lat || !formData.lng) {
      alert(
        "Please set your location (either by entering address or using current location)."
      );
      return;
    }

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
      setLocationSet(false);
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
          Delivery Person <div className="text-orange-500">Registration</div>
        </h2>
        <div>
          <label
            htmlFor="name"
            className="block text-gray-700 font-medium mb-1"
          >
            Name:
          </label>
          <input
            type="text"
            id="name"
            name="name"
            value={formData.name}
            onChange={handleChange}
            placeholder="Enter your name"
            className="w-full p-3 border border-gray-300 rounded-lg"
            required
          />
        </div>

        <div>
          <label
            htmlFor="vehicaleType"
            className="block text-gray-700 font-medium mb-1"
          >
            Vehicle Type:
            <select
              name="vehicaleType"
              value={formData.vehicaleType}
              onChange={handleChange}
              className="w-full p-3 border border-gray-300 rounded-lg"
              required
            >
              <option value="bike">Bike</option>
              <option value="car">Car</option>
              <option value="scooter">Scooter</option>
            </select>
          </label>
        </div>

        <div>
          <label
            htmlFor="address"
            className="block text-gray-700 font-medium mb-1"
          >
            Address:
            <div className="space-y-3">
              <input
                type="text"
                name="address"
                value={formData.address}
                onChange={handleChange}
                placeholder={
                  currentLocation
                    ? "Address is set to your current location"
                    : "Enter Address (street,city)"
                }
                disabled={currentLocation}
                className={`w-full p-3 border border-gray-300 rounded-lg ${
                  currentLocation ? "bg-gray-100 text-gray-500" : ""
                }`}
              />
              <button
                type="button"
                onClick={handleAddressSearch}
                className={`bg-orange-400 hover:bg-orange-500 text-white px-4 py-2 rounded-md ${
                  currentLocation ? "hidden" : ""
                }`}
              >
                Set Location by Address
              </button>

              <p className="text-center text-gray-500">— or —</p>

              {currentLocation ? (
                <button
                  type="button"
                  onClick={cancelCurrentLocation}
                  className="bg-red-400 hover:bg-red-500 text-white px-4 py-2 rounded-md"
                >
                  Remove current location from address
                </button>
              ) : (
                <button
                  type="button"
                  onClick={getCurrentLocation}
                  className="bg-orange-400 hover:bg-orange-500 text-white px-4 py-2 rounded-md"
                >
                  <div className="flex gap-2">
                    <div>Use My Current Location</div>
                    <div className="rounded-full bg-white text-black p-1">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                        strokeWidth={1.5}
                        stroke="currentColor"
                        className="size-6"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="M15 10.5a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z"
                        />
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1 1 15 0Z"
                        />
                      </svg>
                    </div>
                  </div>
                </button>
              )}
            </div>
          </label>
        </div>

        {locationSet && (
          <div className="text-green-600 font-medium text-center">
            ✅ Location set: ({formData.lat}, {formData.lng})
          </div>
        )}

        {formData.lat && formData.lng && (
          <div className="h-64 rounded-lg overflow-hidden border border-gray-300">
            <MapBox lat={formData.lat} lng={formData.lng} />
          </div>
        )}

        <button
          type="submit"
          className="w-full bg-orange-600 hover:bg-orange-700 text-white text-lg py-3 rounded-lg"
        >
          Submit
        </button>
      </form>
    </div>
  );
};

export default DeliveryDriverForm;
