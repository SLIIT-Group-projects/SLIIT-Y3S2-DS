const express = require('express');
const router = express.Router();
const menuItemController = require('../controllers/menu.controller');
const verifyToken = require("../middleware/auth");

// POST: Add menu item
router.post('/', menuItemController.addMenuItem);

// GET: All menu items
router.get('/', menuItemController.getAllMenuItems);
// get menuitems id(daham)
router.get('/:menuItemId', menuItemController.getMenuItemById);

// GET: Menu items by restaurant ID
router.get('/restaurant/:restaurantId', menuItemController.getMenuItemsByRestaurant);

// DELETE: Menu item by ID
router.delete('/:id', menuItemController.deleteMenuItem);

// PUT: Update menu item by ID
router.put('/:id', menuItemController.updateMenuItem);

module.exports = router;
