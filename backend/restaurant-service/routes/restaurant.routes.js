const express = require('express');
const router = express.Router();
const restaurantController = require('../controllers/restaurant.controller');
const verifyToken = require('../middleware/auth');

router.post('/', verifyToken, restaurantController.createRestaurant);
router.get('/', restaurantController.getAllRestaurants);
router.get('/my', verifyToken, restaurantController.getMyRestaurants);
router.get('/:id', restaurantController.getRestaurantById);
router.put('/:id', verifyToken, restaurantController.updateRestaurant);
router.delete('/:id', verifyToken, restaurantController.deleteRestaurant);
module.exports = router;
