const MenuItem = require('../models/MenuItem');

// Add a new menu item
exports.addMenuItem = async (req, res) => {
  try {
    const newItem = new MenuItem(req.body);
    const savedItem = await newItem.save();
    res.status(201).json(savedItem);
  } catch (error) {
    res.status(500).json({ message: 'Error adding menu item', error });
  }
};

// Get all menu items
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
    const items = await MenuItem.find({ restaurantId });
    res.status(200).json(items);
  } catch (error) {
    res.status(500).json({ message: 'Error retrieving restaurant items', error });
  }
};

// Delete a menu item by ID
exports.deleteMenuItem = async (req, res) => {
  try {
    const { id } = req.params;
    const deletedItem = await MenuItem.findByIdAndDelete(id);
    if (!deletedItem) {
      return res.status(404).json({ message: 'Menu item not found' });
    }
    res.status(200).json({ message: 'Menu item deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Error deleting item', error });
  }
};

// Update a menu item
exports.updateMenuItem = async (req, res) => {
  try {
    const { id } = req.params;
    const updatedItem = await MenuItem.findByIdAndUpdate(id, req.body, { new: true });
    if (!updatedItem) {
      return res.status(404).json({ message: 'Menu item not found' });
    }
    res.status(200).json(updatedItem);
  } catch (error) {
    res.status(500).json({ message: 'Error updating item', error });
  }
};
