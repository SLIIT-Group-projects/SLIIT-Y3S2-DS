import { useEffect, useState } from "react";
import { getAllDeliveries } from "../../services/deliveryOrders";

const DeliveryHistory = () => {
  const [deliveries, setDeliveries] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchDeliveries = async () => {
    try {
      const data = await getAllDeliveries();
      if (data) {
        setDeliveries(data);
      }
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDeliveries();
  }, []);

  const viewSignature = (signatureData) => {
    const newTab = window.open();
    if (newTab) {
      newTab.document.write(`
        <html>
          <head><title>Customer Signature</title></head>
          <body style="margin:0;display:flex;justify-content:center;align-items:center;height:100vh;background:#f9f9f9;">
            <img src="${signatureData}" style="max-width:90%;max-height:90%;" />
          </body>
        </html>
      `);
      newTab.document.close();
    }
  };

  const completedDeliveries = deliveries.filter(
    (d) => d.status === "Delivered"
  );
  const cancelledDeliveries = deliveries.filter(
    (d) => d.status === "Cancelled"
  );

  const averageDeliveryTime = completedDeliveries.length
    ? (
        completedDeliveries.reduce((acc, d) => acc + (d.actualTime || 0), 0) /
        completedDeliveries.length
      ).toFixed(2)
    : "N/A";

  const onTimeDeliveries = completedDeliveries.filter(
    (d) => (d.actualTime || 0) <= (d.estimatedTime || 0)
  );
  const onTimeRate = completedDeliveries.length
    ? ((onTimeDeliveries.length / completedDeliveries.length) * 100).toFixed(1)
    : "N/A";

  const pickupCityCount = {};
  deliveries.forEach((d) => {
    const city = d.pickupAddress?.city || "Unknown";
    pickupCityCount[city] = (pickupCityCount[city] || 0) + 1;
  });
  const mostFrequentPickupCity =
    Object.entries(pickupCityCount).sort((a, b) => b[1] - a[1])[0]?.[0] ||
    "N/A";

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <div className="max-w-6xl mx-6 space-y-4">
        <div className="flex text-[2.8em] gap-3 font-bold">
          <div className="text-orange-500">Delivery</div>
          <div className="">History</div>
        </div>

        {loading ? (
          <div className="text-center text-gray-500 text-lg">
            Loading delivery history...
          </div>
        ) : deliveries.length === 0 ? (
          <div className="text-center text-gray-500 text-lg">
            No deliveries found.
          </div>
        ) : (
          <div>
            <div className="bg-white rounded-xl shadow p-6 mb-8 grid grid-cols-1 md:grid-cols-2 gap-6 text-gray-700 text-md">
              <div>
                <p className="font-semibold">Average Delivery Time:</p>
                <p>
                  {averageDeliveryTime !== "N/A"
                    ? `${averageDeliveryTime} minutes`
                    : "N/A"}
                </p>
              </div>

              <div>
                <p className="font-semibold">On-Time Delivery Rate:</p>
                <p>{onTimeRate !== "N/A" ? `${onTimeRate}%` : "N/A"}</p>
              </div>

              <div>
                <p className="font-semibold">Cancelled Deliveries:</p>
                <p>{cancelledDeliveries.length}</p>
              </div>

              <div>
                <p className="font-semibold">Top Pickup City:</p>
                <p>{mostFrequentPickupCity}</p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {deliveries.map((delivery) => (
                <div
                  key={delivery._id}
                  className="bg-white rounded-xl shadow-md hover:shadow-md transition p-6 flex flex-col gap-4"
                >
                  <div className="flex justify-between items-center">
                    <h3 className="text-xl font-semibold text-gray-700 truncate">
                      Order ID: {delivery.orderId}
                    </h3>
                    <div className="text-md text-gray-500">
                      {delivery.status}
                    </div>
                  </div>

                  <div className="text-md text-gray-600 space-y-1">
                    <p>
                      <span className="font-semibold">Pickup:</span>{" "}
                      {delivery.pickupAddress?.name},{" "}
                      {delivery.pickupAddress?.street}
                    </p>
                    <p>
                      <span className="font-semibold">Drop-off:</span>{" "}
                      {delivery.dropofAddress?.no},{" "}
                      {delivery.dropofAddress?.street}
                    </p>
                  </div>

                  <div className="text-sm text-gray-500 space-y-1">
                    <p>
                      <span className="font-semibold">Accepted:</span>{" "}
                      {delivery.acceptedAt
                        ? new Date(delivery.acceptedAt).toLocaleString()
                        : "-"}
                    </p>
                    <p>
                      <span className="font-semibold">Picked Up:</span>{" "}
                      {delivery.pickedUpAt
                        ? new Date(delivery.pickedUpAt).toLocaleString()
                        : "-"}
                    </p>
                    <p>
                      <span className="font-semibold">Delivered:</span>{" "}
                      {delivery.deliveredAt
                        ? new Date(delivery.deliveredAt).toLocaleString()
                        : "-"}
                    </p>
                  </div>

                  <div className="flex justify-between items-center pt-2 border-t border-orange-500 text-md text-gray-700">
                    <span>
                      Delivery Charge:{" "}
                      <span className="font-semibold text-orange-600">
                        {delivery.deliveryCharge || 0} LKR
                      </span>
                    </span>
                    <div className="flex flex-col items-end gap-1">
                      {delivery.proofPhotos?.length > 0 && (
                        <span className="text-blue-500 hover:underline cursor-pointer text-xs">
                          View Proof
                        </span>
                      )}
                      {delivery.customerSignature && (
                        <span
                          onClick={() =>
                            viewSignature(delivery.customerSignature)
                          }
                          className="text-orange-600 hover:underline cursor-pointer text-sm"
                        >
                          View Signature
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default DeliveryHistory;
