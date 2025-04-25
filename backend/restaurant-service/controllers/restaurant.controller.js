const Restaurant = require('../models/Restaurant')

// Create a restaurant
exports.createRestaurant = async (req, res) => {
    try {
        const restaurant = new Restaurant(req.body);
        const saved = await restaurant.save();
        res.status(201).json(saved);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

// Get all restaurants
exports.getAllRestaurants = async (req, res) => {
    try {
        const restaurants = await Restaurant.find();
        res.status(200).json(restaurants);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Get restaurant by ID
exports.getRestaurantById = async (req, res) => {
    try {
        const restaurant = await Restaurant.findById(req.params.id);
        if (!restaurant) return res.status(404).json({ message: "Not found" });
        res.status(200).json(restaurant);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Update restaurant
exports.updateRestaurant = async (req, res) => {
    try {
        const updated = await Restaurant.findByIdAndUpdate(req.params.id, req.body, { new: true });
        res.status(200).json(updated);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

// Delete restaurant
exports.deleteRestaurant = async (req, res) => {
    try {
        await Restaurant.findByIdAndDelete(req.params.id);
        res.status(200).json({ message: "Deleted successfully" });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};
