import { useEffect, useState } from "react";
import axios from "axios";
import AdminSidebar from "../Shared/AdminSidebar";
import { Dialog } from "@headlessui/react";

function AdminAllOrders() {
  const [orders, setOrders] = useState([]);
  const [error, setError] = useState("");
  const [restaurantCache, setRestaurantCache] = useState({});
  const [userCache, setUserCache] = useState({});
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const fetchOrders = async () => {
    try {
      const token = localStorage.getItem("token");

      const res = await axios.get("http://localhost:5003/api/order", {
        headers: { Authorization: `Bearer ${token}` },
      });

      const ordersWithDetails = await Promise.all(
        res.data.map(async (order) => {
          // Fetch restaurant
          let restaurant = restaurantCache[order.restaurantId];
          if (!restaurant) {
            try {
              const restaurantRes = await axios.get(
                `http://localhost:5004/api/restaurants/${order.restaurantId}`
              );
              restaurant = restaurantRes.data;
              setRestaurantCache((prev) => ({
                ...prev,
                [order.restaurantId]: restaurant,
              }));
            } catch (error) {
              console.error("Error fetching restaurant:", error.message);
              restaurant = { name: "Unknown Restaurant" };
            }
          }

          // Fetch user
          let user = userCache[order.userId];
          if (!user) {
            try {
              const userRes = await axios.get(
                `http://localhost:5001/api/auth/user/${order.userId}`
              );
              user = userRes.data;
              setUserCache((prev) => ({
                ...prev,
                [order.userId]: user,
              }));
            } catch (error) {
              console.error("Error fetching user:", error.message);
              user = { name: "Unknown User" };
            }
          }

          return { ...order, restaurant, user };
        })
      );

      setOrders(ordersWithDetails);
    } catch (err) {
      console.error("Error fetching orders:", err);
      setError("Failed to load orders");
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  const openOrderDialog = (order) => {
    setSelectedOrder(order);
    setIsDialogOpen(true);
  };

  return (
    <div className="flex min-h-screen bg-gray-100">
      <AdminSidebar />

      <main className="flex-1 p-8 md:ml-64">
        <div className="max-w-7xl mx-auto">
          <h1 className="text-4xl font-bold text-orange-600 mb-8 text-center">
            All Orders
          </h1>

          {error && (
            <div className="text-center text-red-500 font-semibold">{error}</div>
          )}

          {!error && (
            <div className="overflow-x-auto shadow-lg rounded-lg bg-white p-6">
              <table className="min-w-full text-sm text-gray-700">
                <thead className="bg-orange-100 uppercase text-gray-700">
                  <tr>
                    <th className="py-3 px-6 text-left">Order ID</th>
                    <th className="py-3 px-6 text-left">Customer</th>
                    <th className="py-3 px-6 text-left">Restaurant</th>
                    <th className="py-3 px-6 text-left">Payment</th>
                    <th className="py-3 px-6 text-left">Status</th>
                    <th className="py-3 px-6 text-left">Total (LKR)</th>
                    <th className="py-3 px-6 text-left">Created At</th>
                  </tr>
                </thead>
                <tbody>
                  {orders.map((order) => (
                    <tr
                      key={order._id}
                      className="border-b hover:bg-orange-50 cursor-pointer"
                      onClick={() => openOrderDialog(order)}
                    >
                      <td className="py-3 px-6">{order._id}</td>
                      <td className="py-3 px-6">{order.user?.name || "N/A"}</td>
                      <td className="py-3 px-6">{order.restaurant?.name || "N/A"}</td>
                      <td className="py-3 px-6">{order.paymentMethod}</td>
                      <td className="py-3 px-6 capitalize">
                        {order.status === "Delivered" ? (
                          <span className="text-green-500 font-semibold">{order.status}</span>
                        ) : (
                          <span className="text-yellow-500 font-semibold">{order.status}</span>
                        )}
                      </td>
                      <td className="py-3 px-6">{order.totalAmount.toFixed(2)}</td>
                      <td className="py-3 px-6">
                        {new Date(order.createdAt).toLocaleString()}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {/* Order Details Dialog */}
          <Dialog open={isDialogOpen} onClose={() => setIsDialogOpen(false)} className="relative z-50">
            <div className="fixed inset-0 bg-black/30" aria-hidden="true" />
            <div className="fixed inset-0 flex items-center justify-center p-4">
              <Dialog.Panel className="bg-white rounded-lg max-w-3xl w-full p-6 shadow-lg space-y-6">
                {selectedOrder && (
                  <>
                    <Dialog.Title className="text-2xl font-bold text-center text-orange-600 mb-4">
                      Order Details
                    </Dialog.Title>

                    <div className="space-y-3 text-gray-700">
                      <p><strong>Order ID:</strong> {selectedOrder._id}</p>
                      <p><strong>Customer:</strong> {selectedOrder.user?.name} ({selectedOrder.user?.email})</p>
                      <p><strong>Restaurant:</strong> {selectedOrder.restaurant?.name}</p>
                      <p><strong>Payment Method:</strong> {selectedOrder.paymentMethod}</p>
                      <p><strong>Status:</strong> {selectedOrder.status}</p>
                      <p><strong>Address:</strong> {selectedOrder.address?.no}, {selectedOrder.address?.street}</p>
                      <p><strong>Mobile:</strong> {selectedOrder.address?.mobileNumber}</p>
                      <p><strong>Total Amount:</strong> Rs {selectedOrder.totalAmount.toFixed(2)}</p>
                      <p><strong>Ordered At:</strong> {new Date(selectedOrder.createdAt).toLocaleString()}</p>
                    </div>

                    <div className="flex justify-end">
                      <button
                        onClick={() => setIsDialogOpen(false)}
                        className="bg-gray-300 hover:bg-gray-400 text-gray-800 px-6 py-2 rounded-lg transition"
                      >
                        Close
                      </button>
                    </div>
                  </>
                )}
              </Dialog.Panel>
            </div>
          </Dialog>
        </div>
      </main>
    </div>
  );
}

export default AdminAllOrders;
