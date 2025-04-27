const Restaurant = require('../models/Restaurant');

// Create a restaurant (only for restaurant role users)
exports.createRestaurant = async (req, res) => {
    try {
        // No DB call to User model
        const { id, role } = req.user;

        if (role !== 'restaurant') {
            return res.status(403).json({ message: "Only restaurant users can create restaurants" });
        }

        // Add the ownerId from the decoded token
        const restaurantData = {
            ...req.body,
            ownerId: id
        };

        const restaurant = new Restaurant(restaurantData);
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

// Get restaurants by owner (my restaurants)
exports.getMyRestaurants = async (req, res) => {
    try {
        const { id } = req.user;  // Take user ID from token
        const restaurants = await Restaurant.find({ ownerId: id });
        res.status(200).json(restaurants);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Update restaurant
exports.updateRestaurant = async (req, res) => {
    try {
        const { id } = req.user; // token user id
        const restaurant = await Restaurant.findById(req.params.id);
        
        if (!restaurant) {
            return res.status(404).json({ message: "Restaurant not found" });
        }
        
        if (restaurant.ownerId.toString() !== id) {
            return res.status(403).json({ message: "Not authorized to update this restaurant" });
        }

        const updated = await Restaurant.findByIdAndUpdate(req.params.id, req.body, { new: true });
        res.status(200).json(updated);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

// Delete restaurant
exports.deleteRestaurant = async (req, res) => {
    try {
        const { id } = req.user; // token user id
        const restaurant = await Restaurant.findById(req.params.id);
        
        if (!restaurant) {
            return res.status(404).json({ message: "Restaurant not found" });
        }
        
        if (restaurant.ownerId.toString() !== id) {
            return res.status(403).json({ message: "Not authorized to delete this restaurant" });
        }

        await Restaurant.findByIdAndDelete(req.params.id);
        res.status(200).json({ message: "Deleted successfully" });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};
