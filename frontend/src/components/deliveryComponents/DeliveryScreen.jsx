import React, { useEffect, useState } from "react";
import { getAcceptedOrderById } from "../../services/deliveryAPI";
import {
  completeDelivery,
  getDeliveryById,
  updateStatusPickup,
} from "../../services/deliveryOrders";
import { useNavigate, useParams } from "react-router-dom";
import ToggleSwitch from "./ToggleSwitch";
import DeliveryMap from "./DeliveryMap";
import SignaturePad from "./SignaturePad";
import { MapContainer } from "react-leaflet";
import "leaflet-routing-machine";
import io from "socket.io-client";

const DeliveryScreen = () => {
  const socket = io("http://localhost:5002");
  const navigate = useNavigate();
  const { id: deliveryId } = useParams();
  const [delivery, setDelivery] = useState(null);
  const [orderDetails, setOrderDetails] = useState(null);
  const [status, setStatus] = useState(false);
  const [timeSincePickup, setTimeSincePickup] = useState("");
  const [signature, setSignature] = useState(null);

  const handleSaveSignature = (signatureDataURL) => {
    setSignature(signatureDataURL);
  };

  const sendSMS = async (to, message) => {
    try {
      const response = await fetch("https://meal-wheels-3755.twil.io/path_1", {
        method: "POST",
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
        },
        body: new URLSearchParams({
          to: to,
          body: message,
        }),
      });

      const result = await response.json();
      console.log("SMS sent successfully:", result);
    } catch (error) {
      console.error("Failed to send SMS:", error);
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const delivery = await getDeliveryById(deliveryId);
        setDelivery(delivery);
        console.log("Delivery fetched:", delivery);

        setStatus(delivery.status === "PickedUp");

        const order = await getAcceptedOrderById(delivery.orderId);
        console.log("Order fetched:", order);

        setOrderDetails(order);
      } catch (err) {
        console.log(err);
      }
    };
    fetchData();
  }, [deliveryId]);

  useEffect(() => {
    if (!delivery?._id) return;

    const watcher = navigator.geolocation.watchPosition(
      (position) => {
        const { latitude, longitude } = position.coords;
        socket.emit("driverLocationUpdate", {
          deliveryId: delivery._id,
          latitude,
          longitude,
        });
      },
      (error) => {
        console.error("Error getting location", error);
      },
      {
        enableHighAccuracy: true,
        maximumAge: 0,
        timeout: 5000,
      }
    );

    return () => {
      navigator.geolocation.clearWatch(watcher);
    };
  }, [delivery?._id]); // ✅ Depend on delivery._id

  useEffect(() => {
    function getTimeSincePickup(pickedUpAt) {
      const now = new Date();
      const pickedUpTime = new Date(pickedUpAt);

      const diffInSeconds = Math.floor((now - pickedUpTime) / 1000);

      if (diffInSeconds < 60) {
        return `${diffInSeconds} seconds ago`;
      } else if (diffInSeconds < 3600) {
        const minutes = Math.floor(diffInSeconds / 60);
        return `${minutes} minute${minutes > 1 ? "s" : ""} ago`;
      } else if (diffInSeconds < 86400) {
        const hours = Math.floor(diffInSeconds / 3600);
        return `${hours} hour${hours > 1 ? "s" : ""} ago`;
      } else {
        const days = Math.floor(diffInSeconds / 86400);
        return `${days} day${days > 1 ? "s" : ""} ago`;
      }
    }

    const updateTime = () => {
      if (delivery?.pickedUpAt) {
        const timeText = getTimeSincePickup(delivery.pickedUpAt);
        setTimeSincePickup(timeText);
      }
    };

    updateTime();
    const intervalId = setInterval(updateTime, 60000);

    return () => clearInterval(intervalId);
  }, [delivery?.pickedUpAt]);

  const handleCompleteOrder = async () => {
    try {
      const res = await completeDelivery(
        delivery._id,
        signature,
        orderDetails._id
      );

      console.log("Delivery complete:", res);
      navigate("/delivery");
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    if (!delivery?._id || !orderDetails?._id) return;

    const updatePickup = async () => {
      try {
        if (status) {
          await updateStatusPickup(delivery._id, orderDetails._id, "PickedUp");
        } else {
          await updateStatusPickup(
            delivery._id,
            orderDetails._id,
            "DeliveryAccepted"
          );
        }
      } catch (err) {
        console.error(err);
      }
    };

    updatePickup();
  }, [status, delivery, orderDetails]);

  if (!orderDetails) {
    return <div>Loading...</div>;
    {
    }
  }

  return (
    <div className="min-h-screen bg-gray-100">
      <div className="flex gap-4">
        <div className="w-[40%] px-4">
          <div className="text-[2.5rem] font-bold mx-2 mt-4">
            <div className="flex gap-2">
              <div className="text-orange-500">Currently</div>
              <div>Delivering</div>
              <div>Order</div>
            </div>
          </div>
          <div className="text-[1.5rem] mx-2 font-semibold flex gap-1">
            <div className="my-auto">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="3"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="lucide lucide-hash-icon lucide-hash text-orange-500"
              >
                <line x1="4" x2="20" y1="9" y2="9" />
                <line x1="4" x2="20" y1="15" y2="15" />
                <line x1="10" x2="8" y1="3" y2="21" />
                <line x1="16" x2="14" y1="3" y2="21" />
              </svg>
            </div>
            <div>{orderDetails._id}</div>
          </div>
        </div>
        <div className="flex w-[60%] mx-16">
          {delivery.status === "PickedUp" ? (
            <div className="bg-gray-500 px-4 py-2 rounded-md text-white my-auto">
              <div>{`PickedUp ${timeSincePickup}`}</div>
            </div>
          ) : null}
        </div>
        <div className="flex px-4">
          <div
            className="bg-orange-500 px-4 text-white font-semibold text-lg shadow-md hover:bg-orange-600 py-2 rounded-md my-auto cursor-pointer"
            onClick={handleCompleteOrder}
          >
            <div className="inline whitespace-nowrap">Complete order</div>
          </div>
        </div>
      </div>
      <div className="flex">
        <div className="w-[40%] px-4">
          <div className="flex justify-between">
            <div
              className="rounded-full mt-4 px-4 py-2 bg-orange-100 shadow-md"
              onClick={() =>
                sendSMS(
                  "0768309650",
                  `Hi! Your order ${orderDetails._id} has been delivered. Thank you!`
                )
              }
            >
              <div className="flex gap-2 items-center mx-2">
                <div>
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="18"
                    height="18"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="3"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="lucide lucide-circle-icon lucide-circle text-orange-600"
                  >
                    <circle cx="12" cy="12" r="10" />
                  </svg>
                </div>
                <div className="text-lg font-semibold">
                  {orderDetails.status}
                </div>
              </div>
            </div>
            <div className="mt-4 px-4 py-2 flex gap-2">
              <div className="font-semibold">
                {!status ? "Toggle when picked up" : "Marked as pick up"}
              </div>
              <div>
                <ToggleSwitch
                  isOn={status}
                  handleToggle={() => {
                    setStatus((prev) => !prev);
                  }}
                />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-md shadow-md my-4 px-4 py-2">
            <div className="text-xl font-semibold">Delivery Details</div>
            <div className=" ml-16 py-2">
              <div className="flex gap-2 text-lg">
                <div className="font-semibold text-orange-500">
                  Pickup Location :
                </div>
                <div className="">
                  {orderDetails.restaurant.name},{" "}
                  {orderDetails.restaurant.address.street},{" "}
                  {orderDetails.restaurant.address.city}
                </div>
              </div>
              <div className="flex gap-2 text-lg">
                <div className="font-semibold">Drop Location :</div>
                <div className="">
                  {orderDetails.address.no}, {orderDetails.address.street}
                </div>
              </div>
              <div className="flex gap-2 text-lg">
                <div className="font-semibold">Delivery Charge :</div>
                <div className="">{orderDetails.deliveryCharge.toFixed(2)}</div>
              </div>
            </div>
            <div>
              <hr />
            </div>
            <div className="text-xl font-semibold mt-4">Order Details</div>
            <div className="ml-16 py-2">
              <div className="flex gap-2 text-lg">
                <div className="font-semibold">Payment Type :</div>
                <div className="">{orderDetails.paymentMethod}</div>
              </div>
              <div className="flex gap-2 text-lg">
                <div className="font-semibold">Total Amount :</div>
                <div className="">{orderDetails.totalAmount.toFixed(2)}</div>
              </div>
              <div className="flex gap-2 text-lg">
                <div className="font-semibold">NO. of Items :</div>
                <div className="">{orderDetails.items.length}</div>
              </div>
            </div>
            <hr />
            <div className="text-xl font-semibold mt-4">Customer Details</div>
            <div className="ml-16 py-2">
              <div className="flex gap-2 text-lg">
                <div className="font-semibold">Name :</div>
                <div className="">User 03</div>
              </div>
              <div className="flex gap-2 text-lg">
                <div className="font-semibold">Contact number :</div>
                <div className="">+94 767854998</div>
              </div>
            </div>
            <div className="flex gap-4 mt-4">
              <div>
                {!signature ? (
                  <SignaturePad onSave={handleSaveSignature} />
                ) : (
                  <div>
                    <img src={signature} alt="Signature" />
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
        <div className="w-[60%] p-2">
          <MapContainer
            center={[
              delivery.pickupLocation.latitude,
              delivery.pickupLocation.longitude,
            ]}
            zoom={13}
            style={{ height: "740px", width: "100%" }}
          >
            <DeliveryMap location={delivery} />
          </MapContainer>
        </div>
      </div>
    </div>
  );
};

export default DeliveryScreen;
