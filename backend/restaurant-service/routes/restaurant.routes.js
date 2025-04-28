const express = require('express');
const router = express.Router();
const restaurantController = require('../controllers/restaurant.controller');
const verifyToken = require('../middleware/auth');
const upload = require('../middleware/multerMiddleware')

router.post('/', verifyToken,upload.single('image'), restaurantController.createRestaurant);
router.get('/', restaurantController.getAllRestaurants);
router.get('/my', verifyToken, restaurantController.getMyRestaurants);
router.get('/:id', restaurantController.getRestaurantById);
router.put('/:id', verifyToken, upload.single('image'), restaurantController.updateRestaurant);
router.delete('/:id', verifyToken, restaurantController.deleteRestaurant);
module.exports = router;
