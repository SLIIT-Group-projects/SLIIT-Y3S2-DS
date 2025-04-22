// controllers/cartController.js
const CartItem = require("../models/CartItem");
const MenuItem = require("../models/MenuItem");

exports.addToCart = async (req, res) => {
  const { menuItemId, quantity } = req.body;
  const userId = req.user.id;

  if (!menuItemId || !quantity || quantity < 1) {
    return res.status(400).json({ message: "Invalid cart input" });
  }

  try {
    const menuItem = await MenuItem.findById(menuItemId);
    if (!menuItem) return res.status(404).json({ message: "Menu item not found" });

    const cartItem = new CartItem({
      userId,
      restaurantId: menuItem.restaurantId,
      menuItemId,
      quantity,
      name: menuItem.name,
      price: menuItem.price,
      imageUrl: menuItem.imageUrl,
      preparationTime: menuItem.preparationTime,
    });

    await cartItem.save();
    res.status(201).json({ message: "Item added to cart", cartItem });
  } catch (err) {
    console.error("Add to cart error:", err);
    res.status(500).json({ message: "Server error" });
  }
};

exports.getUserCart = async (req, res) => {
  try {
    const cartItems = await CartItem.find({ userId: req.user.id }).populate("menuItemId");
    res.json(cartItems);
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
};

exports.removeCartItem = async (req, res) => {
  try {
    const cartItem = await CartItem.findOneAndDelete({
      _id: req.params.id,
      userId: req.user.id,
    });
    if (!cartItem) return res.status(404).json({ message: "Cart item not found" });
    res.json({ message: "Item removed" });
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
};

exports.clearCart = async (req, res) => {
  try {
    await CartItem.deleteMany({ userId: req.user.id });
    res.json({ message: "Cart cleared" });
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
};

// get resutarants ID's
exports.getRestaurantIds = async (req, res) => {
    const userId = req.user.id;
  
    try {
      const restaurantIds = await CartItem.distinct("restaurantId", {
        userId: userId,
      });
  
      res.status(200).json({ restaurantIds });
    } catch (error) {
      console.error("Error getting restaurant IDs from cart:", error);
      res.status(500).json({ message: "Server error" });
    }
  };
