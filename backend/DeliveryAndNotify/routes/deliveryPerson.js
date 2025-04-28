const express = require("express");
const {
  registerDeliveryPerson,
  getAllDeliveryPersons,
  getDeliveryPersonById,
  updateDeliveryPersonById,
  deleteDeliveryPersonById,
  updateOnlineStatus,
} = require("../controllers/deliveryPerson");
const verifyToken = require("../middleware/auth");

const router = express.Router();

router.post("/", verifyToken, registerDeliveryPerson);
router.get("/all", getAllDeliveryPersons);
router.get("/", verifyToken, getDeliveryPersonById);
router.put("/", verifyToken, updateDeliveryPersonById);
router.patch("/online-status", verifyToken, updateOnlineStatus);
router.delete("/:id", deleteDeliveryPersonById);

module.exports = router;
