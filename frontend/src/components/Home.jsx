import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { Heart, ShoppingBag, Clock, Check } from 'lucide-react';
import deliveryGuy from '../assets/deliveryGuy.png';
import foodimage from '../assets/foodDelivery.png';
import meal from '../assets/meal.jpg';

const Home = () => {
    const [restaurants, setRestaurants] = useState([]);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchRestaurants = async () => {
            try {
                const { data } = await axios.get('http://localhost:5004/api/restaurants');
                setRestaurants(data.slice(0, 4)); // Only keep first 4 restaurants
            } catch (error) {
                console.error('Error fetching restaurants:', error);
            } finally {
                setLoading(false);
            }
        };
        fetchRestaurants();
    }, []);

    if (loading) return (
        <div className="flex justify-center items-center h-screen">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-orange-500"></div>
        </div>
    );

    const handleClick = () => {
        navigate('/allRestaurants');
    };

    return (
        <div className="font-sans">
            {/* Hero Section */}
            <div className="bg-gradient-to-r from-orange-50 to-white pl-12 pr-12">
                <div className="container mx-auto px-4 py-16 md:py-24">
                    <div className="flex flex-col md:flex-row items-center justify-between">
                        <div className="md:w-1/2 mb-10 md:mb-0">
                            <div className="text-sm uppercase tracking-wider text-gray-500 mb-2">--- FRESH & DELICIOUS</div>
                            <h1 className="text-4xl md:text-5xl font-bold leading-tight mb-4">
                                Delicious Meals<br />
                                <span className="text-orange-600">Delivered</span> to Your Door
                            </h1>
                            <p className="text-gray-600 mb-8 max-w-lg">
                                Enjoy fresh, flavorful meals made with the finest ingredients,
                                delivered straight to your doorstep, every time.
                            </p>
                            <div className="flex flex-wrap gap-4">
                                <button className="bg-orange-500 hover:bg-orange-600 text-white px-6 py-3 rounded-full transition duration-300 font-medium">
                                    Get Started
                                </button>
                                <button className="border border-gray-300 hover:border-orange-500 hover:text-orange-500 text-gray-700 px-6 py-3 rounded-full transition duration-300 font-medium">
                                    Learn More
                                </button>
                            </div>
                            
                            <div className="flex items-center gap-4 mt-10">
                                <div className="flex -space-x-2">
                                    {[1, 2, 3].map(i => (
                                        <div key={i} className="w-8 h-8 rounded-full bg-gray-200 border-2 border-white flex items-center justify-center overflow-hidden">
                                            <span className="text-xs font-bold text-gray-500">🙂</span>
                                        </div>
                                    ))}
                                </div>
                                <div>
                                    <p className="font-medium">Our Happy Customers</p>
                                    <div className="flex items-center text-yellow-500">
                                        {"★★★★★"}
                                        <span className="text-gray-600 text-sm ml-1">4.9</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                        
                        <div className="md:w-1/2 relative">
                            <div className="bg-orange-100 w-72 h-72 rounded-full absolute -z-10 top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2"></div>
                            <img 
                                src={deliveryGuy}
                                alt="Food Delivery" 
                                className="relative z-10 max-w-full mx-auto"
                            />
                            <div className="absolute top-0 right-0 bg-white rounded-full shadow-lg p-2">
                                <div className="bg-orange-500 text-white rounded-full p-2">
                                    <ShoppingBag size={20} />
                                </div>
                                <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs w-5 h-5 flex items-center justify-center rounded-full">1</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            
            {/* Restaurants Section */}
            <div className="container mx-auto px-4 py-16  pl-12 pr-12">
                <div className="flex justify-between items-center mb-10">
                    <h2 className="text-3xl font-bold">Discover <span className="text-orange-500">restaurants</span> around you</h2>
                    <button 
                        onClick={handleClick} 
                        className="flex items-center gap-2 bg-orange-500 hover:bg-orange-600 text-white px-4 py-2 rounded-full transition">
                        View All
                        <span className="bg-white text-orange-500 rounded-full w-6 h-6 flex items-center justify-center">→</span>
                    </button>
                </div>
                <p className="text-gray-600 mb-8">Try popular items, crafted with fresh, flavorful fixings, in a variety of restaurants</p>
                
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    {restaurants.map(restaurant => (
                        <div
                            key={restaurant._id}
                            onClick={() => navigate(`/restaurants/${restaurant._id}/menuItems`)}
                            className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300 cursor-pointer"
                        >
                            <div className="relative h-48 overflow-hidden">
                                {restaurant.imageUrl ? (
                                    <img
                                        src={restaurant.imageUrl}
                                        alt={restaurant.name}
                                        className="w-full h-full object-cover transition-transform duration-300 hover:scale-105"
                                        loading="lazy"
                                    />
                                ) : (
                                    <div className="w-full h-full bg-gray-200 flex items-center justify-center">
                                        <span className="text-gray-500">No Image</span>
                                    </div>
                                )}
                            </div>
                            <div className="p-4">
                                <h3 className="text-lg font-semibold mb-1">{restaurant.name}</h3>
                                <p className="text-gray-600 text-sm mb-2">{restaurant.cuisineType}</p>
                                <p className="text-sm text-gray-500">
                                    {restaurant.address?.district || 'N/A'}
                                </p>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
            
            {/* Quality Section */}
            <div className="container mx-auto px-4 py-16  pl-12 pr-12">
                <div className="flex flex-col md:flex-row items-center gap-10">
                    <div className="md:w-1/2">
                        <img 
                            src={meal}
                            alt="Quality Food" 
                            className="rounded-2xl shadow-xl"
                        />
                    </div>
                    
                    <div className="md:w-1/2">
                    <div className="text-sm uppercase tracking-wider text-gray-500 mb-2">--- ABOUT US</div>
                        <h2 className="text-3xl font-bold mb-6">
                            Inspired by Taste,<br />
                            Built on <span className="text-orange-500">Quality</span>
                        </h2>
                        <p className="text-gray-600 mb-8">
                            Passionate about quality, we deliver delicious meals with fresh ingredients and care.
                        </p>
                        
                        <div className="space-y-6">
                            <div className="flex items-start gap-4">
                                <div className="bg-orange-100 p-2 rounded-full mt-1">
                                    <Clock className="text-orange-500" size={20} />
                                </div>
                                <div>
                                    <h3 className="font-medium mb-1">Fresh Food, Fast Delivery</h3>
                                    <p className="text-gray-600 text-sm">We deliver your order in 30 minutes or less</p>
                                </div>
                            </div>
                            
                            <div className="flex items-start gap-4">
                                <div className="bg-orange-100 p-2 rounded-full mt-1">
                                    <Heart className="text-orange-500" size={20} />
                                </div>
                                <div>
                                    <h3 className="font-medium mb-1">Delivered with Love and Care</h3>
                                    <p className="text-gray-600 text-sm">24x7 customer support for your needs</p>
                                </div>
                            </div>
                            
                            <div className="flex items-start gap-4">
                                <div className="bg-orange-100 p-2 rounded-full mt-1">
                                    <Check className="text-orange-500" size={20} />
                                </div>
                                <div>
                                    <h3 className="font-medium mb-1">100% Quality Guaranteed</h3>
                                    <p className="text-gray-600 text-sm">We ensure quality for all food items</p>
                                </div>
                            </div>
                        </div>
                        
                        <button className="mt-8 text-orange-500 font-medium hover:text-orange-600 transition flex items-center gap-1">
                            LEARN MORE
                            <span>→</span>
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Home;