const { default: mongoose } = require("mongoose");

const DeliveryOrderSchema = new mongoose.Schema(
  {
    orderId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Order",
      required: true,
      unique: true,
    },
    driverId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "DeliveryPerson",
      required: true,
    },
    status: {
      type: String,
      enum: [
        "Pending",
        "Confirmed",
        "Preparing",
        "Prepared",
        "DeliveryAccepted",
        "OutForDelivery",
        "Delivered",
        "Cancelled",
        "PickedUp",
      ],
      default: "DeliveryAccepted",
    },
    pickupAddress: {
      name: String,
      street: String,
      city: String,
    },
    dropofAddress: {
      no: String,
      street: String,
      city: String,
    },
    pickupLocation: {
      latitude: Number,
      longitude: Number,
    },
    dropoffLocation: {
      latitude: Number,
      longitude: Number,
    },
    acceptedAt: Date,
    pickedUpAt: Date,
    deliveredAt: Date,
    proofPhotos: [String],
    estimatedTime: Number,
    actualTime: Number,
    deliveryCharge: Number,
    paymentMethod: String,
    customerSignature: String,
  },
  { timestamps: true }
);

const DeliveryOrder = mongoose.model("DeliveryOrder", DeliveryOrderSchema);
module.exports = DeliveryOrder;
