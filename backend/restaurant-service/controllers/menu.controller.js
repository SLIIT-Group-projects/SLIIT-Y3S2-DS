const MenuItem = require('../models/MenuItem');
const Restaurant = require('../models/Restaurant');
const cloudinary = require('../utils/cloudinary')
// Add a new menu item (only for restaurant owners)
exports.addMenuItem = async (req, res) => {
    try {
        const { restaurantId } = req.body;

        // Verify the restaurant exists and the user owns it
        const restaurant = await Restaurant.findById(restaurantId);
        if (!restaurant) {
            return res.status(404).json({ message: 'Restaurant not found' });
        }

        if (restaurant.ownerId.toString() !== req.user.id) {
            return res.status(403).json({ message: 'You can only add items to your own restaurant' });
        }

        let imageUrl = null;

        if (req.file) { // single image upload
            const base64Str = `data:${req.file.mimetype};base64,${req.file.buffer.toString("base64")}`;
            const uploadResult = await cloudinary.uploader.upload(base64Str, {
                folder: "menus",
            });
            imageUrl = uploadResult.secure_url;
        }

        const newItem = new MenuItem({
            ...req.body,
            imageUrl, // set the uploaded image URL
        });

        const savedItem = await newItem.save();
        res.status(201).json(savedItem);
    } catch (error) {
        res.status(500).json({ message: 'Error adding menu item', error });
    }
};

// Get all menu items (public)
exports.getAllMenuItems = async (req, res) => {
    try {
        const items = await MenuItem.find().populate('restaurantId');
        res.status(200).json(items);
    } catch (error) {
        res.status(500).json({ message: 'Error retrieving items', error });
    }
};

// Get menu items by restaurant ID
exports.getMenuItemsByRestaurant = async (req, res) => {
    try {
        const { restaurantId } = req.params;

        // For restaurant users, verify they own the restaurant
        if (req.user.role === 'restaurant') {
            const restaurant = await Restaurant.findById(restaurantId);
            if (!restaurant) {
                return res.status(404).json({ message: 'Restaurant not found' });
            }

            if (restaurant.ownerId.toString() !== req.user.id) {
                return res.status(403).json({ message: 'You can only view your own restaurant menu' });
            }
        }

        const items = await MenuItem.find({ restaurantId });
        res.status(200).json(items);
    } catch (error) {
        res.status(500).json({ message: 'Error retrieving restaurant items', error });
    }
};

exports.getMenuItemsToHome = async (req, res) => {
    try {
        const { restaurantId } = req.params;
        console.log(`Fetching menu for restaurant: ${restaurantId}`);

        // Validate restaurantId format
        if (!mongoose.Types.ObjectId.isValid(restaurantId)) {
            return res.status(400).json({ message: 'Invalid restaurant ID format' });
        }

        // Check restaurant exists
        const restaurantExists = await Restaurant.exists({ _id: restaurantId });
        if (!restaurantExists) {
            return res.status(404).json({ message: 'Restaurant not found' });
        }

        // Get menu items with proper ObjectId conversion
        const items = await MenuItem.find({ 
            restaurantId: mongoose.Types.ObjectId(restaurantId),
            isAvailable: true // Changed from isActive to match your schema
        }).lean();

        console.log(`Found ${items.length} menu items for restaurant ${restaurantId}`);
        
        return res.status(200).json(items);
    } catch (error) {
        console.error('Error in getMenuItemsToHome:', error);
        return res.status(500).json({ 
            message: 'Error retrieving menu items',
            error: error.message 
        });
    }
};

// Get a single menu item by ID
exports.getMenuItemById = async (req, res) => {
    try {
        const { menuItemId } = req.params;

        const menuItem = await MenuItem.findById(menuItemId).populate('restaurantId');
        if (!menuItem) {
            return res.status(404).json({ message: 'Menu item not found' });
        }

        res.status(200).json(menuItem);
    } catch (error) {
        res.status(500).json({ message: 'Error retrieving menu item', error });
    }
};


// Get my restaurant's menu items (for restaurant owners)
exports.getMyMenuItems = async (req, res) => {
    try {
        // Find all restaurants owned by this user
        const restaurants = await Restaurant.find({ ownerId: req.user.id });

        if (restaurants.length === 0) {
            return res.status(404).json({ message: 'No restaurants found for this user' });
        }

        // Get menu items for all of the user's restaurants
        const restaurantIds = restaurants.map(r => r._id);
        const items = await MenuItem.find({ restaurantId: { $in: restaurantIds } });

        res.status(200).json(items);
    } catch (error) {
        res.status(500).json({ message: 'Error retrieving menu items', error });
    }
};

// Update a menu item
// Update a menu item
exports.updateMenuItem = async (req, res) => {
    try {
        const { id } = req.params;

        // First get the menu item to check ownership
        const menuItem = await MenuItem.findById(id);
        if (!menuItem) {
            return res.status(404).json({ message: 'Menu item not found' });
        }

        // Check if user owns the restaurant this item belongs to
        const restaurant = await Restaurant.findById(menuItem.restaurantId);
        if (restaurant.ownerId.toString() !== req.user.id) {
            return res.status(403).json({ message: 'You can only update items from your own restaurant' });
        }

        let updateData = { ...req.body };

        // Handle image upload if file exists
        if (req.file) {
            const base64Str = `data:${req.file.mimetype};base64,${req.file.buffer.toString("base64")}`;
            const uploadResult = await cloudinary.uploader.upload(base64Str, {
                folder: "menus",
            });
            updateData.imageUrl = uploadResult.secure_url;
        }

        const updatedItem = await MenuItem.findByIdAndUpdate(id, updateData, { new: true });
        res.status(200).json(updatedItem);
    } catch (error) {
        res.status(500).json({ message: 'Error updating item', error });
    }
};

// Delete a menu item by ID
exports.deleteMenuItem = async (req, res) => {
    try {
        const { id } = req.params;

        // First get the menu item to check ownership
        const menuItem = await MenuItem.findById(id);
        if (!menuItem) {
            return res.status(404).json({ message: 'Menu item not found' });
        }

        // Check if user owns the restaurant this item belongs to
        const restaurant = await Restaurant.findById(menuItem.restaurantId);
        if (restaurant.ownerId.toString() !== req.user.id) {
            return res.status(403).json({ message: 'You can only delete items from your own restaurant' });
        }

        await MenuItem.findByIdAndDelete(id);
        res.status(200).json({ message: 'Menu item deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Error deleting item', error });
    }
};