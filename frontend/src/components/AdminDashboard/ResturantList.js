import { useEffect, useState } from "react";
import axios from "axios";
import AdminSidebar from "../Shared/AdminSidebar";
import { Dialog } from "@headlessui/react";

function AdminRestaurantList() {
  const [restaurants, setRestaurants] = useState([]);
  const [selectedRestaurant, setSelectedRestaurant] = useState(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [error, setError] = useState("");

  const fetchRestaurants = async () => {
    try {
      const res = await axios.get("http://localhost:5004/api/restaurants");
      setRestaurants(res.data);
    } catch (err) {
      console.error(err);
      setError("Failed to fetch restaurants");
    }
  };

  useEffect(() => {
    fetchRestaurants();
  }, []);

  const handleVerify = async (id) => {
    try {
      const token = localStorage.getItem("token");
      await axios.put(`http://localhost:5004/api/restaurants/verify/${id}`, {}, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      fetchRestaurants();
      setIsDialogOpen(false);
    } catch (err) {
      console.error(err);
      setError("Failed to verify restaurant");
    }
  };

  return (
    <div className="flex bg-gray-100 min-h-screen">
      <AdminSidebar />

      <main className="flex-1 p-8 md:ml-64">
        <div className="max-w-7xl mx-auto">
          <h1 className="text-4xl font-bold text-orange-600 mb-8 text-center">
            Manage Restaurants
          </h1>

          {error && (
            <div className="text-red-500 text-center mb-6">{error}</div>
          )}

          {!error && (
            <div className="overflow-x-auto shadow-md bg-white rounded-lg p-6">
              <table className="min-w-full text-sm text-gray-800">
                <thead className="bg-orange-100 text-gray-700 uppercase">
                  <tr>
                    <th className="py-3 px-6 text-left">Name</th>
                    <th className="py-3 px-6 text-left">Status</th>
                    <th className="py-3 px-6 text-left">Action</th>
                  </tr>
                </thead>
                <tbody>
                  {restaurants.map((res) => (
                    <tr
                      key={res._id}
                      className="border-b hover:bg-orange-50 cursor-pointer"
                      onClick={() => {
                        setSelectedRestaurant(res);
                        setIsDialogOpen(true);
                      }}
                    >
                      <td className="py-3 px-6">{res.name}</td>
                      <td className="py-3 px-6 capitalize">{res.status}</td>
                      <td className="py-3 px-6">
                        {res.status === "Pending" ? (
                          <span className="text-yellow-600 font-semibold">
                            Awaiting Verification
                          </span>
                        ) : (
                          <span className="text-green-600 font-semibold">
                            Approved
                          </span>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {/* Dialog box */}
          <Dialog open={isDialogOpen} onClose={() => setIsDialogOpen(false)} className="relative z-50">
            <div className="fixed inset-0 bg-black/30" aria-hidden="true" />
            <div className="fixed inset-0 flex items-center justify-center p-4">
              <Dialog.Panel className="bg-white rounded-lg max-w-2xl w-full p-6 shadow-lg space-y-6">
                {selectedRestaurant && (
                  <>
                    <Dialog.Title className="text-2xl font-bold text-center text-orange-600 mb-2">
                      {selectedRestaurant.name}
                    </Dialog.Title>

                    {/* Details */}
                    <div className="space-y-2 text-gray-700">
                      <p><span className="font-semibold">Description:</span> {selectedRestaurant.description || 'No description'}</p>
                      <p><span className="font-semibold">Status:</span> {selectedRestaurant.status}</p>
                      <p><span className="font-semibold">City:</span> {selectedRestaurant.address?.city}</p>
                      <p><span className="font-semibold">District:</span> {selectedRestaurant.address?.district}</p>
                      <p><span className="font-semibold">Phone:</span> {selectedRestaurant.contact?.phone}</p>
                      <p><span className="font-semibold">Email:</span> {selectedRestaurant.contact?.email}</p>
                      <div>
                        <span className="font-semibold">Opening Hours:</span>
                        <ul className="ml-6 list-disc">
                          {selectedRestaurant.openingHours?.map((time, index) => (
                            <li key={index}>
                              {time.day}: {time.open} - {time.close}
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>

                    {/* Buttons */}
                    <div className="flex justify-center gap-6 pt-4">
                      {selectedRestaurant.status === "Pending" && (
                        <button
                          onClick={() => handleVerify(selectedRestaurant._id)}
                          className="bg-orange-500 text-white px-6 py-2 rounded-lg hover:bg-orange-600"
                        >
                          Verify Restaurant
                        </button>
                      )}
                      <button
                        onClick={() => setIsDialogOpen(false)}
                        className="bg-gray-300 text-gray-800 px-6 py-2 rounded-lg hover:bg-gray-400"
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

export default AdminRestaurantList;
