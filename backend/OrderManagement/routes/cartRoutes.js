// routes/cartRoutes.js
const express = require("express");
const router = express.Router();
const cartController = require("../controllers/cartController");
const verifyToken = require("../middleware/auth");

router.post("/cart/add", verifyToken, cartController.addToCart);
// update cart item
router.put("/cart/update/:cartItemId", verifyToken, cartController.updateCartItemQuantity);
router.get("/cart/", verifyToken, cartController.getUserCart);
router.delete("/cart/:id", verifyToken, cartController.removeCartItem);
router.delete("/cart/", verifyToken, cartController.clearCart);
// get resturants
router.get("/cart/restaurants", verifyToken, cartController.getUserCartRestaurantDetails);
// get items according to the resturant
router.get(
  "/cart/:restaurantId",
  verifyToken,
  cartController.getCartItemsByRestaurant
);

module.exports = router;
