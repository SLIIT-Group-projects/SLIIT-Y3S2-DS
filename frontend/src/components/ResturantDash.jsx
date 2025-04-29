import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

function RestaurantDash() {
    const [restaurants, setRestaurants] = useState([]);
    const [menuItems, setMenuItems] = useState([]);
    const [selectedRestaurant, setSelectedRestaurant] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [itemToDelete, setItemToDelete] = useState(null);
    const navigate = useNavigate();

    // Fetch restaurants on component mount
    useEffect(() => {
        const fetchRestaurants = async () => {
            try {
                const token = localStorage.getItem('token');
                const restaurantsRes = await axios.get('http://localhost:5004/api/restaurants/my', {
                    headers: { Authorization: `Bearer ${token}` }
                });

                setRestaurants(restaurantsRes.data);

                if (restaurantsRes.data.length > 0) {
                    setSelectedRestaurant(restaurantsRes.data[0]);
                }

                setLoading(false);
            } catch (err) {
                setError(err.response?.data.message || 'Failed to fetch restaurants');
                setLoading(false);
            }
        };

        fetchRestaurants();
    }, []);

    // Fetch menu items when selected restaurant changes
    useEffect(() => {
        const fetchMenuItems = async () => {
            if (!selectedRestaurant) return;

            try {
                const token = localStorage.getItem('token');
                const menuRes = await axios.get(
                    `http://localhost:5004/api/menu-items/restaurants/${selectedRestaurant._id}`,
                    { headers: { Authorization: `Bearer ${token}` } }
                );
                setMenuItems(menuRes.data);
            } catch (err) {
                setError(err.response?.data.message || 'Failed to fetch menu items');
            }
        };

        fetchMenuItems();
    }, [selectedRestaurant]);

    const handleLogout = () => {
        localStorage.clear();
        window.location.href = "/login";
    };

    const handleRestaurantSelect = (restaurant) => {
        setSelectedRestaurant(restaurant);
    };

    const addMenuItem = (restaurantId, e) => {
        e.stopPropagation();
        localStorage.setItem("restaurantId", restaurantId);
        navigate(`/restaurants/${restaurantId}/menu`);
    };

    const confirmDelete = (item) => {
        setItemToDelete(item);
        setShowDeleteModal(true);
    };

    const handleDelete = async () => {
        try {
            const token = localStorage.getItem("token");
            await axios.delete(`http://localhost:5004/api/menu-items/${itemToDelete._id}`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            
            // Refresh the menu items after deletion
            const menuRes = await axios.get(
                `http://localhost:5004/api/menu-items/restaurants/${selectedRestaurant._id}`,
                { headers: { Authorization: `Bearer ${token}` } }
            );
            setMenuItems(menuRes.data);
            
            setShowDeleteModal(false);
        } catch (err) {
            console.error("Error deleting menu item", err);
            alert("Failed to delete menu item");
            setShowDeleteModal(false);
        }
    };

    if (loading) return <div>Loading...</div>;
    if (error) return <div className="text-red-500">{error}</div>;

    return (
        <div className="p-4 sm:p-6 md:p-10 flex-wrap bg-gray-100 min-h-screen">
            <h1 className="text-2xl font-bold mb-6">Restaurant Dashboard</h1>

            <div className="flex gap-2 mb-4">
                <button className="bg-blue-500 text-white px-4 py-2 rounded">Add Menu</button>
                <button onClick={handleLogout} className="bg-red-500 text-white px-4 py-2 rounded">Logout</button>
                <button onClick={() => navigate('/restaurant-register')} className="bg-green-500 text-white px-4 py-2 rounded">Add Restaurant</button>
            </div>

            <div className="mb-8">
                <h2 className="text-xl font-semibold mb-4">My Restaurants</h2>
                {restaurants.length === 0 ? (
                    <div className="bg-yellow-100 p-4 rounded">
                        <p>You don't have any restaurants yet.</p>
                        <button
                            onClick={() => navigate('/restaurant-register')}
                            className="mt-2 bg-blue-500 text-white px-4 py-2 rounded"
                        >
                            Add Restaurant
                        </button>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                        {restaurants.map(restaurant => (
                            <div
                                key={restaurant._id}
                                className={`border p-4 rounded-lg shadow cursor-pointer ${selectedRestaurant?._id === restaurant._id ? 'ring-2 ring-blue-500' : ''}`}
                                onClick={() => handleRestaurantSelect(restaurant)}
                            >
                                <h3 className="font-bold text-lg">{restaurant.name}</h3>
                                <p className="text-gray-600">{restaurant.address.city}</p>
                                <p>{restaurant.cuisineType}</p>
                                <button
                                    onClick={(e) => addMenuItem(restaurant._id, e)}
                                    className="mt-2 bg-green-500 text-white px-3 py-1 rounded text-sm"
                                >
                                    Manage Menu
                                </button>
                            </div>
                        ))}
                    </div>
                )}
            </div>

            {selectedRestaurant && (
                <div>
                    <h2 className="text-xl font-semibold mb-4">
                        Menu Items for {selectedRestaurant.name}
                    </h2>
                    {menuItems.length === 0 ? (
                        <div className="bg-yellow-100 p-4 rounded">
                            <p>No menu items found for this restaurant.</p>
                            <button
                                onClick={() => navigate(`/restaurants/${selectedRestaurant._id}/menu/new`)}
                                className="mt-2 bg-blue-500 text-white px-4 py-2 rounded"
                            >
                                Add Menu Item
                            </button>
                        </div>
                    ) : (
                        <div className="overflow-x-auto">
                            <table className="min-w-full bg-white">
                                <thead>
                                    <tr>
                                        <th className="py-2 px-4 border">Name</th>
                                        <th className="py-2 px-4 border">Category</th>
                                        <th className="py-2 px-4 border">Price</th>
                                        <th className="py-2 px-4 border">Status</th>
                                        <th className="py-2 px-4 border">Actions</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {menuItems.map(item => (
                                        <tr key={item._id}>
                                            <td className="py-2 px-4 border">{item.name}</td>
                                            <td className="py-2 px-4 border">{item.category}</td>
                                            <td className="py-2 px-4 border">${item.price.toFixed(2)}</td>
                                            <td className="py-2 px-4 border">
                                                <span className={`px-2 py-1 rounded-full text-xs ${item.isAvailable ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                                                    {item.isAvailable ? 'Available' : 'Unavailable'}
                                                </span>
                                            </td>
                                            <td className="py-2 px-4 border">
                                                <button
                                                    onClick={() => navigate(`/menu/${item._id}/edit`)}
                                                    className="bg-blue-500 text-white px-2 py-1 rounded text-xs mr-2"
                                                >
                                                    Edit
                                                </button>
                                                <button
                                                    onClick={(e) => {
                                                        e.stopPropagation();
                                                        confirmDelete(item);
                                                    }}
                                                    className="bg-red-500 text-white px-2 py-1 rounded text-xs"
                                                >
                                                    Delete
                                                </button>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    )}
                </div>
            )}

            {/* Delete Confirmation Modal */}
            {showDeleteModal && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                    <div className="bg-white p-6 rounded-lg shadow-lg max-w-md w-full">
                        <h3 className="text-xl font-bold mb-4">Confirm Deletion</h3>
                        <p className="mb-6">Are you sure you want to delete "{itemToDelete?.name}"?</p>
                        <div className="flex justify-end gap-4">
                            <button
                                onClick={() => setShowDeleteModal(false)}
                                className="px-4 py-2 border border-gray-300 rounded hover:bg-gray-100"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={handleDelete}
                                className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600"
                            >
                                Delete
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}

export default RestaurantDash;