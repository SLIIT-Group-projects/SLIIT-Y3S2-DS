const CartItem = require("../models/CartItem");
const Order = require("../models/Order");

exports.placeOrder = async (req, res) => {
    const userId = req.user.id;
    const {
      restaurantId,
      paymentMethod,
      addressNo,
      addressStreet,
      longitude,
      latitude,
      deliveryCharge
    } = req.body;
  
    if (
      !restaurantId || !paymentMethod ||
      !addressNo || !addressStreet ||
      typeof longitude !== "number" || typeof latitude !== "number" ||
      typeof deliveryCharge !== "number"
    ) {
      return res.status(400).json({ message: "Missing or invalid order details" });
    }
  
    try {
      const cartItems = await CartItem.find({ userId, restaurantId }).populate("menuItemId");
  
      if (!cartItems.length) {
        return res.status(400).json({ message: "No items in cart for this restaurant" });
      }
  
      const subtotal = cartItems.reduce((sum, item) => sum + item.totalPrice, 0);
      const totalAmount = subtotal + deliveryCharge;
  
      const items = cartItems.map((item) => ({
        menuItem: item.menuItemId._id,
        name: item.name,
        quantity: item.quantity,
        price: item.price,
        totalPrice: item.totalPrice,
      }));
  
      const order = new Order({
        userId,
        restaurantId,
        items,
        subtotal,
        deliveryCharge,
        totalAmount,
        paymentMethod,
        address: {
          no: addressNo,
          street: addressStreet,
        },
        location: {
          longitude,
          latitude,
        },
        status: "Pending",
      });
  
      await order.save();
      await CartItem.deleteMany({ userId, restaurantId });
  
      res.status(201).json({ message: "Order placed successfully", order });
    } catch (error) {
      console.error("Place order error:", error);
      res.status(500).json({ message: "Server error" });
    }
  };
  