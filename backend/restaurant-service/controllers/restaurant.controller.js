const Restaurant = require('../models/Restaurant')
const { sendRestaurantRegistrationEmail } = require('../services/emailService')
// Create a restaurant
/*exports.createRestaurant = async (req, res) => {
    try {
        const restaurant = new Restaurant(req.body);
        const saved = await restaurant.save();
        res.status(201).json(saved);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};*/

exports.createRestaurant = async (req, res) => {
    try {
        // 1. Input Validation
        const requiredFields = [
            'name',
            'description',
            'cuisineType',
            'contact.email',
            'contact.phone',
            'address.street',
            'address.city',
            'address.postalCode'
        ];

        const missingFields = requiredFields.filter(field => {
            const parts = field.split('.');
            let value = req.body;
            for (const part of parts) {
                value = value[part];
                if (value === undefined) break;
            }
            return !value;
        });

        if (missingFields.length > 0) {
            return res.status(400).json({
                error: 'Missing required fields',
                missingFields: missingFields.map(f => f.replace('.', ' '))
            });
        }

        // 2. Check if restaurant with same email already exists
        const existingRestaurant = await Restaurant.findOne({ 
            'contact.email': req.body.contact.email 
        });

        if (existingRestaurant) {
            return res.status(409).json({
                error: 'Restaurant with this email already exists'
            });
        }

        // 3. Create and save restaurant
        const restaurant = new Restaurant({
            ...req.body,
            status: 'pending', // Add status field
            registrationDate: new Date(),
            owner: req.user._id // Assuming you have user info in req.user
        });

        const savedRestaurant = await restaurant.save();

        // 4. Send confirmation email to restaurant owner (async - don't await)
        try {
            await sendRestaurantRegistrationEmail(
                req.body.contact.email,
                req.body.name
            );
        } catch (emailError) {
            console.error('Email sending failed:', emailError);
            // Continue even if email fails
        }

        // 5. Return success response
        res.status(201).json({
            message: 'Restaurant registration submitted successfully',
            restaurant: savedRestaurant,
            _id: savedRestaurant._id
        });

    } catch (error) {
        console.error('Restaurant creation error:', error);
        
        // Handle specific errors
        if (error.name === 'ValidationError') {
            const errors = Object.values(error.errors).map(err => err.message);
            return res.status(400).json({ 
                error: 'Validation failed',
                details: errors 
            });
        }

        res.status(500).json({ 
            error: 'Internal server error',
            message: error.message 
        });
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
