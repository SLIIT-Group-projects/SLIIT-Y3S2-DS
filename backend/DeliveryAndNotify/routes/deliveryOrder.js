const express = require("express");
const {
  acceptDelivery,
  completeDelivery,
  getDeliveryById,
  pickupDelivery,
  cancelDelivery,
  getAllCurrentDeliveries,
} = require("../controllers/deliveryOrders.js");
const verifyToken = require("../middleware/auth.js");

const router = express.Router();

router.post("/accept", verifyToken, acceptDelivery); // Create delivery
router.put("/pickup/:id", verifyToken, pickupDelivery); // Update pickup
router.put("/complete/:id", verifyToken, completeDelivery); // Update delivered
router.put("/cancel/:id", verifyToken, cancelDelivery); // Update canceled
router.get("/current", verifyToken, getAllCurrentDeliveries);
router.get("/:id", verifyToken, getDeliveryById); // Get delivery details

module.exports = router;
