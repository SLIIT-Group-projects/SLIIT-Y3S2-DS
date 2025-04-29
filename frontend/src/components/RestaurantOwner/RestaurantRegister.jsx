import React, { useState } from 'react';
import axios from 'axios';
import deleteButton from '../../assets/deleteButton.png';

function RestaurantRegister() {
    const [formData, setFormData] = useState({
        name: '',
        description: '',
        address: {
            buildingNumber: '',
            street: '',
            city: '',
            district: '',
            postalCode: '',
            latitude: '',
            longitude: ''
        },
        contact: {
            phone: '',
            email: ''
        },
        openingHours: [],
        isAvailable: true,
        ownerId: '',
        cuisineType: '',
        imageUrl: '',
        currentLocation: {
            lat: '',
            lng: ''
        }
    });

    const handleChange = (e) => {
        const { name, value } = e.target;

        if (name.includes('address.')) {
            const field = name.split('.')[1];
            setFormData(prev => ({
                ...prev,
                address: { ...prev.address, [field]: value }
            }));
        } else if (name.includes('contact.')) {
            const field = name.split('.')[1];
            setFormData(prev => ({
                ...prev,
                contact: { ...prev.contact, [field]: value }
            }));
        } else if (name.includes('currentLocation.')) {
            const field = name.split('.')[1];
            setFormData(prev => ({
                ...prev,
                currentLocation: { ...prev.currentLocation, [field]: value }
            }));
        } else {
            setFormData(prev => ({ ...prev, [name]: value }));
        }
    };

    const handleOpeningHoursChange = (index, field, value) => {
        const newOpeningHours = [...formData.openingHours];
        newOpeningHours[index] = {
            ...newOpeningHours[index],
            [field]: value
        };
        setFormData(prev => ({ ...prev, openingHours: newOpeningHours }));
    };

    const removeOpeningHour = (index) => {
        const newOpeningHours = [...formData.openingHours];
        newOpeningHours.splice(index, 1);
        setFormData(prev => ({ ...prev, openingHours: newOpeningHours }));
    };


    const addOpeningHour = () => {
        setFormData(prev => ({
            ...prev,
            openingHours: [...prev.openingHours, { day: '', open: '', close: '' }]
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            // Convert lat/lng and latitude/longitude to numbers before sending
            const dataToSend = {
                ...formData,
                address: {
                    ...formData.address,
                    latitude: parseFloat(formData.address.latitude),
                    longitude: parseFloat(formData.address.longitude)
                },
                currentLocation: {
                    lat: parseFloat(formData.currentLocation.lat),
                    lng: parseFloat(formData.currentLocation.lng)
                }
            };

            await axios.post('http://localhost:5004/api/restaurants', dataToSend);
            alert("Restaurant added successfully");

            //regirect to login
            window.location.href = '/login';
        } catch (err) {
            console.error(err);
            alert("Error adding restaurant");
        }
    };

    return (
        <div className="bg-gray-50 min-h-screen py-8 px-4 sm:px-6 lg:px-8 font-inter">
            <div className="max-w-4xl mx-auto">
                <div className="bg-white p-6 sm:p-8 rounded-lg shadow-md">
                    <div className="border-b border-gray-200 pb-6 mb-6">
                        <h2 className="text-2xl font-semibold text-gray-800">Restaurant Registration</h2>
                        <p className="mt-1 text-sm text-gray-500">Fill in the details to register your restaurant</p>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-6">
                        {/* Basic Information */}
                        <div className="space-y-4">
                            <h3 className="text-lg font-medium text-gray-800">Basic Information</h3>
                            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                                <div>
                                    <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
                                        Restaurant Name
                                    </label>
                                    <input
                                        name="name"
                                        placeholder="Restaurant Name"
                                        onChange={handleChange}
                                        className="w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                                    />
                                </div>
                                <div>
                                    <label htmlFor="cuisineType" className="block text-sm font-medium text-gray-700 mb-1">
                                        Cuisine Type
                                    </label>
                                    <input
                                        name="cuisineType"
                                        placeholder="Cuisine Type"
                                        onChange={handleChange}
                                        className="w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                                    />
                                </div>
                            </div>
                            <div>
                                <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">
                                    Description
                                </label>
                                <textarea
                                    name="description"
                                    placeholder="Description"
                                    onChange={handleChange}
                                    rows={3}
                                    className="w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                                />
                            </div>
                            <div>
                                <label htmlFor="imageUrl" className="block text-sm font-medium text-gray-700 mb-1">
                                    Logo URL
                                </label>
                                <input
                                    name="imageUrl"
                                    placeholder="Image URL"
                                    onChange={handleChange}
                                    className="w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                                />
                            </div>
                        </div>

                        {/* Address */}
                        <div className="space-y-4">
                            <h3 className="text-lg font-medium text-gray-800">Address</h3>
                            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                                <div>
                                    <label htmlFor="address.buildingNumber" className="block text-sm font-medium text-gray-700 mb-1">
                                        Building Number
                                    </label>
                                    <input
                                        name="address.buildingNumber"
                                        placeholder="Building Number"
                                        onChange={handleChange}
                                        className="w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                                    />
                                </div>
                                <div>
                                    <label htmlFor="address.street" className="block text-sm font-medium text-gray-700 mb-1">
                                        Street
                                    </label>
                                    <input
                                        name="address.street"
                                        placeholder="Street"
                                        onChange={handleChange}
                                        className="w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                                    />
                                </div>
                            </div>
                            <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
                                <div>
                                    <label htmlFor="address.city" className="block text-sm font-medium text-gray-700 mb-1">
                                        City
                                    </label>
                                    <input
                                        name="address.city"
                                        placeholder="City"
                                        onChange={handleChange}
                                        className="w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                                    />
                                </div>
                                <div>
                                    <label htmlFor="address.district" className="block text-sm font-medium text-gray-700 mb-1">
                                        District
                                    </label>
                                    <input
                                        name="address.district"
                                        placeholder="District"
                                        onChange={handleChange}
                                        className="w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                                    />
                                </div>
                                <div>
                                    <label htmlFor="address.postalCode" className="block text-sm font-medium text-gray-700 mb-1">
                                        Postal Code
                                    </label>
                                    <input
                                        name="address.postalCode"
                                        placeholder="Postal Code"
                                        onChange={handleChange}
                                        className="w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                                    />
                                </div>
                            </div>
                            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                                <div>
                                    <label htmlFor="address.latitude" className="block text-sm font-medium text-gray-700 mb-1">
                                        Latitude
                                    </label>
                                    <input
                                        name="address.latitude"
                                        placeholder="Latitude"
                                        onChange={handleChange}
                                        className="w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                                    />
                                </div>
                                <div>
                                    <label htmlFor="address.longitude" className="block text-sm font-medium text-gray-700 mb-1">
                                        Longitude
                                    </label>
                                    <input
                                        name="address.longitude"
                                        placeholder="Longitude"
                                        onChange={handleChange}
                                        className="w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                                    />
                                </div>
                            </div>
                        </div>

                        {/* Contact Information */}
                        <div className="space-y-4">
                            <h3 className="text-lg font-medium text-gray-800">Contact Information</h3>
                            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                                <div>
                                    <label htmlFor="contact.phone" className="block text-sm font-medium text-gray-700 mb-1">
                                        Phone
                                    </label>
                                    <input
                                        name="contact.phone"
                                        placeholder="Phone"
                                        onChange={handleChange}
                                        className="w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                                    />
                                </div>
                                <div>
                                    <label htmlFor="contact.email" className="block text-sm font-medium text-gray-700 mb-1">
                                        Email
                                    </label>
                                    <input
                                        name="contact.email"
                                        placeholder="Email"
                                        onChange={handleChange}
                                        className="w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                                    />
                                </div>
                            </div>
                            <div>
                                <label htmlFor="ownerId" className="block text-sm font-medium text-gray-700 mb-1">
                                    Owner ID
                                </label>
                                <input
                                    name="ownerId"
                                    placeholder="Owner ID"
                                    onChange={handleChange}
                                    className="w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                                />
                            </div>
                        </div>

                        {/* Opening Hours */}
                        <div className="space-y-4">
                            <div className="flex justify-between items-center">
                                <h3 className="text-lg font-medium text-gray-800">Opening Hours</h3>
                                <button
                                    type="button"
                                    onClick={addOpeningHour}
                                    className="inline-flex items-center px-3 py-1.5 border border-transparent text-xs font-medium rounded shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                                >
                                    + Add Opening Hour
                                </button>
                            </div>

                            {formData.openingHours.map((entry, index) => (
                                <div key={index} className="relative bg-gray-50 p-4 rounded-md">
                                    <button
                                        type="button"
                                        onClick={() => removeOpeningHour(index)}
                                        className="absolute top-2 right-2 text-gray-400 hover:text-gray-600 focus:outline-none"
                                        aria-label="Remove opening hour"
                                    >
                                        <img
                                            src={deleteButton}
                                            alt="Delete"
                                            className="w-5 h-5"
                                        />
                                    </button>

                                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-1">Day</label>
                                            <select
                                                value={entry.day}
                                                onChange={(e) => handleOpeningHoursChange(index, 'day', e.target.value)}
                                                className="w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                                            >
                                                <option value="">Select Day</option>
                                                {['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday', 'Weekdays', 'Weekends'].map(day => (
                                                    <option key={day} value={day}>{day}</option>
                                                ))}
                                            </select>
                                        </div>

                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-1">Open Time</label>
                                            <input
                                                type="time"
                                                value={entry.open}
                                                onChange={(e) => handleOpeningHoursChange(index, 'open', e.target.value)}
                                                className="w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                                            />
                                        </div>

                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-1">Close Time</label>
                                            <input
                                                type="time"
                                                value={entry.close}
                                                onChange={(e) => handleOpeningHoursChange(index, 'close', e.target.value)}
                                                className="w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                                            />
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>


                        {/* Current Location */}
                        <div className="space-y-4">
                            <h3 className="text-lg font-medium text-gray-800">Current Location</h3>
                            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                                <div>
                                    <label htmlFor="currentLocation.lat" className="block text-sm font-medium text-gray-700 mb-1">
                                        Latitude
                                    </label>
                                    <input
                                        name="currentLocation.lat"
                                        placeholder="Latitude"
                                        onChange={handleChange}
                                        className="w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                                    />
                                </div>
                                <div>
                                    <label htmlFor="currentLocation.lng" className="block text-sm font-medium text-gray-700 mb-1">
                                        Longitude
                                    </label>
                                    <input
                                        name="currentLocation.lng"
                                        placeholder="Longitude"
                                        onChange={handleChange}
                                        className="w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                                    />
                                </div>
                            </div>
                        </div>

                        {/* Submit Button */}
                        <div className="pt-4">
                            <button
                                type="submit"
                                className="w-full flex justify-center py-3 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                            >
                                Register Restaurant
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
}

export default RestaurantRegister;