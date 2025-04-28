import React, { useEffect, useState } from "react";
import { allCurrentDeliveries } from "../../services/deliveryOrders";
import { Link } from "react-router-dom";

const Currentdeliveries = () => {
  const [Currentdeliveries, setCurrentdeliveries] = useState([]);
  useEffect(() => {
    const runningDeliveries = async () => {
      const res = await allCurrentDeliveries();
      console.log("running deliveries are: ", res);
      setCurrentdeliveries(res);
    };
    runningDeliveries();
  }, []);

  function getTimeAgo(dateString) {
    const acceptedDate = new Date(dateString);
    const now = new Date();
    const diffMs = now - acceptedDate;
    const diffMinutes = Math.floor(diffMs / (1000 * 60));

    if (diffMinutes < 60) {
      return `${diffMinutes} minutes ago`;
    } else {
      const diffHours = Math.floor(diffMinutes / 60);
      const remainingMinutes = diffMinutes % 60;
      return `${diffHours}h ${remainingMinutes}m ago`;
    }
  }

  return (
    <div>
      {Currentdeliveries.length > 0 ? (
        <div>
          {Currentdeliveries.map((delivery, index) => (
            <div key={index}>
              <Link to={`/delivery-screen/${delivery._id}`}>
                <div className="bg-gray-700 rounded-md my-2 text-white px-2 py-4 hover:bg-gray-800">
                  <div className="flex justify-between">
                    <div>{delivery._id}</div>
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
                        className="lucide lucide-square-arrow-out-up-right-icon lucide-square-arrow-out-up-right"
                      >
                        <path d="M21 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h6" />
                        <path d="m21 3-9 9" />
                        <path d="M15 3h6v6" />
                      </svg>
                    </div>
                  </div>

                  <div className="">
                    pickup : {delivery.pickupAddress.name},{" "}
                    {delivery.pickupAddress.street},{" "}
                    {delivery.pickupAddress.city}
                  </div>
                  <div>
                    dropoff : {delivery.dropofAddress.no}, {""}{" "}
                    {delivery.dropofAddress.street}
                  </div>
                  <div>status : {delivery.status}</div>
                  <div className="text-orange-400 font-semibold mt-2">
                    Delivery Accepted {getTimeAgo(delivery.createdAt)}
                  </div>
                </div>
              </Link>
            </div>
          ))}
        </div>
      ) : (
        <div>you dont have deliveries dummy.....</div>
      )}
    </div>
  );
};

export default Currentdeliveries;
