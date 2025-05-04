const express = require("express");
const {
  acceptDelivery,
  getDeliveryById,
  pickupDelivery,
  cancelDelivery,
  getAllCurrentDeliveries,
  completeDeliveryOrder,
  getAllDeliveries,
  getDeliveryByOrderId,
} = require("../controllers/deliveryOrders.js");
const verifyToken = require("../middleware/auth.js");

const router = express.Router();

router.post("/accept", verifyToken, acceptDelivery);
router.get("/history", verifyToken, getAllDeliveries);
router.put("/pickup/:id", verifyToken, pickupDelivery);
router.put("/complete/:id", verifyToken, completeDeliveryOrder);
router.put("/cancel/:id", verifyToken, cancelDelivery);
router.get("/current", verifyToken, getAllCurrentDeliveries);
router.get("/:id", verifyToken, getDeliveryById);
router.get('/order/:orderId', getDeliveryByOrderId);


module.exports = router;
