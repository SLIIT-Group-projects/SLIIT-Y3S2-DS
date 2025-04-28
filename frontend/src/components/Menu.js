import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';

const Menu = () => {
    const { restaurantId } = useParams();
    const [restaurant, setRestaurant] = useState(null);
    const [menuItems, setMenuItems] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchData = async () => {
            try {
                setLoading(true);
                setError(null);
                
                console.log(`Fetching data for restaurant: ${restaurantId}`);
                
                const [restaurantRes, menuRes] = await Promise.all([
                    axios.get(`http://localhost:5004/api/restaurants/${restaurantId}`),
                    axios.get(`http://localhost:5004/api/menu-items/${restaurantId}/menu-items`) // Changed endpoint
                ]);
                
                console.log('API Responses:', {
                    restaurant: restaurantRes.data,
                    menu: menuRes.data
                });
                
                if (!restaurantRes.data) {
                    throw new Error('Restaurant data not found');
                }
                
                setRestaurant(restaurantRes.data);
                setMenuItems(menuRes.data || []); // Ensure array even if undefined
                
                if (menuRes.data && menuRes.data.length === 0) {
                    console.warn('Menu items array is empty - check database');
                }
                
            } catch (error) {
                console.error('Fetch error:', {
                    message: error.message,
                    response: error.response?.data,
                    stack: error.stack
                });
                setError(error.response?.data?.message || 
                       'Failed to load menu. Please try again later.');
            } finally {
                setLoading(false);
            }
        };
        
        fetchData();
    }, [restaurantId]);

    const handleBackClick = () => {
        navigate(-1);
    };

    const handleHomeClick = () => {
        navigate('/');
    };

    if (loading) {
        return (
            <div className="flex justify-center items-center h-screen">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="container mx-auto px-4 py-8 text-center">
                <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4 max-w-md mx-auto">
                    {error}
                </div>
                <button 
                    onClick={handleHomeClick}
                    className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition-colors"
                >
                    Back to Home
                </button>
            </div>
        );
    }

    if (!restaurant) {
        return (
            <div className="container mx-auto px-4 py-8 text-center">
                <div className="bg-yellow-100 border border-yellow-400 text-yellow-700 px-4 py-3 rounded mb-4 max-w-md mx-auto">
                    Restaurant not found
                </div>
                <button 
                    onClick={handleHomeClick}
                    className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition-colors"
                >
                    Back to Home
                </button>
            </div>
        );
    }

    return (
        <div className="container mx-auto px-4 py-8">
            <button 
                onClick={handleBackClick} 
                className="flex items-center text-blue-600 mb-6 hover:text-blue-800 transition-colors"
            >
                <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                </svg>
                Back to Restaurants
            </button>

            <div className="flex flex-col md:flex-row items-start md:items-center gap-6 mb-8">
                {restaurant.image?.url ? (
                    <img 
                        src={restaurant.image.url} 
                        alt={restaurant.name}
                        className="w-24 h-24 md:w-32 md:h-32 rounded-full object-cover border-4 border-white shadow-md"
                        loading="lazy"
                    />
                ) : (
                    <div className="w-24 h-24 md:w-32 md:h-32 rounded-full bg-gray-200 flex items-center justify-center">
                        <span className="text-gray-500">No Image</span>
                    </div>
                )}
                <div>
                    <h1 className="text-2xl md:text-3xl font-bold">{restaurant.name}</h1>
                    <p className="text-gray-600 mt-1">{restaurant.cuisineType}</p>
                    <p className="text-gray-500 mt-2">
                        {restaurant.address?.street && `${restaurant.address.street}, `}
                        {restaurant.address?.city}
                    </p>
                </div>
            </div>

            <h2 className="text-2xl font-bold mb-6 border-b pb-2">Menu</h2>
            
            {menuItems.length === 0 ? (
                <div className="text-center py-12">
                    <p className="text-gray-500 text-lg">This restaurant hasn't added any menu items yet.</p>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {menuItems.map(item => (
                        <div key={item._id} className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-xl transition-shadow">
                            <div className="relative h-48 overflow-hidden">
                                {item.image?.url ? (
                                    <img 
                                        src={item.image.url} 
                                        alt={item.name}
                                        className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                                        loading="lazy"
                                    />
                                ) : (
                                    <div className="w-full h-full bg-gray-200 flex items-center justify-center">
                                        <span className="text-gray-500">No Image</span>
                                    </div>
                                )}
                            </div>
                            <div className="p-4">
                                <h3 className="text-xl font-semibold">{item.name}</h3>
                                <p className="text-gray-600 my-2 line-clamp-2">{item.description}</p>
                                <div className="flex justify-between items-center mt-4">
                                    <span className="text-lg font-bold">${item.price?.toFixed(2) || '0.00'}</span>
                                    <button 
                                        className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition-colors"
                                        onClick={() => {
                                            // Add to cart functionality would go here
                                            console.log('Added to cart:', item);
                                        }}
                                    >
                                        Add to Cart
                                    </button>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default Menu;