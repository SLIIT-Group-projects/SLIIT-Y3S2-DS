// controllers/cartController.js
const CartItem = require("../models/CartItem");
const MenuItem = require("../models/MenuItem");
const Restaurant = require("../models/Restaurant");

exports.addToCart = async (req, res) => {
  const { menuItemId, quantity } = req.body;
  const userId = req.user.id;

  if (!menuItemId || !quantity || quantity < 1) {
    return res.status(400).json({ message: "Invalid cart input" });
  }

  try {
    const menuItem = await MenuItem.findById(menuItemId);
    if (!menuItem) {
      return res.status(404).json({ message: "Menu item not found" });
    }

    const unitPrice = menuItem.price;
    const totalPrice = unitPrice * quantity;

    const cartItem = new CartItem({
      userId,
      restaurantId: menuItem.restaurantId,
      menuItemId,
      quantity,
      name: menuItem.name,
      price: unitPrice,
      totalPrice,
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

// update cart items
exports.updateCartItemQuantity = async (req, res) => {
  const { cartItemId } = req.params;
  const { quantity } = req.body;

  if (!cartItemId || !quantity || quantity < 1) {
    return res.status(400).json({ message: "Invalid input" });
  }

  try {
    const cartItem = await CartItem.findById(cartItemId);
    if (!cartItem) {
      return res.status(404).json({ message: "Cart item not found" });
    }

    cartItem.quantity = quantity;
    cartItem.totalPrice = cartItem.price * quantity;

    await cartItem.save();

    res.status(200).json({ message: "Cart item updated", cartItem });
  } catch (err) {
    console.error("Update cart item error:", err);
    res.status(500).json({ message: "Server error" });
  }
};

// get all itenm(current user)
exports.getUserCart = async (req, res) => {
  try {
    const cartItems = await CartItem.find({ userId: req.user.id }).populate("menuItemId");
    res.json(cartItems);
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
};
// remove items
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

// clear all items from cart
exports.clearCart = async (req, res) => {
  try {
    await CartItem.deleteMany({ userId: req.user.id });
    res.json({ message: "Cart cleared" });
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
};

// get resutarants ID's and details of the resturant
exports.getUserCartRestaurantDetails = async (req, res) => {
  const userId = req.user.id;

  try {
    // Step 1: Get unique restaurant IDs from the user's cart
    const restaurantIds = await CartItem.distinct("restaurantId", {
      userId,
    });

    // Safety check: filter out null/undefined values
    const validRestaurantIds = restaurantIds.filter(id => id);

    // Step 2: Fetch restaurant details for those IDs
    const restaurants = await Restaurant.find({
      _id: { $in: validRestaurantIds },
    }).select("name description imageUrl cuisineType address contact isAvailable isVerified");

    res.status(200).json({ restaurants });
  } catch (error) {
    console.error("Error getting user's cart restaurant details:", error);
    res.status(500).json({ message: "Server error" });
  }
};


  // Get restuarant items
  exports.getCartItemsByRestaurant = async (req, res) => {
    const userId = req.user.id;
    const { restaurantId } = req.params;
  
    if (!restaurantId) {
      return res.status(400).json({ message: "Restaurant ID is required" });
    }
  
    try {
      const items = await CartItem.find({
        userId,
        restaurantId,
      }).populate("menuItemId"); // if you want full menu item details
  
      res.status(200).json({ items });
    } catch (error) {
      console.error("Error fetching cart items:", error);
      res.status(500).json({ message: "Server error" });
    }
  };
