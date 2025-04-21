const DeliveryPerson = require("../models/DeliveryPerson");

// register a new delivery person
exports.registerDeliveryPerson = async (req, res) => {
  try {
    const userId = req.user.id;
    const { name, vehicaleType, address, currentLocation } = req.body;
    const existingDeliveryPerson = await DeliveryPerson.findOne({ userId });
    if (existingDeliveryPerson) {
      return res
        .status(400)
        .json({ message: "Delivery person already exists" });
    }
    const deliveryPerson = new DeliveryPerson({
      userId,
      name,
      vehicaleType,
      address,
      currentLocation,
    });
    await deliveryPerson.save();
    return res.status(201).json({
      message: "Delivery person registered successfully",
      deliveryPerson,
    });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: "Internal server error" });
  }
};

// get all delivery persons
exports.getAllDeliveryPersons = async (req, res) => {
  try {
    const deliveryPersons = await DeliveryPerson.find();
    return res.status(200).json({
      message: "Delivery persons fetched successfully",
      deliveryPersons,
    });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: "Internal server error" });
  }
};

//get delivery person by id
exports.getDeliveryPersonById = async (req, res) => {
  try {
    const { id } = req.params;
    const deliveryPerson = await DeliveryPerson.findById(id);
    if (!deliveryPerson) {
      return res.status(404).json({ message: "Delivery person not found" });
    }
    return res.status(200).json({
      message: "Delivery person fetched successfully",
      deliveryPerson,
    });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: "Internal server error" });
  }
};

// update delivery person by id
exports.updateDeliveryPersonById = async (req, res) => {
  try {
    const { id } = req.params;
    const deliveryPerson = await DeliveryPerson.findByIdAndUpdate(
      id,
      req.body,
      {
        new: true,
      }
    );
    if (!deliveryPerson) {
      return res.status(404).json({ message: "Delivery person not found" });
    }
    return res.status(200).json({
      message: "Delivery person updated successfully",
      deliveryPerson,
    });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: "Internal server error" });
  }
};

exports.deleteDeliveryPersonById = async (req, res) => {
  try {
    const { id } = req.params;
    const deliveryPerson = await DeliveryPerson.findByIdAndDelete(id);
    if (!deliveryPerson) {
      return res.status(404).json({ message: "Delivery driver not exist" });
    }
    return res.status(200).json({
      message: "Delivey driver deleted successfully",
    });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: "Internal server error" });
  }
};
