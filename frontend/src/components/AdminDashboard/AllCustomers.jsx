import { useEffect, useState } from "react";
import axios from "axios";
import { Dialog } from "@headlessui/react";
import { useNavigate } from "react-router-dom";
import AdminSidebar from "../Shared/AdminSidebar";

function UserList() {
  const [users, setUsers] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const fetchUsers = async () => {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        navigate("/login");
        return;
      }

      const response = await axios.get("http://localhost:5001/api/auth/customers", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      setUsers(response.data);
    } catch (err) {
      console.error(err);
      if (err.response && err.response.status === 403) {
        setError("Access denied. Only admins can view users.");
      } else {
        setError("Failed to fetch users.");
      }
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  return (
    <div className="flex min-h-screen bg-gray-100">
      <AdminSidebar />
      <div className="flex-1 md:ml-64 p-6">
        <div className="bg-white shadow-md rounded-lg p-6">
          <h2 className="text-2xl font-semibold text-gray-800 mb-6 text-center">
            Registered Users
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
                  {users.length > 0 ? (
                    users.map((user) => (
                      <tr
                        key={user._id}
                        onClick={() => {
                          setSelectedUser(user);
                          setIsDialogOpen(true);
                        }}
                        className="border-b border-gray-200 hover:bg-orange-50 cursor-pointer transition duration-200"
                      >
                        <td className="py-3 px-6 text-gray-700">{user.name}</td>
                        <td className="py-3 px-6 text-gray-700">{user.email}</td>
                        <td className="py-3 px-6 text-gray-700 capitalize">{user.role}</td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan="3" className="text-center py-6 text-gray-500">
                        No users found.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>

      {/* Dialog for User Details */}
      <Dialog
        open={isDialogOpen}
        onClose={() => setIsDialogOpen(false)}
        className="relative z-50"
      >
        <div className="fixed inset-0 bg-black/30" aria-hidden="true" />
        <div className="fixed inset-0 flex items-center justify-center p-4">
          <Dialog.Panel className="bg-white rounded-lg max-w-md w-full p-6 shadow-lg space-y-6">
            {selectedUser && (
              <>
                <Dialog.Title className="text-2xl font-bold text-center text-orange-600 mb-2">
                  User Details
                </Dialog.Title>

                <div className="space-y-2 text-gray-700">
                  <p>
                    <span className="font-semibold">Name:</span> {selectedUser.name}
                  </p>
                  <p>
                    <span className="font-semibold">Email:</span> {selectedUser.email}
                  </p>
                  <p>
                    <span className="font-semibold">Role:</span> {selectedUser.role}
                  </p>
                  {selectedUser.createdAt && (
                    <p>
                      <span className="font-semibold">Created At:</span>{" "}
                      {new Date(selectedUser.createdAt).toLocaleString()}
                    </p>
                  )}
                  {selectedUser.updatedAt && (
                    <p>
                      <span className="font-semibold">Updated At:</span>{" "}
                      {new Date(selectedUser.updatedAt).toLocaleString()}
                    </p>
                  )}
                </div>

                <div className="flex justify-center pt-4">
                  <button
                    onClick={() => setIsDialogOpen(false)}
                    className="bg-orange-500 hover:bg-orange-600 text-white px-6 py-2 rounded-lg transition"
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
  );
}

export default UserList;
