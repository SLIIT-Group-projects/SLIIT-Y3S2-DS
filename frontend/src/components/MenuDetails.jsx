import React from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { ArrowLeft, ShoppingBag, Clock, Star, ChevronRight, Utensils, Flame, Leaf, Wheat, CheckCircle } from 'lucide-react';
import axios from 'axios';
import { useState, useEffect } from 'react';
import Swal from 'sweetalert2';


const MenuDetails = () => {
    const { restaurantId, menuItemId } = useParams();
    const [menuItem, setMenuItem] = useState(null);
    const [restaurant, setRestaurant] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [quantity, setQuantity] = useState(1);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchData = async () => {
            try {
                setLoading(true);
                setError(null);
                
                const menuItemRes = await axios.get(
                    `http://localhost:5004/api/menu-items/${menuItemId}`
                );
                
                if (!menuItemRes.data) {
                    throw new Error('Menu item not found');
                }
                
                const restaurantRes = await axios.get(
                    `http://localhost:5004/api/restaurants/${restaurantId}`
                );
                
                setMenuItem(menuItemRes.data);
                setRestaurant(restaurantRes.data);
                
            } catch (error) {
                console.error('Fetch error:', error);
                setError(error.message || 'Failed to load menu item. Please try again later.');
            } finally {
                setLoading(false);
            }
        };
        
        fetchData();
    }, [menuItemId, restaurantId]);

    const handleBackClick = () => {
        navigate(`/restaurants/${restaurant._id}/menuItems`);
    };

    const handleIncreaseQuantity = () => {
        setQuantity(prev => prev + 1);
    };

    const handleDecreaseQuantity = () => {
        if (quantity > 1) {
            setQuantity(prev => prev - 1);
        }
    };

    const handleAddToCart = async () => {
        try {
            const token = localStorage.getItem('token'); 
    
            if (!token) {
                Swal.fire({
                    icon: 'warning',
                    title: 'Login Required',
                    text: 'You need to be logged in to add items to the cart.',
                    confirmButtonColor: '#f97316'
                });
                return;
            }
    
            const response = await axios.post(
                'http://localhost:5003/api/cart/add',
                {
                    menuItemId: menuItem._id,   
                    quantity: quantity         
                },
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    }
                }
            );
    
            Swal.fire({
                icon: 'success',
                title: 'Added to Cart!',
                text: `${menuItem.name} (x${quantity}) added to your cart.`,
                confirmButtonColor: '#f97316'
            });
    
        } catch (error) {
            console.error('Failed to add to cart:', error);
            Swal.fire({
                icon: 'error',
                title: 'Error',
                text: 'Failed to add item to cart. Please try again.',
                confirmButtonColor: '#f97316'
            });
        }
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
                    onClick={handleBackClick}
                    className="bg-orange-500 hover:bg-orange-600 text-white px-4 py-2 rounded-full transition-colors"
                >
                    Back to Menu
                </button>
            </div>
        );
    }

    if (!menuItem || !restaurant) {
        return (
            <div className="container mx-auto px-4 py-8 text-center">
                <div className="bg-yellow-100 border border-yellow-400 text-yellow-700 px-4 py-3 rounded mb-4 max-w-md mx-auto">
                    Menu item not found
                </div>
                <button 
                    onClick={handleBackClick}
                    className="bg-orange-500 hover:bg-orange-600 text-white px-4 py-2 rounded-full transition-colors"
                >
                    Back to Menu
                </button>
            </div>
        );
    }

    // Dietary tag icons mapping
    const dietaryTagIcons = {
        'Vegetarian': <Leaf className="w-4 h-4 text-green-600" />,
        'Vegan': <Leaf className="w-4 h-4 text-green-800" />,
        'Gluten-Free': <Wheat className="w-4 h-4 text-amber-600" />,
        'Halal': <CheckCircle className="w-4 h-4 text-blue-600" />,
        'Spicy': <Flame className="w-4 h-4 text-red-600" />
    };

    return (
        <div className="bg-gray-50 min-h-screen pb-12">
            <div className="container mx-auto px-4 py-8 pl-12 pr-12">
                <button 
                    onClick={handleBackClick} 
                    className="flex items-center text-orange-500 mb-6 hover:text-orange-600 transition-colors"
                >
                    <ArrowLeft className="w-5 h-5 mr-2" />
                    Back to Menu
                </button>

                <div className="bg-white rounded-xl shadow-md overflow-hidden">
                    {/* Item Image */}
                    <div className="relative h-96 w-full overflow-hidden">
                        {menuItem.imageUrl ? (
                            <img 
                                src={menuItem.imageUrl} 
                                alt={menuItem.name}
                                className="w-full h-full object-cover"
                                loading="lazy"
                            />
                        ) : (
                            <div className="w-full h-full bg-gray-200 flex items-center justify-center">
                                <span className="text-gray-500 text-xl">No Image Available</span>
                            </div>
                        )}
                    </div>

                    {/* Item Details */}
                    <div className="p-6">
                        <div className="flex justify-between items-start mb-4">
                            <div>
                                <h1 className="text-3xl font-bold text-gray-900">{menuItem.name}</h1>
                                <div className="flex items-center gap-2 mt-1">
                                    <span className="px-2 py-1 bg-gray-100 text-gray-800 text-xs rounded-full">
                                        {menuItem.category}
                                    </span>
                                    <span className="px-2 py-1 bg-gray-100 text-gray-800 text-xs rounded-full flex items-center gap-1">
                                        <Utensils className="w-3 h-3" />
                                        {menuItem.cuisineType}
                                    </span>
                                </div>
                            </div>
                            <span className="text-2xl font-bold text-orange-500">
                                ${menuItem.price?.toFixed(2) || '0.00'}
                            </span>
                        </div>

                        {/* Dietary Tags */}
                        {menuItem.dietaryTags && menuItem.dietaryTags.length > 0 && (
                            <div className="flex flex-wrap gap-2 mb-4">
                                {menuItem.dietaryTags.map(tag => (
                                    <span 
                                        key={tag} 
                                        className="px-2 py-1 bg-gray-50 text-gray-700 text-xs rounded-full flex items-center gap-1 border border-gray-200"
                                    >
                                        {dietaryTagIcons[tag] || <CheckCircle className="w-3 h-3" />}
                                        {tag}
                                    </span>
                                ))}
                            </div>
                        )}

                        {/* Preparation Time */}
                        {menuItem.preparationTime && (
                            <div className="flex items-center gap-1 text-gray-600 mb-4">
                                <Clock className="w-4 h-4" />
                                <span className="text-sm">Prep time: ~{menuItem.preparationTime} mins</span>
                            </div>
                        )}

                        {/* Description */}
                        <p className="text-gray-600 text-lg mb-6">{menuItem.description}</p>

                        {/* Ingredients */}
                        {menuItem.ingredients && menuItem.ingredients.length > 0 && (
                            <div className="mb-6">
                                <h3 className="text-lg font-semibold mb-2">Ingredients</h3>
                                <ul className="grid grid-cols-1 md:grid-cols-2 gap-2">
                                    {menuItem.ingredients.map((ingredient, index) => (
                                        <li key={index} className="flex items-center gap-2">
                                            <span className="w-1.5 h-1.5 rounded-full bg-orange-500"></span>
                                            <span className="text-gray-700">{ingredient}</span>
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        )}

                        {/* Restaurant Info */}
                        <div 
                            className="flex items-center gap-3 p-4 bg-gray-50 rounded-lg mb-6 cursor-pointer hover:bg-gray-100 transition-colors"
                            onClick={() => navigate(`/restaurants/${restaurantId}`)}
                        >
                            {restaurant.imageUrl ? (
                                <img 
                                    src={restaurant.imageUrl} 
                                    alt={restaurant.name}
                                    className="w-12 h-12 rounded-full object-cover"
                                />
                            ) : (
                                <div className="w-12 h-12 rounded-full bg-gray-300 flex items-center justify-center">
                                    <span className="text-gray-500 text-xs">R</span>
                                </div>
                            )}
                            <div className="flex-1">
                                <h3 className="font-medium">{restaurant.name}</h3>
                                <p className="text-sm text-gray-500">{restaurant.cuisineType}</p>
                            </div>
                            <ChevronRight className="text-gray-400" />
                        </div>

                        {/* Quantity Selector */}
                        <div className="mb-8">
                            <h3 className="text-lg font-medium mb-3">Quantity</h3>
                            <div className="flex items-center gap-4">
                                <button 
                                    onClick={handleDecreaseQuantity} 
                                    className="text-2xl text-gray-600"
                                >
                                    -
                                </button>
                                <span className="text-xl font-semibold">{quantity}</span>
                                <button 
                                    onClick={handleIncreaseQuantity} 
                                    className="text-2xl text-gray-600"
                                >
                                    +
                                </button>
                            </div>
                        </div>

                        {/* Add to Cart */}
                        <button 
                            onClick={handleAddToCart} 
                            className="w-full bg-orange-500 hover:bg-orange-600 text-white text-lg py-3 rounded-full transition-colors"
                        >
                            <ShoppingBag className="w-5 h-5 inline-block mr-2" />
                            Add to Cart
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default MenuDetails;





