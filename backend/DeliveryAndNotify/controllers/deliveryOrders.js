const DeliveryOrder = require("../models/DeliveryOrders");

// 1. Accept Delivery (Create DeliveryOrder)
exports.acceptDelivery = async (req, res) => {
  try {
    const {
      orderId,
      pickupLocation,
      dropoffLocation,
      deliveryCharge,
      paymentMethod,
    } = req.body;
    const driverId = req.user.id;

    const deliveryOrder = new DeliveryOrder({
      orderId,
      driverId,
      pickupLocation,
      dropoffLocation,
      deliveryCharge,
      paymentMethod,
      status: "DeliveryAccepted",
      acceptedAt: new Date(),
    });

    const savedDelivery = await deliveryOrder.save();
    res.status(201).json(savedDelivery);
  } catch (error) {
    console.error("Accept Delivery Error:", error);
    res.status(500).json({ message: "Failed to accept delivery." });
  }
};

// 2. Pick Up Order (Mark as PickedUp)
exports.pickupDelivery = async (req, res) => {
  try {
    const { id } = req.params; // deliveryOrder id

    const updatedDelivery = await DeliveryOrder.findByIdAndUpdate(
      id,
      { status: "PickedUp", pickedUpAt: new Date() },
      { new: true }
    );

    if (!updatedDelivery) {
      return res.status(404).json({ message: "Delivery order not found." });
    }

    res.status(200).json(updatedDelivery);
  } catch (error) {
    console.error("Pickup Delivery Error:", error);
    res.status(500).json({ message: "Failed to pickup delivery." });
  }
};

// 3. Complete Delivery (Mark as Delivered)
exports.completeDelivery = async (req, res) => {
  try {
    const { id } = req.params; // deliveryOrder id
    const { proofPhotos, customerSignature } = req.body;

    const updatedDelivery = await DeliveryOrder.findByIdAndUpdate(
      id,
      {
        status: "Delivered",
        deliveredAt: new Date(),
        proofPhotos,
        customerSignature,
      },
      { new: true }
    );

    if (!updatedDelivery) {
      return res.status(404).json({ message: "Delivery order not found." });
    }

    res.status(200).json(updatedDelivery);
  } catch (error) {
    console.error("Complete Delivery Error:", error);
    res.status(500).json({ message: "Failed to complete delivery." });
  }
};

// 4. Get Delivery Order by ID
exports.getDeliveryById = async (req, res) => {
  try {
    const { id } = req.params;
    const delivery = await DeliveryOrder.findById(id);

    if (!delivery) {
      return res.status(404).json({ message: "Delivery order not found." });
    }

    res.status(200).json(delivery);
  } catch (error) {
    console.error("Get Delivery Error:", error);
    res.status(500).json({ message: "Failed to get delivery order." });
  }
};

//get all current running deliveries for a driver
exports.getAllCurrentDeliveries = async (req, res) => {
  try {
    const driverId = req.user.id; // Logged-in driver's id

    const deliveries = await DeliveryOrder.find({
      driverId: driverId,
      status: "DeliveryAccepted" || "OutForDelivery", // Only accepted deliveries
    });

    res.status(200).json(deliveries);
  } catch (error) {
    console.error("Get Current Deliveries Error:", error);
    res.status(500).json({ message: "Failed to get current deliveries." });
  }
};

// Controller for canceling the delivery
exports.cancelDelivery = async (req, res) => {
  const { id } = req.params;
  try {
    // Find the delivery order by ID
    const deliveryOrder = await DeliveryOrder.findById(id);

    // If no order found, return error
    if (!deliveryOrder) {
      return res.status(404).json({ message: "Delivery order not found." });
    }

    // If the order is already delivered or canceled, it can't be canceled again
    if (
      deliveryOrder.status === "Delivered" ||
      deliveryOrder.status === "Canceled"
    ) {
      return res
        .status(400)
        .json({ message: "This order cannot be canceled." });
    }

    // Update the delivery order to "Canceled" status and set canceledAt
    deliveryOrder.status = "Canceled";
    deliveryOrder.canceledAt = new Date();

    // Save the updated delivery order
    await deliveryOrder.save();

    // Optionally, if you want to remove the driver association or handle reassigning
    deliveryOrder.driverId = null; // Optional step if you want to disassociate the driver

    res
      .status(200)
      .json({ message: "Delivery order has been canceled successfully." });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error." });
  }
};
