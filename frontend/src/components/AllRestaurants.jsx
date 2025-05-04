import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { MapPin, Clock, Star, ChefHat, Utensils } from 'lucide-react';
import NavBar from './NavBar';

const AllRestaurants = () => {
    const [restaurants, setRestaurants] = useState([]);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchRestaurants = async () => {
            try {
                const { data } = await axios.get('http://localhost:5004/api/restaurants');
                setRestaurants(data);
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

    return (
        <div className="bg-gray-50 min-h-screen py-12 bg-gradient-to-r from-orange-100 to-orange-50 pl-12 pr-12">
            <div className="pb-4">
                <NavBar/>
            </div>
            <div className="container mx-auto px-4 ">
                <div className="text-center mb-12">
                    <h1 className="text-4xl font-bold mb-4">Discover <span className="text-orange-500">Restaurants</span></h1>
                    <p className="text-gray-600 max-w-2xl mx-auto">
                        Explore our curated selection of the finest restaurants, each offering unique flavors and exceptional dining experiences.
                    </p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
                    {restaurants.map(restaurant => (
                        <div
                            key={restaurant._id}
                            onClick={() => navigate(`/restaurants/${restaurant._id}/menuItems`)}
                            className="bg-white rounded-xl shadow-md overflow-hidden cursor-pointer hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1"
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
                                        <ChefHat className="w-12 h-12 text-gray-400" />
                                    </div>
                                )}
                                <div className="absolute top-4 right-4 bg-white px-2 py-1 rounded-full text-sm font-medium text-orange-500 shadow-md">
                                    <div className="flex items-center gap-1">
                                        <Clock className="w-4 h-4" />
                                        {restaurant.isAvailable ? 'Open' : 'Closed'}
                                    </div>
                                </div>
                            </div>
                            <div className="p-6">
                                <h2 className="text-xl font-semibold mb-2 text-gray-800">{restaurant.name}</h2>
                               
                                <div className="flex items-center gap-4 text-gray-600">
                                <div className="flex items-center gap-1">
                                        <Utensils className="w-4 h-4 text-orange-500" />
                                        <span className="text-sm text-orange-500">{restaurant.cuisineType}</span>
                                    </div>
                                    
                                    <div className="flex items-center gap-1">
                                        <MapPin className="w-4 h-4" />
                                        <span className="text-sm">{restaurant.address?.district || 'N/A'}</span>
                                    </div>

                                    

                                </div>

                                <button className="mt-4 w-full bg-orange-50 text-orange-500 py-2 rounded-full font-medium hover:bg-orange-100 transition-colors">
                                    View Menu
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default AllRestaurants;