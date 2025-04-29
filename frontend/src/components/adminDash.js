import { useEffect, useState } from "react";
import axios from "axios";
import AdminSidebar from "./Shared/AdminSidebar";

function AdminDash() {
  const [stats, setStats] = useState({
    users: 0,
    orders: 0,
    restaurants: 0,
    revenue: 0,
  });

  const fetchStats = async () => {
    try {
      const token = localStorage.getItem("token");

      const [usersRes, ordersRes, restaurantsRes, paymentsRes] = await Promise.all([
        axios.get("http://localhost:5001/api/auth/users", {
          headers: { Authorization: `Bearer ${token}` },
        }),
        axios.get("http://localhost:5003/api/order", {
          headers: { Authorization: `Bearer ${token}` },
        }),
        axios.get("http://localhost:5004/api/restaurants", {
          headers: { Authorization: `Bearer ${token}` },
        }),
        axios.get("http://localhost:5005/api/payment/transactions", {
          headers: { Authorization: `Bearer ${token}` },
        }),
      ]);

      const totalRevenue = paymentsRes.data.reduce(
        (sum, payment) => sum + payment.amount,
        0
      );

      setStats({
        users: usersRes.data.length,
        orders: ordersRes.data.length,
        restaurants: restaurantsRes.data.length,
        revenue: totalRevenue / 100, // if revenue in cents
      });
    } catch (err) {
      console.error("Failed to fetch stats:", err);
    }
  };

  useEffect(() => {
    fetchStats();
  }, []);

  const handleLogout = () => {
    localStorage.clear();
    window.location.href = "/login";
  };

  return (
    <div className="flex min-h-screen bg-gray-100">
      <AdminSidebar />
      <div className="flex-1 md:ml-64 p-6">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-3xl font-semibold text-gray-800">Admin Dashboard</h2>
          <button
            onClick={handleLogout}
            className="bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600 transition duration-300 font-medium"
          >
            Logout
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="bg-white shadow-md rounded-lg p-6 text-center">
            <h3 className="text-lg font-semibold text-gray-700 mb-2">Total Users</h3>
            <p className="text-3xl font-bold text-orange-500">{stats.users}</p>
          </div>

          <div className="bg-white shadow-md rounded-lg p-6 text-center">
            <h3 className="text-lg font-semibold text-gray-700 mb-2">Total Orders</h3>
            <p className="text-3xl font-bold text-green-500">{stats.orders}</p>
          </div>

          <div className="bg-white shadow-md rounded-lg p-6 text-center">
            <h3 className="text-lg font-semibold text-gray-700 mb-2">Total Restaurants</h3>
            <p className="text-3xl font-bold text-blue-500">{stats.restaurants}</p>
          </div>

          <div className="bg-white shadow-md rounded-lg p-6 text-center">
            <h3 className="text-lg font-semibold text-gray-700 mb-2">Revenue</h3>
            <p className="text-3xl font-bold text-purple-500">Rs {stats.revenue.toFixed(2)}</p>
          </div>
        </div>

        <div className="mt-10">
          <h3 className="text-2xl font-semibold text-gray-700 mb-4">Quick Actions</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-orange-100 hover:bg-orange-200 p-6 rounded-lg shadow text-center cursor-pointer transition">
              <h4 className="text-lg font-semibold text-gray-700 mb-2">Manage Users</h4>
              <p className="text-sm text-gray-500">View, Update, or Deactivate Users</p>
            </div>
            <div className="bg-green-100 hover:bg-green-200 p-6 rounded-lg shadow text-center cursor-pointer transition">
              <h4 className="text-lg font-semibold text-gray-700 mb-2">Manage Restaurants</h4>
              <p className="text-sm text-gray-500">Approve or Reject Restaurants</p>
            </div>
            <div className="bg-blue-100 hover:bg-blue-200 p-6 rounded-lg shadow text-center cursor-pointer transition">
              <h4 className="text-lg font-semibold text-gray-700 mb-2">View Orders</h4>
              <p className="text-sm text-gray-500">Monitor and update order statuses</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default AdminDash;
