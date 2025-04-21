const { default: mongoose } = require("mongoose");

const DeliveryPersonSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
    unique: true,
  },
  name: {
    type: String,
    required: true,
  },
  vehicaleType: {
    type: String,
    enum: ["bike", "car", "scooter"],
    default: "bike",
    required: true,
  },
  isOnline: {
    type: Boolean,
    default: false,
  },
  address: {
    type: String,
    required: true,
  },
  currentLocation: {
    lat: {
      type: Number,
      required: true,
    },
    lng: {
      type: Number,
      required: true,
    },
  },
  totalDeliveries: {
    type: Number,
    default: 0,
  },
  totalEarnings: {
    type: Number,
    default: 0,
  },
  averageRating: {
    type: Number,
    default: 5,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

const DeliveryPerson = mongoose.model("DeliveryPerson", DeliveryPersonSchema);
module.exports = DeliveryPerson;
