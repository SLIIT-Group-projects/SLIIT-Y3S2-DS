const mongoose = require("mongoose");

const menuItemSchema = new mongoose.Schema(
  {
    restaurantId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Restaurant",
      required: true,
      index: true, // Critical for performance
    },
    name: { type: String, required: true },
    description: { type: String },
    price: { type: Number, required: true, min: 0 },
    category: {
      type: String,
      required: true,
      enum: [
        "Appetizer",
        "Main Course",
        "Dessert",
        "Beverage",
        "Special",
        "Rice and Curry",
        "Fish and Seafood",
        "Poultry and Meat",
        "Vegetables",
        "Pasta",
        "Noodles",
      ],
    },
    isAvailable: { type: Boolean, default: true },
    imageUrl: { type: String },
    preparationTime: { type: Number }, // Minutes
    ingredients: { type: [String], default: [] },
    dietaryTags: {
      type: [String],
      enum: ["Vegetarian", "Vegan", "Gluten-Free", "Halal", "Spicy"],
    },
    cuisineType: {
      type: String,
      required: true,
      enum: [
        "Indian",
        "Chinese",
        "Italian",
        "Mexican",
        "Japanese",
        "French",
        "Greek",
        "Spanish",
        "Thai",
        "Turkish",
        "Korean",
        "Sri Lankan",
      ],
    },
  },
  { timestamps: true }
);

// Compound indexes for ultra-fast menu queries
menuItemSchema.index({ restaurantId: 1, category: 1 }); // For category filtering
menuItemSchema.index({ restaurantId: 1, isAvailable: 1 }); // For active items

module.exports = mongoose.model("MenuItem", menuItemSchema);
