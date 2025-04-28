const CartItem = require("../models/CartItem");
const Order = require("../models/Order");
// const axios = require("axios");

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
    // Get cart items for the user and restaurant
    const cartItems = await CartItem.find({ userId, restaurantId });

    if (!cartItems.length) {
      return res.status(400).json({ message: "No items in cart for this restaurant" });
    }

    // Fetch menu item details using axios
    const menuItemDetailsPromises = cartItems.map(async (item) => {
      try {
        const response = await axios.get(`http://localhost:5004/api/menu-items/${item.menuItemId}`);
        return response.data; // Menu item details
      } catch (error) {
        console.error(`Error fetching menu item details for ${item.menuItemId}:`, error.message);
        return null; // Return null if there's an error fetching the menu item
      }
    });

    const menuItems = await Promise.all(menuItemDetailsPromises);

    // Calculate subtotal and total amount
    const subtotal = cartItems.reduce((sum, item) => sum + item.totalPrice, 0);
    const totalAmount = subtotal + deliveryCharge;

    // Map cart items with fetched menu item details
    const items = cartItems.map((item, index) => {
      const menuItem = menuItems[index];
      return {
        menuItem: item.menuItemId,
        name: item.name,
        quantity: item.quantity,
        price: item.price,
        totalPrice: item.totalPrice,
        menuItemDetails: menuItem ? menuItem : null, // Append menu item details or null if not found
      };
    });

    // Create the new order
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
    await CartItem.deleteMany({ userId, restaurantId }); // Clear the cart after order is placed

    res.status(201).json({ message: "Order placed successfully", order });
  } catch (error) {
    console.error("Place order error:", error);
    res.status(500).json({ message: "Server error" });
  }
};
  
  //Get a order By ID
  exports.getOrderById = async (req, res) => {
    const { id } = req.params;
  
    try {
      const order = await Order.findById(id);
  
      if (!order) {
        return res.status(404).json({ message: "Order not found" });
      }
  
      const orderItemsWithDetails = await Promise.all(
        order.items.map(async (item) => {
          try {
            const menuItemResponse = await axios.get(`http://localhost:5004/api/menu-items/${item.menuItem}`);
            item.menuItem = menuItemResponse.data; 
            return item;
          } catch (error) {
            console.error("Error fetching menu item details:", error);
            return item;
          }
        })
      );
  
      // Update order with populated menu items
      order.items = orderItemsWithDetails;
  
      // Send back the updated order
      res.status(200).json(order);
    } catch (error) {
      console.error("Get order by ID error:", error);
      res.status(500).json({ message: "Server error" });
    }
  };
  


//  Get all orders
exports.getAllOrders = async (req, res) => {
  try {
    const orders = await Order.find();

    const ordersWithDetails = await Promise.all(
      orders.map(async (order) => {
        const orderItemsWithDetails = await Promise.all(
          order.items.map(async (item) => {
            try {
              const menuItemResponse = await axios.get(`http://localhost:5004/api/menu-items/${item.menuItem}`);
              item.menuItem = menuItemResponse.data; 
              return item;
            } catch (error) {
              console.error("Error fetching menu item details:", error);
              item.menuItem = null; 
              return item;
            }
          })
        );
        order.items = orderItemsWithDetails;
        return order;
      })
    );

    // Send back the updated orders
    res.status(200).json(ordersWithDetails);
  } catch (error) {
    console.error("Get all orders error:", error);
    res.status(500).json({ message: "Server error" });
  }
};

// Get orders by status
exports.getOrdersByStatus = async (req, res) => {
  const { status } = req.params;
  const validStatuses = [
    "Pending",
    "Confirmed",
    "Preparing",
    "Prepared",
    "DeliveryAccepted",
    "OutForDelivery",
    "Delivered",
    "Cancelled",
    "PickedUp",
  ];

  // Check if the provided status is valid
  if (!validStatuses.includes(status)) {
    return res.status(400).json({ message: "Invalid order status" });
  }

  try {
    const orders = await Order.find({ status });

    const ordersWithDetails = await Promise.all(
      orders.map(async (order) => {
        const orderItemsWithDetails = await Promise.all(
          order.items.map(async (item) => {
            try {
              const menuItemResponse = await axios.get(`http://localhost:5004/api/menu-items/${item.menuItem}`);
              item.menuItem = menuItemResponse.data; // Add the menu item details to the order item
              return item;
            } catch (error) {
              console.error("Error fetching menu item details:", error);
              item.menuItem = null; 
              return item;
            }
          })
        );
        order.items = orderItemsWithDetails; 
        return order;
      })
    );

    res.status(200).json(ordersWithDetails);
  } catch (error) {
    console.error("Get orders by status error:", error);
    res.status(500).json({ message: "Server error" });
  }
};

// get orders of not Delivered
exports.getActiveOrders = async (req, res) => {
  try {
    const allOrders = await Order.find(); // 1. Get all orders

    // 2. Filter out orders with status === "Delivered"
    const activeOrders = allOrders.filter(order => order.status !== "Delivered");

    // 3. Fetch menu item details for each order
    const ordersWithMenuDetails = await Promise.all(
      activeOrders.map(async (order) => {
        try {
          // Assuming each order has a menuItemId
          const response = await axios.get(`http://localhost:5004/api/menu-items/${order.menuItemId}`);
          const menuItem = response.data;

          return {
            ...order.toObject(),
            menuItemDetails: menuItem, // Append menu item details to the order
          };
        } catch (menuError) {
          console.error(`Failed to fetch menu item for order ${order._id}:`, menuError.message);
          return {
            ...order.toObject(),
            menuItemDetails: null,
          };
        }
      })
    );

    res.status(200).json(ordersWithMenuDetails);
  } catch (error) {
    console.error("Error fetching active orders:", error.message);
    res.status(500).json({ message: "Server error" });
  }
};


exports.getDeliveredOrders = async (req, res) => {
  try {
    // 1. Find only delivered orders directly from the DB
    const deliveredOrders = await Order.find({ status: "Delivered" });

    // 2. Fetch menu item details for each delivered order
    const ordersWithMenuDetails = await Promise.all(
      deliveredOrders.map(async (order) => {
        try {
          const response = await axios.get(`http://localhost:5004/api/menu-items/${order.menuItemId}`);
          const menuItem = response.data;

          return {
            ...order.toObject(),
            menuItemDetails: menuItem, // Append menu item details
          };
        } catch (menuError) {
          console.error(`Failed to fetch menu item for order ${order._id}:`, menuError.message);
          return {
            ...order.toObject(),
            menuItemDetails: null,
          };
        }
      })
    );

    res.status(200).json(ordersWithMenuDetails);
  } catch (error) {
    console.error("Error fetching delivered orders:", error.message);
    res.status(500).json({ message: "Server error" });
  }
};



// Update an order
exports.updateOrderStatus = async (req, res) => {
  const { id } = req.params;
  const { status } = req.body;

  const validStatuses = [
    "Pending",
    "Confirmed",
    "Preparing",
    "Prepared",
    "DeliveryAccepted",
    "OutForDelivery",
    "Delivered",
    "Cancelled",
    "PickedUp",
  ];

  if (!validStatuses.includes(status)) {
    return res.status(400).json({ message: "Invalid status value" });
  }

  try {
    const updatedOrder = await Order.findByIdAndUpdate(
      id,
      { status },
      { new: true }
    );

    if (!updatedOrder) {
      return res.status(404).json({ message: "Order not found" });
    }

    res.status(200).json({ message: "Order status updated", order: updatedOrder });
  } catch (error) {
    console.error("Update order status error:", error);
    res.status(500).json({ message: "Server error" });
  }
};

// Delete an order
exports.deleteOrder = async (req, res) => {
  const { id } = req.params;

  try {
    const deletedOrder = await Order.findByIdAndDelete(id);
    if (!deletedOrder) {
      return res.status(404).json({ message: "Order not found" });
    }

    res.status(200).json({ message: "Order deleted successfully" });
  } catch (error) {
    console.error("Delete order error:", error);
    res.status(500).json({ message: "Server error" });
  }
};

// orders with resturant details
exports.getOrdersWithResturants = async (req, res) => {
  const { status } = req.params;
  const validStatuses = [
    "Pending",
    "Confirmed",
    "Preparing",
    "Prepared",
    "DeliveryAccepted",
    "OutForDelivery",
    "Delivered",
    "Cancelled",
    "PickedUp",
  ];

  // Check if the provided status is valid
  if (!validStatuses.includes(status)) {
    return res.status(400).json({ message: "Invalid order status" });
  }

  try {
    const orders = await Order.find({ status });

    const ordersWithDetails = await Promise.all(
      orders.map(async (order) => {
        // 🧾 Get menu item details
        const orderItemsWithDetails = await Promise.all(
          order.items.map(async (item) => {
            try {
              const menuItemResponse = await axios.get(
                http://localhost:5004/api/menu-items/${item.menuItem}
              );
              item.menuItem = menuItemResponse.data;
              return item;
            } catch (error) {
              console.error("Error fetching menu item details:", error.message);
              item.menuItem = null;
              return item;
            }
          })
        );

        // 🏪 Get restaurant details
        let restaurantDetails = null;
        try {
          const restId = order.restaurantId?.toString(); // Ensure it's a string
          const restaurantRes = await axios.get(
            http://localhost:5004/api/restaurants/${restId}
          );
          restaurantDetails = restaurantRes.data;
        } catch (error) {
          console.error("Error fetching restaurant details:", error.message);
        }

        return {
          ...order.toObject(), // convert Mongoose document to plain JS object
          items: orderItemsWithDetails,
          restaurant: restaurantDetails,
        };
      })
    );

    res.status(200).json(ordersWithDetails);
  } catch (error) {
    console.error("Get orders by status error:", error);
    res.status(500).json({ message: "Server error" });
  }
};

// get orders by orderId with restaurant details
exports.getOrderByIdWithRestaurantDetails = async (req, res) => {
  const { id } = req.params;
  try {
    const order = await Order.findById(id);
    if (!order) {
      return res.status(404).json({ message: "Order not found" });
    }

    const orderItemsWithDetails = await Promise.all(
      order.items.map(async (item) => {
        try {
          const menuItemResponse = await axios.get(
            http://localhost:5004/api/menu-items/${item.menuItem}
          );
          item.menuItem = menuItemResponse.data;
          return item;
        } catch (error) {
          console.error("Error fetching menu item details:", error);
          return item;
        }
      })
    );

    // 🏪 Get restaurant details
    let restaurantDetails = null;
    try {
      const restId = order.restaurantId?.toString();
      const restaurantRes = await axios.get(
        http://localhost:5004/api/restaurants/${restId}
      );
      restaurantDetails = restaurantRes.data;
    } catch (error) {
      console.error("Error fetching restaurant details:", error.message);
    }

    // ✅ Correct response
    res.json({
      ...order.toObject(),
      items: orderItemsWithDetails,
      restaurant: restaurantDetails,
    });
  } catch (error) {
    console.error("Get order by ID error:", error);
    res.status(500).json({ message: "Server error" });
  }
};