import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import HeaderComponent from './Header';
import Sidebar from './SideBar';

function MyRestaurants() {
    const [activeTab, setActiveTab] = useState('Restaurants');
    const [expanded, setExpanded] = useState(true);
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

    if (loading) return (
        <div className="flex min-h-screen bg-gray-50">
            <Sidebar 
                activeTab={activeTab}
                setActiveTab={setActiveTab}
                expanded={expanded}
                setExpanded={setExpanded}
            />
            <div className={`flex-1 transition-all duration-300 ${expanded ? 'ml-64' : 'ml-20'}`}>
                <HeaderComponent className="sticky top-0 z-10 bg-white shadow-sm" />
                <div className="p-6">Loading...</div>
            </div>
        </div>
    );

    if (error) return (
        <div className="flex min-h-screen bg-gray-50">
            <Sidebar 
                activeTab={activeTab}
                setActiveTab={setActiveTab}
                expanded={expanded}
                setExpanded={setExpanded}
            />
            <div className={`flex-1 transition-all duration-300 ${expanded ? 'ml-64' : 'ml-20'}`}>
                <HeaderComponent className="sticky top-0 z-10 bg-white shadow-sm" />
                <div className="p-6 text-red-500">{error}</div>
            </div>
        </div>
    );

    return (
        <div className="flex min-h-screen bg-gray-50">
            <Sidebar 
                activeTab={activeTab}
                setActiveTab={setActiveTab}
                expanded={expanded}
                setExpanded={setExpanded}
            />
            
            <div className={`flex-1 transition-all duration-300 ${expanded ? 'ml-64' : 'ml-20'}`}>
                <HeaderComponent className="sticky top-0 z-10 bg-white shadow-sm" />
                
                <div className="p-6">
                    <div className="flex justify-between items-center mb-6">
                        <h1 className="text-2xl font-bold text-gray-800">My Restaurants</h1>
                        <button 
                            onClick={() => navigate('/restaurant-register')}
                            className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition-colors"
                        >
                            Add New Restaurant
                        </button>
                    </div>

                    {restaurants.length === 0 ? (
                        <div className="bg-gray-100 p-6 rounded-lg text-center">
                            <p className="text-gray-600">You don't have any restaurants yet.</p>
                            <button
                                onClick={() => navigate('/restaurant-register')}
                                className="mt-4 bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition-colors"
                            >
                                Add Your First Restaurant
                            </button>
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {restaurants.map(restaurant => (
                                <div key={restaurant._id} className="bg-white rounded-lg shadow-md overflow-hidden border border-gray-200 hover:shadow-lg transition-shadow">
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
                                            <span className="font-medium">Address:</span> {restaurant.address?.street || 'N/A'}, {restaurant.address?.city || 'N/A'}
                                        </p>
                                        <p className="text-gray-600 mb-3">
                                            <span className="font-medium">Status:</span> 
                                            <span className={`ml-1 px-2 py-1 rounded-full text-xs ${
                                                restaurant.status === 'Approved' ? 'bg-green-100 text-green-800' :
                                                restaurant.status === 'Pending' ? 'bg-yellow-100 text-yellow-800' :
                                                'bg-red-100 text-red-800'
                                            }`}>
                                                {restaurant.status || 'Unknown'}
                                            </span>
                                        </p>
                                        
                                        <div className="flex justify-between mt-4">
                                            <button
                                                onClick={() => handleEdit(restaurant._id)}
                                                className="bg-blue-500 text-white px-3 py-1 rounded text-sm hover:bg-blue-600 transition-colors"
                                            >
                                                Edit
                                            </button>
                                            <button
                                                onClick={() => handleDelete(restaurant._id)}
                                                className="bg-red-500 text-white px-3 py-1 rounded text-sm hover:bg-red-600 transition-colors"
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
            </div>
        </div>
    );
}

export default MyRestaurants;