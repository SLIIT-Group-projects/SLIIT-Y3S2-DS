import React, { useEffect, useState } from "react";
import { getAllActiveOrders } from "../../services/deliveryAPI";
import "leaflet/dist/leaflet.css";
import "leaflet-routing-machine/dist/leaflet-routing-machine.css";
import { MapContainer, TileLayer } from "react-leaflet";
import L from "leaflet";
import "leaflet-routing-machine";
import PreviewMap from "./PreviewMap";
import { useNavigate } from "react-router-dom";
import { acceptDelivery } from "../../services/deliveryOrders";

const DeliveryList = () => {
  const navigate = useNavigate();
  const [deliveries, setDeliveries] = useState([]);
  const [filteredDeliveries, setFilteredDeliveries] = useState([]);
  const [showNearby, setShowNearby] = useState(false);
  const status = "Prepared";
  const [openMaps, setOpenMaps] = useState({}); // { orderId: true/false }

  const toggleMap = (orderId) => {
    setOpenMaps((prev) => ({
      ...prev,
      [orderId]: !prev[orderId],
    }));
  };

  useEffect(() => {
    const getDeliveries = async () => {
      try {
        const res = await getAllActiveOrders(status);
        console.log(res);
        const deliveriesWithETA = await Promise.all(
          res.map((order) => {
            return new Promise((resolve) => {
              if (
                order.restaurant?.location &&
                order.location?.latitude &&
                order.location?.longitude
              ) {
                const from = L.latLng(
                  order.restaurant.location.latitude,
                  order.restaurant.location.longitude
                );
                const to = L.latLng(
                  order.location.latitude,
                  order.location.longitude
                );

                const router = L.Routing.osrmv1();
                router.route(
                  [{ latLng: from }, { latLng: to }],
                  (err, routes) => {
                    if (err || !routes || routes.length === 0) {
                      resolve({ ...order, distanceKm: null, etaMin: null });
                    } else {
                      const route = routes[0].summary;
                      resolve({
                        ...order,
                        distanceKm: (route.totalDistance / 1000).toFixed(2),
                        etaMin: Math.ceil(route.totalTime / 60),
                      });
                    }
                  }
                );
              } else {
                resolve({ ...order, distanceKm: null, etaMin: null });
              }
            });
          })
        );
        console.log(res);
        setDeliveries(deliveriesWithETA);
      } catch (error) {
        console.error("Error fetching active orders:", error);
      }
    };
    getDeliveries();
  }, []);

  const getDistanceFromLatLonInKm = (lat1, lon1, lat2, lon2) => {
    const R = 6371; // Earth radius in km
    const dLat = ((lat2 - lat1) * Math.PI) / 180;
    const dLon = ((lon2 - lon1) * Math.PI) / 180;
    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos((lat1 * Math.PI) / 180) *
        Math.cos((lat2 * Math.PI) / 180) *
        Math.sin(dLon / 2) *
        Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c;
  };

  const filterNearbyDeliveries = () => {
    navigator.geolocation.getCurrentPosition(
      (position) => {
        const driverLat = position.coords.latitude;
        const driverLon = position.coords.longitude;

        const nearbyOrders = deliveries.filter((order) => {
          const pickupLat = order.restaurant.address.latitude;
          const pickupLon = order.restaurant.address.longitude;

          const distance = getDistanceFromLatLonInKm(
            driverLat,
            driverLon,
            pickupLat,
            pickupLon
          );

          return distance <= 50; // Filter within 50 km
        });

        setFilteredDeliveries(nearbyOrders);
      },
      (error) => {
        console.error("Error getting location:", error);
        alert("Unable to access your location.");
      }
    );
  };

  const handleAccept = async (order) => {
    try {
      const result = await acceptDelivery(order);
      navigate(`/delivery-screen/${result._id}`);
      console.log("Delivery accepted:", result);
    } catch (err) {
      console.error("Failed to accept delivery:", err);
    }
  };

  return (
    <div>
      <div className="flex justify-between mb-4">
        <div className="text-2xl font-semibold py-2">Available Deliveries</div>
        <button
          onClick={() => {
            if (!showNearby) {
              filterNearbyDeliveries();
            }
            setShowNearby((prev) => !prev);
          }}
          className="bg-orange-500 text-white px-4 py-2 rounded-md"
        >
          {showNearby ? "Show All Deliveries" : "Get Nearby Deliveries"}
        </button>
      </div>
      {deliveries.length > 0 ? (
        <span className="">
          {(showNearby ? filteredDeliveries : deliveries).map(
            (order, index) => (
              <div key={index}>
                <div className="bg-white shadow-md rounded-lg p-4 mb-4">
                  <div className="flex gap-8">
                    <div className="flex">
                      <div>
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          width="24"
                          height="24"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          className="lucide lucide-soup-icon lucide-soup text-orange-500 mx-1"
                        >
                          <path d="M12 21a9 9 0 0 0 9-9H3a9 9 0 0 0 9 9Z" />
                          <path d="M7 21h10" />
                          <path d="M19.5 12 22 6" />
                          <path d="M16.25 3c.27.1.8.53.75 1.36-.06.83-.93 1.2-1 2.02-.05.78.34 1.24.73 1.62" />
                          <path d="M11.25 3c.27.1.8.53.74 1.36-.05.83-.93 1.2-.98 2.02-.06.78.33 1.24.72 1.62" />
                          <path d="M6.25 3c.27.1.8.53.75 1.36-.06.83-.93 1.2-1 2.02-.05.78.34 1.24.74 1.62" />
                        </svg>
                      </div>
                      <div className="font-semibold">Restaurant :</div>
                      <div>
                        <div>{order.restaurant.name}</div>
                        <div>{order.restaurant.address.street}</div>
                      </div>
                    </div>
                    <div className="flex">
                      <div>
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          width="24"
                          height="24"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          className="lucide lucide-map-pin-icon lucide-map-pin text-orange-500 mx-1"
                        >
                          <path d="M20 10c0 4.993-5.539 10.193-7.399 11.799a1 1 0 0 1-1.202 0C9.539 20.193 4 14.993 4 10a8 8 0 0 1 16 0" />
                          <circle cx="12" cy="10" r="3" />
                        </svg>
                      </div>
                      <div className="font-semibold">Delivery To :</div>
                      <div>{order.address.no}</div>
                      <div>{order.address.street}</div>
                      <div>{order.address.city}</div>
                    </div>
                  </div>
                  <div className="flex gap-4 my-2">
                    <div className="flex gap-1">
                      <div>
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          width="24"
                          height="24"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          className="lucide lucide-package-icon lucide-package text-orange-500 mx-1"
                        >
                          <path d="M11 21.73a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73z" />
                          <path d="M12 22V12" />
                          <polyline points="3.29 7 12 12 20.71 7" />
                          <path d="m7.5 4.27 9 5.15" />
                        </svg>
                      </div>
                      <div className="font-semibold">{order.items.length}</div>
                      <div>Items</div>
                    </div>
                    <div>
                      <div className="flex">
                        <div>
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            width="24"
                            height="24"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            className="lucide lucide-dollar-sign-icon lucide-dollar-sign text-orange-500 mx-1"
                          >
                            <line x1="12" x2="12" y1="2" y2="22" />
                            <path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" />
                          </svg>
                        </div>
                        <div className="font-semibold">Total Amount :</div>
                        <div>{order.totalAmount.toFixed(2)}</div>
                      </div>
                    </div>
                    <div className="font-semibold">{order.paymentMethod}</div>
                  </div>
                  <div className="flex gap-4">
                    <div className="flex gap-1">
                      <div>
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          width="24"
                          height="24"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          className="lucide lucide-footprints-icon lucide-footprints text-orange-500 mx-1"
                        >
                          <path d="M4 16v-2.38C4 11.5 2.97 10.5 3 8c.03-2.72 1.49-6 4.5-6C9.37 2 10 3.8 10 5.5c0 3.11-2 5.66-2 8.68V16a2 2 0 1 1-4 0Z" />
                          <path d="M20 20v-2.38c0-2.12 1.03-3.12 1-5.62-.03-2.72-1.49-6-4.5-6C14.63 6 14 7.8 14 9.5c0 3.11 2 5.66 2 8.68V20a2 2 0 1 0 4 0Z" />
                          <path d="M16 17h4" />
                          <path d="M4 13h4" />
                        </svg>
                      </div>
                      <div className="font-semibold">Distance:</div>{" "}
                      <div>
                        {order.distanceKm ? `${order.distanceKm} km` : "N/A"}
                      </div>
                    </div>
                    <div className="flex gap-1">
                      <div>
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          width="24"
                          height="24"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          class="lucide lucide-timer-icon lucide-timer text-orange-500 mx-1"
                        >
                          <line x1="10" x2="14" y1="2" y2="2" />
                          <line x1="12" x2="15" y1="14" y2="11" />
                          <circle cx="12" cy="14" r="8" />
                        </svg>
                      </div>
                      <div className="font-semibold">ETA:</div>{" "}
                      <div>{order.etaMin ? `${order.etaMin} mins` : "N/A"}</div>
                    </div>
                    <div className="flex gap-1">
                      <div>
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          width="24"
                          height="24"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          className="lucide lucide-hand-coins-icon lucide-hand-coins text-orange-500 mx-1"
                        >
                          <path d="M11 15h2a2 2 0 1 0 0-4h-3c-.6 0-1.1.2-1.4.6L3 17" />
                          <path d="m7 21 1.6-1.4c.3-.4.8-.6 1.4-.6h4c1.1 0 2.1-.4 2.8-1.2l4.6-4.4a2 2 0 0 0-2.75-2.91l-4.2 3.9" />
                          <path d="m2 16 6 6" />
                          <circle cx="16" cy="9" r="2.9" />
                          <circle cx="6" cy="5" r="3" />
                        </svg>
                      </div>
                      <div className="font-semibold">Delivery Fee :</div>
                      <div>{order.deliveryCharge.toFixed(2)}</div>
                    </div>
                  </div>
                  <div className="mt-2">
                    <div className="flex gap-3">
                      <div
                        className={`text-white rounded-md px-4 py-2 cursor-pointer${
                          !openMaps[order._id]
                            ? " bg-orange-500 hover:bg-orange-600"
                            : " bg-red-500 hover:bg-red-600"
                        }`}
                        onClick={() => {
                          toggleMap(order._id);
                        }}
                      >
                        {openMaps[order._id] ? "Hide Map" : "Show Map"}
                      </div>
                      <div
                        // to={`/delivery-screen/${order._id}`}
                        className="bg-gray-500 text-white rounded-md px-4 py-2 cursor-pointer hover:bg-gray-600"
                        onClick={() => {
                          handleAccept(order);
                        }}
                      >
                        Accept Order
                      </div>
                    </div>
                    <div>
                      {openMaps[order._id] && (
                        <div className="h-[400px] mt-4 rounded-md overflow-hidden">
                          <MapContainer
                            center={[
                              order.restaurant.address.latitude,
                              order.restaurant.address.longitude,
                            ]}
                            zoom={10}
                            scrollWheelZoom={false}
                            style={{ height: "100%", width: "100%" }}
                          >
                            <TileLayer
                              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                              attribution='&copy; <a href="http://osm.org/copyright">OpenStreetMap</a>'
                            />
                            <PreviewMap
                              from={[
                                order.restaurant.address.latitude,
                                order.restaurant.address.longitude,
                              ]}
                              to={[
                                order.location.latitude,
                                order.location.longitude,
                              ]}
                            />
                          </MapContainer>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            )
          )}
        </span>
      ) : (
        <div className="flex justify-center items-center h-64">
          <div className="text-gray-500 text-lg font-semibold">
            No Orders yet...
          </div>
        </div>
      )}
    </div>
  );
};

export default DeliveryList;
