import { useEffect, useState } from "react";
import axios from "axios";
import AdminSidebar from "../Shared/AdminSidebar";

function TransactionList() {
  const [transactions, setTransactions] = useState([]);
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(true);

  const fetchTransactions = async () => {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        throw new Error("No authentication token found. Please log in.");
      }

      const res = await axios.get(
        "http://localhost:5005/api/payment/transactions",
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      setTransactions(res.data);
      setIsLoading(false);
    } catch (err) {
      console.error("Error fetching transactions:", err);
      setError(err.message || "Failed to load transactions");
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchTransactions();
  }, []);

  return (
    <div className="flex bg-gray-100 min-h-screen">
      {/* Sidebar */}
      <AdminSidebar />

      {/* Main Content */}
      <main className="flex-1 p-6 md:ml-64">
        <div className="max-w-7xl mx-auto">
          <h1 className="text-4xl font-bold text-orange-600 mb-10 text-center">
            Financial Transactions
          </h1>

          {isLoading && (
            <div className="text-center text-gray-500">Loading transactions...</div>
          )}

          {error && (
            <div className="text-red-500 text-center mb-6">{error}</div>
          )}

          {!isLoading && !error && transactions.length > 0 ? (
            <div className="overflow-x-auto bg-white shadow-md rounded-lg p-6">
              <table className="min-w-full text-sm text-gray-800">
                <thead className="bg-orange-100 uppercase text-gray-700">
                  <tr>
                    <th className="py-4 px-6 text-left">Customer</th>
                    <th className="py-4 px-6 text-left">Amount (LKR)</th>
                    <th className="py-4 px-6 text-left">Status</th>
                    <th className="py-4 px-6 text-left">Date</th>
                    <th className="py-4 px-6 text-left">Restaurant ID</th>
                    <th className="py-4 px-6 text-left">Order Items</th>
                  </tr>
                </thead>
                <tbody>
                  {transactions.map((tx) => (
                    <tr
                      key={tx._id}
                      className="border-b hover:bg-orange-50 transition duration-200"
                    >
                      <td className="py-4 px-6">{tx.customerName}</td>
                      <td className="py-4 px-6 font-semibold">
                        {(tx.amount / 100).toFixed(2)}
                      </td>
                      <td className="py-4 px-6 capitalize">{tx.status}</td>
                      <td className="py-4 px-6">
                        {new Date(tx.date).toLocaleString("en-GB")}
                      </td>
                      <td className="py-4 px-6">{tx.restaurantId}</td>
                      <td className="py-4 px-6">
                        {tx.orderItems && tx.orderItems.length > 0 ? (
                          <ul className="list-disc list-inside">
                            {tx.orderItems.map((item, index) => (
                              <li key={index}>
                                {item.name} x {item.quantity} @ Rs {item.price.toFixed(2)}
                              </li>
                            ))}
                          </ul>
                        ) : (
                          "No items"
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            !isLoading &&
            !error && (
              <div className="text-center text-gray-500">
                No transactions found.
              </div>
            )
          )}
        </div>
      </main>
    </div>
  );
}

export default TransactionList;