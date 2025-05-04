import { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

function OrdersPage() {
  const [activeTab, setActiveTab] = useState("ongoing");
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [deliveryInfo, setDeliveryInfo] = useState(null);
  const navigate = useNavigate()

  const fetchOrders = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem("token");

      const endpoint =
        activeTab === "ongoing"
          ? "http://localhost:5003/api/order/active/getActiveOrders"
          : "http://localhost:5003/api/order/active/getDeliveredOrders";

      const response = await axios.get(endpoint, {
        headers: { Authorization: `Bearer ${token}` },
      });

      setOrders(response.data);
      console.log("orders", response)
    } catch (error) {
      console.error("Error fetching orders:", error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleTrack = async (orderId) => {
    try {
      const response = await axios.get(
        `http://localhost:5002/api/delivery-orders/order/${orderId}`
      );
      console.log(orderId);

      setDeliveryInfo(response.data);
      console.log(response)
      navigate(`/track-driver/${deliveryInfo._id}`)
    } catch (error) {
      console.error("Tracking failed:", error);
      alert("Failed to retrieve delivery information.");
    }
  };

  useEffect(() => {
    fetchOrders();
  }, [activeTab]);

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <h1 className="text-3xl font-bold mb-6">My Orders</h1>

      {/* Tabs */}
      <div className="flex gap-4 mb-6">
        <button
          onClick={() => setActiveTab("ongoing")}
          className={`px-4 py-2 rounded ${
            activeTab === "ongoing"
              ? "bg-orange-500 text-white"
              : "bg-white text-orange-600 border"
          }`}
        >
          Ongoing Orders
        </button>
        <button
          onClick={() => setActiveTab("past")}
          className={`px-4 py-2 rounded ${
            activeTab === "past"
              ? "bg-orange-500 text-white"
              : "bg-white text-orange-600 border"
          }`}
        >
          Past Orders
        </button>
      </div>

      {/* Orders Section */}
      {loading ? (
        <div>Loading orders...</div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {orders.length === 0 ? (
            <div>No {activeTab === "ongoing" ? "ongoing" : "past"} orders found.</div>
          ) : (
            orders.map((order) => (
              <div
                key={order._id}
                className="bg-gradient-to-br from-orange-100 via-white to-orange-50 rounded-lg shadow-md p-6 flex flex-col gap-3 cursor-pointer 
                hover:scale-105 hover:shadow-xl hover:brightness-105 transition-all duration-700 ease-in-out"
                onClick={() => {
                  setSelectedOrder(order);
                  setDeliveryInfo(null); // Reset delivery info
                }}
              >
                <p><strong>Status:</strong> {order.status}</p>
                <p><strong>Ordered At:</strong> {new Date(order.createdAt).toLocaleString()}</p>

                <div className="text-right mt-auto">
                  <button className="text-orange-600 underline mt-2">View Details</button>
                </div>
              </div>
            ))
          )}
        </div>
      )}

      {/* Order Details Modal */}
      {selectedOrder && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
          <div className="bg-white rounded-lg p-6 max-w-lg w-full overflow-y-auto max-h-[90vh] relative">
            <button
              className="absolute top-3 right-3 text-gray-600"
              onClick={() => {
                setSelectedOrder(null);
                setDeliveryInfo(null);
              }}
            >
              ✕
            </button>

            <h2 className="text-2xl font-bold mb-4">Order Details</h2>

            {/* Order items */}
            <div className="mb-4">
              <h3 className="font-semibold mb-2">Items:</h3>
              {selectedOrder.items.map((item, index) => (
                <div key={index} className="border p-2 rounded mb-2">
                  <p><strong>Name:</strong> {item.name}</p>
                  <p><strong>Quantity:</strong> {item.quantity}</p>
                  <p><strong>Price:</strong> Rs {item.price}</p>
                  <p><strong>Total:</strong> Rs {item.totalPrice}</p>
                </div>
              ))}
            </div>

            {/* Other details */}
            <div className="mb-2"><strong>Delivery Charge:</strong> Rs {selectedOrder.deliveryCharge}</div>
            <div className="mb-2"><strong>Subtotal:</strong> Rs {selectedOrder.subtotal}</div>
            <div className="mb-2"><strong>Total Amount:</strong> Rs {selectedOrder.totalAmount}</div>
            <div className="mb-2"><strong>Payment Method:</strong> {selectedOrder.paymentMethod}</div>

            <div className="mt-4">
              <h3 className="font-semibold mb-2">Delivery Address:</h3>
              <p>No: {selectedOrder.address.no}, {selectedOrder.address.street}</p>
              <p>Phone: {selectedOrder.address.mobileNumber}</p>
            </div>

            <div className="mt-6 text-right">
              <button
                className="bg-orange-500 text-white px-4 py-2 rounded"
                onClick={() => {
                  setSelectedOrder(null);
                  setDeliveryInfo(null);
                }}
              >
                Close
              </button>
              <button
                className="bg-slate-600 text-white px-4 py-2 rounded ml-2"
                onClick={() => handleTrack(selectedOrder._id)}
              >
                Track
              </button>
            </div>

            {/* Delivery Info Display */}
            {deliveryInfo && (
              <div className="mt-6 p-4 border rounded bg-gray-50">
                <h3 className="font-semibold mb-2">Delivery Info:</h3>
                <p><strong>Status:</strong> {deliveryInfo.status}</p>
                <p><strong>Driver:</strong> {deliveryInfo.driverName || "N/A"}</p>
                <p><strong>Estimated Delivery:</strong> {deliveryInfo.estimatedTime || "N/A"}</p>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

export default OrdersPage;
