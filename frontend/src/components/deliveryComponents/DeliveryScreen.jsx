import React, { use, useEffect, useState } from "react";
import { getAcceptedOrderById } from "../../services/deliveryAPI";
import {
  getDeliveryById,
  updateStatusPickup,
} from "../../services/deliveryOrders";
import { useParams } from "react-router-dom";
import ToggleSwitch from "./ToggleSwitch";
import DeliveryMap from "./DeliveryMap";
import { MapContainer, TileLayer } from "react-leaflet";

const DeliveryScreen = () => {
  const { id: deliveryId } = useParams();
  const [delivery, setDelivery] = useState(null);
  const [orderDetails, setOrderDetails] = useState(null);
  const [status, setStatus] = useState(false);
  useEffect(() => {
    const fetchData = async () => {
      try {
        // First get the delivery using deliveryId
        const delivery = await getDeliveryById(deliveryId);
        setDelivery(delivery);
        console.log("Delivery fetched:", delivery);

        setStatus(delivery.status === "PickedUp");

        // Now get the order details using the orderId from delivery
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
    if (!delivery?._id || !orderDetails?._id) return;

    const updatePickup = async () => {
      try {
        await updateStatusPickup(delivery._id, orderDetails._id);
      } catch (err) {
        console.error(err);
      }
    };

    if (status) {
      updatePickup();
    }
  }, [status, delivery, orderDetails]);

  if (!orderDetails) {
    return <div>Loading...</div>;
    {
    }
  }

  return (
    <div className="min-h-screen bg-gray-100">
      <div className="flex">
        <div className="w-[40%] border border-black px-4">
          <div className="text-[2.5rem] font-bold mx-2 mt-4">
            <div className="flex gap-2">
              <div className="text-orange-500">Currently</div>
              <div>Delivering</div>
              <div>Order</div>
            </div>
          </div>
          <div className="text-[1.5rem] mx-2 font-semibold flex gap-1">
            <div>{orderDetails._id}</div>
          </div>
        </div>
        <div>sdasdasds</div>
      </div>
      <div className="flex">
        <div className="w-[40%] px-4">
          <div className="flex justify-between">
            <div className="rounded-full mt-4 px-4 py-2 bg-blue-100 shadow-md">
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
                    className="lucide lucide-circle-icon lucide-circle text-blue-600"
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
                <div className="">{orderDetails.paymentMethod}</div>
              </div>
              <div className="flex gap-2 text-lg">
                <div className="font-semibold">Contact number :</div>
                <div className="">{orderDetails.totalAmount.toFixed(2)}</div>
              </div>
            </div>
          </div>
        </div>
        <div className="w-[60%] p-2">
          <h3>This is the map</h3>
          <MapContainer
            center={[
              delivery.pickupLocation.latitude,
              delivery.pickupLocation.longitude,
            ]}
            zoom={13}
            style={{ height: "500px", width: "100%" }}
          >
            <TileLayer
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
              attribution="&copy; <a href='https://www.openstreetmap.org/copyright'>OpenStreetMap</a> contributors"
            />
            <DeliveryMap location={delivery} />
          </MapContainer>
        </div>
      </div>
    </div>
  );
};

export default DeliveryScreen;
