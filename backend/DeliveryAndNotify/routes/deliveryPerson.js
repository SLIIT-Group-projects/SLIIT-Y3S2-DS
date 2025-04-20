const express = require("express");
const {
  registerDeliveryPerson,
  getAllDeliveryPersons,
  getDeliveryPersonById,
  updateDeliveryPersonById,
  deleteDeliveryPersonById,
} = require("../controllers/deliveryPerson");

const router = express.Router();

router.post("/", registerDeliveryPerson);
router.get("/", getAllDeliveryPersons);
router.get("/:id", getDeliveryPersonById);
router.put("/:id", updateDeliveryPersonById);
router.delete("/:id", deleteDeliveryPersonById);

module.exports = router;
