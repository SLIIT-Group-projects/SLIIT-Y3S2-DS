const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  name: String,
  email: { type: String, unique: true },
  password: String,
  role: { type: String, enum: ['customer', 'restaurant', 'delivery', 'admin'], default: 'customer' }
});

module.exports = mongoose.model('User', userSchema);
