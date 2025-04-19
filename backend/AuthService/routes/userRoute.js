const express = require("express");
const router = express.Router();
const authController = require("../AuthService/controllers/authController");
const verifyToken = require("../AuthService/middleware/auth");
const permit = require("../AuthService/middleware/role");

router.post("/register", authController.register);
router.post("/login", authController.login);
router.get("/profile", verifyToken, authController.getProfile);
router.get("/admin-panel", verifyToken, permit("admin"), (req, res) =>
  res.send("Admin Access")
);
router.get("/delivery-panel", verifyToken, permit("delivery"), (req, res) =>
  res.send("Delivery Access")
);

module.exports = router;
