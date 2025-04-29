const express = require("express");
const router = express.Router();
const authController = require("../controllers/authController");
const verifyToken = require("../middleware/auth");
const permit = require("../middleware/role");
const User = require("../models/user")
router.post("/register", authController.register);
router.post("/login", authController.login);
router.get("/profile", verifyToken, authController.getProfile);
router.get("/admin-panel", verifyToken, permit("admin"), (req, res) =>
  res.send("Admin Access")
);
router.get("/delivery-panel", verifyToken, permit("delivery"), (req, res) =>
  res.send("Delivery Access")
);

router.get("/customers", verifyToken, permit("admin"), authController.getAllCustomers);

router.get('/user/:id', async (req, res) => {
  try {
    const user = await User.findById(req.params.id).select('name email role');
    if (!user) return res.status(404).json({ message: "User not found" });

    res.json(user);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
