const DeliveryOrder = require("../models/DeliveryOrders");
const DeliveryPerson = require("../models/DeliveryPerson");

// 1. Accept Delivery (Create DeliveryOrder)
exports.acceptDelivery = async (req, res) => {
  try {
    const {
      orderId,
      pickupAddress,
      dropofAddress,
      pickupLocation,
      dropoffLocation,
      deliveryCharge,
      paymentMethod,
    } = req.body;
    const driverId = req.user.id;

    const deliveryOrder = new DeliveryOrder({
      orderId,
      driverId,
      pickupAddress,
      dropofAddress,
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

exports.pickupDelivery = async (req, res) => {
  try {
    const id = req.params.id; // deliveryOrder id
    const { status } = req.body; // get status from request body

    const updateData = { status };

    // Only set pickedUpAt if status is PickedUp
    if (status === "PickedUp") {
      updateData.pickedUpAt = new Date();
    }

    const updatedDelivery = await DeliveryOrder.findByIdAndUpdate(
      id,
      updateData,
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

// 4. Get Delivery Order by ID
exports.getDeliveryById = async (req, res) => {
  try {
    const deliveryId = req.params.id; // Get the id from the URL params
    const delivery = await DeliveryOrder.findById(deliveryId); // Find the delivery by its ID

    if (!delivery) {
      return res.status(404).json({ message: "Delivery order not found." });
    }

    res.status(200).json(delivery);
  } catch (error) {
    console.error("Get Delivery Error:", error);
    res.status(500).json({ message: "Failed to get delivery order." });
  }
};

// get delivery by order id
exports.getDeliveryByOrderId = async (req, res) => {
  try {
    const orderId = req.params.orderId; // Get the orderId from the URL params

    const delivery = await DeliveryOrder.findOne({ orderId }); // Query by orderId

    if (!delivery) {
      return res.status(404).json({ message: "Delivery order not found for this order ID." });
    }

    res.status(200).json(delivery);
  } catch (error) {
    console.error("Get Delivery by Order ID Error:", error);
    res.status(500).json({ message: "Failed to get delivery order by order ID." });
  }
};


//get all deliveries
exports.getAllDeliveries = async (req, res) => {
  try {
    const driverId = req.user.id;

    const deliveries = await DeliveryOrder.find({ driverId }).sort({
      deliveredAt: -1,
    });

    res.status(200).json({ data: deliveries });
  } catch (error) {
    console.error("Get Current Deliveries Error:", error);
    res.status(500).json({ message: "Failed to get current deliveries." });
  }
};

//get all current running deliveries for a driver
exports.getAllCurrentDeliveries = async (req, res) => {
  try {
    const driverId = req.user.id; // Logged-in driver's id

    const deliveries = await DeliveryOrder.find({
      driverId: driverId,
      status: { $in: ["DeliveryAccepted", "OutForDelivery", "PickedUp"] }, // Only accepted deliveries
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

//complete delivery
exports.completeDeliveryOrder = async (req, res) => {
  try {
    const { id } = req.params;
    const { customerSignature } = req.body;

    const deliveryOrder = await DeliveryOrder.findById(id);

    if (!deliveryOrder) {
      return res.status(404).json({ message: "Delivery order not found" });
    }

    const deliveredAt = new Date(); // Current time
    const acceptedAt = deliveryOrder.acceptedAt;

    if (!acceptedAt) {
      return res
        .status(400)
        .json({ message: "Cannot calculate actual time. Missing acceptedAt." });
    }

    // Calculate actual time in minutes
    const actualTime = Math.ceil((deliveredAt - acceptedAt) / (1000 * 60)); // converting milliseconds to minutes

    // Update the order
    deliveryOrder.deliveredAt = deliveredAt;
    deliveryOrder.actualTime = actualTime;
    deliveryOrder.customerSignature = customerSignature;
    deliveryOrder.status = "Delivered";

    await deliveryOrder.save();

    const deliveryPersonId = deliveryOrder.driverId;
    const deliveryCharge = deliveryOrder.deliveryCharge;

    const deliveryPerson = await DeliveryPerson.findOne({
      userId: deliveryPersonId,
    });
    if (deliveryPerson) {
      deliveryPerson.totalDeliveries += 1;
      deliveryPerson.totalEarnings += deliveryCharge;
      await deliveryPerson.save();
    }

    return res
      .status(200)
      .json({ message: "Delivery completed successfully", deliveryOrder });
  } catch (error) {
    console.error("Error completing delivery:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};
