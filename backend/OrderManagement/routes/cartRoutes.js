// routes/cartRoutes.js
const express = require("express");
const router = express.Router();
const cartController = require("../controllers/cartController");
const verifyToken = require("../middleware/auth");

router.post("/add", verifyToken, cartController.addToCart);
router.get("/", verifyToken, cartController.getUserCart);
router.delete("/:id", verifyToken, cartController.removeCartItem);
router.delete("/", verifyToken, cartController.clearCart);
// get resturants
router.get("/restaurants", verifyToken, cartController.getRestaurantIds);

module.exports = router;
