const express = require('express');
const router = express.Router();
const menuController = require('../controllers/menu.controller');
const verifyToken = require('../middleware/auth');

router.post('/', verifyToken, menuController.addMenuItem);
router.get('/', menuController.getAllMenuItems);
router.get('/restaurants/:restaurantId', verifyToken, menuController.getMenuItemsByRestaurant);
router.get('/:menuItemId', menuController.getMenuItemById);
router.get('/my', verifyToken, menuController.getMyMenuItems);
router.put('/:id', verifyToken, menuController.updateMenuItem);
router.delete('/:id', verifyToken, menuController.deleteMenuItem);

module.exports = router;
