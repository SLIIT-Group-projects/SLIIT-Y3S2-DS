// routes/orderRoutes.js

const express = require("express");
const router = express.Router();
const orderController = require("../controllers/orderController");
const verifyToken = require("../middleware/auth");

// Place a new order
router.post("/place", verifyToken, orderController.placeOrder);

// Get a specific order by ID
router.get("/:id", verifyToken, orderController.getOrderById);

// Get all orders
router.get("/", verifyToken, orderController.getAllOrders);

// Get orders by status (e.g., Pending, Confirmed, etc.)
router.get("/status/:status", verifyToken, orderController.getOrdersByStatus);

// Route for getting orders that are not delivered
router.get("/active/getActiveOrders", orderController.getActiveOrders);

// get dilvers orders
router.get("/active/getDeliveredOrders", orderController.getDeliveredOrders);

// get orders of restaurant
router.get(
  "/restaurant/:restaurantId",
  verifyToken,
  orderController.getOrdersByRestaurantId
);
// Update order status
router.put("/:id/status", verifyToken, orderController.updateOrderStatus);

// Delete an order
router.delete("/:id", verifyToken, orderController.deleteOrder);

// get orders with resturant details by status
router.get(
  "/stat/:status",
  verifyToken,
  orderController.getOrdersWithResturants
);

//get orders with restaurant details by rest id
router.get(
  "/stat/delivery/:id",
  verifyToken,
  orderController.getOrderByIdWithRestaurantDetails
);

module.exports = router;
