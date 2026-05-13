// ============================================================
// Restaurant Model (Mongoose Schema)
// ============================================================
// Stores restaurant information. Each restaurant has a name,
// cuisine type, address, rating, and availability status.
// ============================================================

const mongoose = require('mongoose');

const restaurantSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Restaurant name is required'],
    trim: true
  },
  cuisine: {
    type: String,
    required: [true, 'Cuisine type is required'],
    trim: true
  },
  address: {
    type: String,
    required: [true, 'Address is required']
  },
  rating: {
    type: Number,
    default: 4.0,
    min: 1,
    max: 5
  },
  image: {
    type: String,
    default: 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=400'
  },
  deliveryTime: {
    type: String,
    default: '30-45 min'
  },
  isOpen: {
    type: Boolean,
    default: true
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('Restaurant', restaurantSchema);
