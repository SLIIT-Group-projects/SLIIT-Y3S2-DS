import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { ArrowLeft, ShoppingBag, Clock, Star } from 'lucide-react';

const Menu = () => {
    const { restaurantId } = useParams();
    const [restaurant, setRestaurant] = useState(null);
    const [menuItems, setMenuItems] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [quantity, setQuantity] = useState(1);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchData = async () => {
            try {
                setLoading(true);
                setError(null);

                const restaurantRes = await axios.get(
                    `http://localhost:5004/api/restaurants/${restaurantId}`
                ).catch(err => {
                    throw new Error(`Failed to fetch restaurant: ${err.message}`);
                });

                if (!restaurantRes.data) {
                    throw new Error('Restaurant data not found');
                }

                const menuRes = await axios.get(
                    `http://localhost:5004/api/menu-items/public/${restaurantId}`
                ).catch(err => {
                    console.warn('Failed to fetch menu, proceeding with empty array');
                    return { data: [] };
                });

                setRestaurant(restaurantRes.data);
                setMenuItems(menuRes.data || []);

            } catch (error) {
                console.error('Fetch error:', error);
                setError(error.message || 'Failed to load data. Please try again later.');
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, [restaurantId]);

    const handleBackClick = () => {
        navigate('/allRestaurants');
    };

    const handleHomeClick = () => {
        navigate('/');
    };

    if (loading) {
        return (
            <div className="flex justify-center items-center h-screen">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-orange-500"></div>
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
                    className="bg-orange-500 hover:bg-orange-600 text-white px-4 py-2 rounded-full transition-colors"
                >
                    Back to Home
                </button>
            </div>
        );
    }


    const handleIncreaseQuantity = () => {
        setQuantity(prev => prev + 1);
    };

    const handleDecreaseQuantity = () => {
        if (quantity > 1) {
            setQuantity(prev => prev - 1);
        }
    };

    if (!restaurant) {
        return (
            <div className="container mx-auto px-4 py-8 text-center">
                <div className="bg-yellow-100 border border-yellow-400 text-yellow-700 px-4 py-3 rounded mb-4 max-w-md mx-auto">
                    Restaurant not found
                </div>
                <button
                    onClick={handleHomeClick}
                    className="bg-orange-500 hover:bg-orange-600 text-white px-4 py-2 rounded-full transition-colors"
                >
                    Back to Home
                </button>
            </div>
        );
    }

    return (
        <div className="bg-gray-50 min-h-screen">
            <div className="container mx-auto px-4 py-8 pl-12 pr-12">
                <button
                    onClick={handleBackClick}
                    className="flex items-center text-orange-500 mb-6 hover:text-orange-600 transition-colors"
                >
                    <ArrowLeft className="w-5 h-5 mr-2" />
                    Back to Restaurants
                </button>

                <div className="bg-white rounded-xl shadow-md p-6 mb-8">
                    <div className="flex flex-col md:flex-row items-start md:items-center gap-6">
                        {restaurant.imageUrl ? (
                            <img
                                src={restaurant.imageUrl}
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
                            <p className="text-orange-500 mt-1">{restaurant.cuisineType}</p>
                            <div className="flex items-center gap-4 mt-2 text-gray-600">
                                <div className="flex items-center gap-1">
                                    <Clock className="w-4 h-4" />
                                    <span>30-40 min</span>
                                </div>
                                <div className="flex items-center gap-1">
                                    <Star className="w-4 h-4 text-yellow-400" />
                                    <span>4.5</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="bg-white rounded-xl shadow-md p-6">
                    <h2 className="text-2xl font-bold mb-6">Menu Items</h2>

                    {menuItems.length === 0 ? (
                        <div className="text-center py-12">
                            <p className="text-gray-500 text-lg">This restaurant hasn't added any menu items yet.</p>
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                            {menuItems.map(item => (
                                <div key={item._id}
                                    className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 cursor-pointer"
                                    onClick={() => navigate(`/restaurants/${restaurantId}/menu/${item._id}`)}>
                                    <div className="relative h-64 overflow-hidden">
                                        {item.imageUrl ? (
                                            <img
                                                src={item.imageUrl}
                                                alt={item.name}
                                                className="w-full h-full object-cover transition-transform duration-300 hover:scale-105"
                                                loading="lazy"
                                            />
                                        ) : (
                                            <div className="w-full h-full bg-gray-200 flex items-center justify-center">
                                                <span className="text-gray-500">No Image</span>
                                            </div>
                                        )}
                                        <div className="absolute top-4 right-4 bg-white px-4 py-2 rounded-full text-lg font-medium text-orange-500 shadow-md">
                                            ${item.price?.toFixed(2) || '0.00'}
                                        </div>
                                    </div>
                                    <div className="p-6">
                                        <h3 className="text-2xl font-semibold text-gray-800 mb-2">{item.name}</h3>
                                        <p className="text-gray-600 text-base mb-4">{item.description}</p>

                                        {/* Quantity Selector */}
                                        <div className="mb-8">
                                            <h3 className="text-lg font-medium mb-3">Quantity</h3>
                                            <div className="flex items-center gap-4">
                                                <button
                                                    onClick={handleDecreaseQuantity}
                                                    className="w-12 h-12 rounded-full border border-gray-300 flex items-center justify-center text-xl font-medium hover:bg-gray-50 transition-colors"
                                                >
                                                    -
                                                </button>
                                                <span className="text-xl font-medium">{quantity}</span>
                                                <button
                                                    onClick={handleIncreaseQuantity}
                                                    className="w-12 h-12 rounded-full border border-gray-300 flex items-center justify-center text-xl font-medium hover:bg-gray-50 transition-colors"
                                                >
                                                    +
                                                </button>
                                            </div>
                                        </div>
                                        <button
                                            className="w-full bg-orange-50 text-orange-500 py-3 rounded-full font-medium hover:bg-orange-100 transition-colors flex items-center justify-center gap-2 text-lg"
                                            onClick={() => {
                                                console.log('Added to cart:', item);
                                            }}
                                        >
                                            <ShoppingBag className="w-5 h-5" />
                                            Add to Cart
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default Menu;