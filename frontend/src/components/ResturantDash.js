

import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

function RestaurantDash() {
    const [restaurants, setRestaurants] = useState([]);
    const [menuItems, setMenuItems] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const navigate = useNavigate();

    useEffect(() => {
        const fetchData = async () => {
            try {
                const token = localStorage.getItem('token');
                
                // Fetch restaurants owned by the user
                const restaurantsRes = await axios.get('http://localhost:5004/api/restaurants/my', {
                    headers: { Authorization: `Bearer ${token}` }
                });
                
                setRestaurants(restaurantsRes.data);
                
                if (restaurantsRes.data.length > 0) {
                    // Fetch menu items for the first restaurant
                    const menuRes = await axios.get(
                        `http://localhost:5004/api/menu-items/restaurants/${restaurantsRes.data[0]._id}`,
                        { headers: { Authorization: `Bearer ${token}` } }
                    );
                    setMenuItems(menuRes.data);
                }
                
                setLoading(false);
            } catch (err) {
                setError(err.response?.data.message || 'Failed to fetch data');
                setLoading(false);
            }
        };

        fetchData();
    }, []);

    if (loading) return <div>Loading...</div>;
    if (error) return <div className="text-red-500">{error}</div>;

    const handleLogout = () => {
      localStorage.clear();
      window.location.href = "/login";
    };
  
    
    return (
        <div className="container mx-auto p-4">
            <h1 className="text-2xl font-bold mb-6">Restaurant Dashboard</h1>

            <button className="mt-4 bg-red-500 text-white px-4 py-2 rounded">Add Menu</button>
        <button onClick={handleLogout} className="mt-4 bg-red-500 text-white px-4 py-2 rounded">Logout</button>
        <button onClick={() => navigate('/restaurant-register')} className="mt-4 bg-red-500 text-white px-4 py-2 rounded">Add Restaurant</button>
      
            
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
                            <div key={restaurant._id} className="border p-4 rounded-lg shadow">
                                <h3 className="font-bold text-lg">{restaurant.name}</h3>
                                <p className="text-gray-600">{restaurant.address.city}</p>
                                <p>{restaurant.cuisineType}</p>
                                <button 
  onClick={() => {
    localStorage.setItem("restaurantId", restaurant._id); // ✅ Save restaurantId
    navigate(`/restaurants/${restaurant._id}/menu`);
  }}
  className="mt-2 bg-green-500 text-white px-3 py-1 rounded text-sm"
>
  Manage Menu
</button>

                            </div>
                        ))}
                    </div>
                )}
            </div>
            
            {restaurants.length > 0 && (
                <div>
                    <h2 className="text-xl font-semibold mb-4">Menu Items</h2>
                    {menuItems.length === 0 ? (
                        <div className="bg-yellow-100 p-4 rounded">
                            <p>No menu items found for this restaurant.</p>
                            <button 
                                onClick={() => navigate(`/restaurants/${restaurants[0]._id}/menu/new`)}
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
                                                <span className={`px-2 py-1 rounded-full text-xs ${
                                                    item.isAvailable ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                                                }`}>
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
                                                {/*<button 
                                                    onClick={() => handleDeleteItem(item._id)}
                                                    className="bg-red-500 text-white px-2 py-1 rounded text-xs"
                                                >
                                                    Delete
                                                </button>*/}
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    )}
                </div>
            )}
        </div>
    );
}

export default RestaurantDash;