const mongoose = require('mongoose');

const addressSchema = new mongoose.Schema({
    buildingNumber: { type: String, required: true },
    street: { type: String, required: true },
    city: { type: String, required: true },
    district: { type: String, required: true },
    postalCode: { type: String, required: true },
    latitude: { type: Number, required: false },
    longitude: { type: Number, required: false }
});

const restaurantSchema = new mongoose.Schema({
    name: { type: String, required: true },
    description: { type: String },
    address: { type: addressSchema, required: true },
    contact: {
        phone: { type: String, required: true },
        email: { type: String, required: true }
    },
    openingHours: [{
        day: {
            type: String,
            enum: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday','Weekdays', 'Weekends'],
            required: true
        },
        open: { type: String, required: true }, // Format: "09:00"
        close: { type: String, required: true }
    }],
    isAvailable: { type: Boolean, default: true },
    ownerId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    isVerified: { type: Boolean, default: false },
    imageUrl: { type: String },
    cuisineType: { type: String },
    currentLocation: {
        lat: {
          type: Number,
          required: true
        },
        lng: {
          type: Number,
          required: true
        }
      }
}, { timestamps: true }); // createdAt and updatedAt

module.exports = mongoose.models.Restaurant || mongoose.model('Restaurant', restaurantSchema);