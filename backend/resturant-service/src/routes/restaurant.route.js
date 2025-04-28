const express = require("express");
const router = express.Router();
const restaurantController = require("../controllers/restaurant.controller");
const verifyToken = require("../middleware/auth");
const upload = require("../middleware/multerMiddleware");
const permit = require("../middleware/role");

router.post(
  "/",
  verifyToken,
  upload.single("image"),
  restaurantController.createRestaurant
);
router.get("/", restaurantController.getAllRestaurants);
router.get("/my", verifyToken, restaurantController.getMyRestaurants);
router.get("/:id", restaurantController.getRestaurantById);
router.put(
  "/:id",
  verifyToken,
  upload.single("image"),
  restaurantController.updateRestaurant
);
router.delete("/:id", verifyToken, restaurantController.deleteRestaurant);

// admin
router.put(
  "/verify/:id",
  verifyToken,
  permit("admin"),
  restaurantController.verifyRestaurant
);
router.put(
  "/reject/:id",
  verifyToken,
  permit("admin"),
  restaurantController.rejectRestaurant
);

module.exports = router;
