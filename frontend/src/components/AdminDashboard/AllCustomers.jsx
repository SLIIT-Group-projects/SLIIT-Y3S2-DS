import { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import AdminSidebar from "../Shared/AdminSidebar";

function CustomerList() {
  const [customers, setCustomers] = useState([]);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const fetchCustomers = async () => {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        navigate("/login"); // No token, redirect to login
        return;
      }

      const response = await axios.get("http://localhost:5001/api/auth/customers", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      setCustomers(response.data);
    } catch (err) {
      console.error(err);
      if (err.response && err.response.status === 403) {
        setError("Access denied. Only admins can view customers.");
      } else {
        setError("Failed to fetch customers.");
      }
    }
  };

  useEffect(() => {
    fetchCustomers();
  }, []);

  return (
    <div className="flex min-h-screen bg-gray-100">
      <AdminSidebar />
      <div className="flex-1 md:ml-64 p-6">
        <div className="bg-white shadow-md rounded-lg p-6">
          <h2 className="text-2xl font-semibold text-gray-800 mb-6 text-center">
            Registered Customers
          </h2>

          {error && (
            <div className="text-red-500 mb-6 text-center font-medium">{error}</div>
          )}

          {!error && (
            <div className="overflow-x-auto">
              <table className="min-w-full bg-white rounded-lg shadow-sm">
                <thead>
                  <tr className="bg-orange-500 text-white">
                    <th className="py-3 px-6 text-left font-medium">Name</th>
                    <th className="py-3 px-6 text-left font-medium">Email</th>
                    <th className="py-3 px-6 text-left font-medium">Role</th>
                  </tr>
                </thead>
                <tbody>
                  {customers.length > 0 ? (
                    customers.map((customer) => (
                      <tr key={customer._id} className="border-b border-gray-200 hover:bg-orange-50 transition duration-200">
                        <td className="py-3 px-6 text-gray-700">{customer.name}</td>
                        <td className="py-3 px-6 text-gray-700">{customer.email}</td>
                        <td className="py-3 px-6 text-gray-700 capitalize">{customer.role}</td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan="3" className="text-center py-6 text-gray-500">
                        No customers found.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default CustomerList;