import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

function MyRestaurants() {
    const [restaurants, setRestaurants] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const navigate = useNavigate();

    useEffect(() => {
        const fetchMyRestaurants = async () => {
            try {
                const token = localStorage.getItem('token');
                const response = await axios.get('http://localhost:5004/api/restaurants/my', {
                    headers: { Authorization: `Bearer ${token}` }
                });
                setRestaurants(response.data);
                setLoading(false);
            } catch (err) {
                setError(err.response?.data.message || 'Failed to fetch restaurants');
                setLoading(false);
            }
        };

        fetchMyRestaurants();
    }, []);

    const handleDelete = async (restaurantId) => {
        if (window.confirm('Are you sure you want to delete this restaurant?')) {
            try {
                const token = localStorage.getItem('token');
                await axios.delete(`http://localhost:5004/api/restaurants/${restaurantId}`, {
                    headers: { Authorization: `Bearer ${token}` }
                });
                setRestaurants(restaurants.filter(r => r._id !== restaurantId));
            } catch (err) {
                alert('Failed to delete restaurant');
            }
        }
    };

    const handleEdit = (restaurantId) => {
        navigate(`/restaurants/${restaurantId}/edit`);
    };
    

    if (loading) return <div className="p-4">Loading...</div>;
    if (error) return <div className="p-4 text-red-500">{error}</div>;

    return (
        <div className="p-6">
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-2xl font-bold">My Restaurants</h1>
                <button 
                    onClick={() => navigate('/add-restaurant')}
                    className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
                >
                    Add New Restaurant
                </button>
            </div>

            {restaurants.length === 0 ? (
                <div className="bg-gray-100 p-6 rounded-lg text-center">
                    <p className="text-gray-600">You don't have any restaurants yet.</p>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {restaurants.map(restaurant => (
                        <div key={restaurant._id} className="bg-white rounded-lg shadow-md overflow-hidden border border-gray-200">
                            {restaurant.imageUrl && (
                                <img 
                                    src={restaurant.imageUrl} 
                                    alt={restaurant.name} 
                                    className="w-full h-48 object-cover"
                                />
                            )}
                            <div className="p-4">
                                <h2 className="text-xl font-semibold mb-2">{restaurant.name}</h2>
                                <p className="text-gray-600 mb-1">
                                    <span className="font-medium">Cuisine:</span> {restaurant.cuisineType || 'Not specified'}
                                </p>
                                <p className="text-gray-600 mb-1">
                                    <span className="font-medium">Address:</span> {restaurant.address.street}, {restaurant.address.city}
                                </p>
                                <p className="text-gray-600 mb-3">
                                    <span className="font-medium">Status:</span> 
                                    <span className={`ml-1 px-2 py-1 rounded-full text-xs ${
                                        restaurant.status === 'Approved' ? 'bg-green-100 text-green-800' :
                                        restaurant.status === 'Pending' ? 'bg-yellow-100 text-yellow-800' :
                                        'bg-red-100 text-red-800'
                                    }`}>
                                        {restaurant.status}
                                    </span>
                                </p>
                                
                                <div className="flex justify-between mt-4">
                                    <button
                                        onClick={() => handleEdit(restaurant._id)}
                                        className="bg-blue-500 text-white px-3 py-1 rounded text-sm hover:bg-blue-600"
                                    >
                                        Edit
                                    </button>
                                    <button
                                        onClick={() => handleDelete(restaurant._id)}
                                        className="bg-red-500 text-white px-3 py-1 rounded text-sm hover:bg-red-600"
                                    >
                                        Delete
                                    </button>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}

export default MyRestaurants;