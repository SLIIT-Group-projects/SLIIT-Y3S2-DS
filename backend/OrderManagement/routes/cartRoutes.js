// routes/cartRoutes.js
const express = require("express");
const router = express.Router();
const cartController = require("../controllers/cartController");
const orderController = require("../controllers/orderController");
const verifyToken = require("../middleware/auth");

router.post("/add", verifyToken, cartController.addToCart);

// update cart item
router.put("/update/:cartItemId", verifyToken, cartController.updateCartItemQuantity);
router.get("/", verifyToken, cartController.getUserCart);
router.delete("/:id", verifyToken, cartController.removeCartItem);
router.delete("/", verifyToken, cartController.getUserCart);

// get resturants
router.get("/restaurants", verifyToken, cartController.getUserCartRestaurantDetails);

// get items according to the resturant
router.get(
  "/:restaurantId",
  verifyToken,
  cartController.getCartItemsByRestaurant
);

module.exports = router;
