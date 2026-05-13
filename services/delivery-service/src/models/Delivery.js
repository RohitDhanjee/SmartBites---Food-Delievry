// ============================================================
// Delivery Model (Mongoose Schema)
// ============================================================
// Tracks delivery assignments and real-time status updates.
// Includes simulated rider info and GPS location coordinates.
// ============================================================

const mongoose = require('mongoose');

const deliverySchema = new mongoose.Schema({
  orderId: {
    type: String,
    required: [true, 'Order ID is required'],
    unique: true
  },
  riderId: {
    type: String,
    default: null
  },
  riderName: {
    type: String,
    default: null
  },
  riderPhone: {
    type: String,
    default: null
  },
  status: {
    type: String,
    enum: ['pending', 'assigned', 'picking', 'picked', 'delivering', 'delivered'],
    default: 'pending'
  },
  estimatedTime: {
    type: Number,  // minutes
    default: 30
  },
  location: {
    lat: { type: Number, default: 24.8607 },   // Default: Karachi
    lng: { type: Number, default: 67.0011 }
  },
  deliveryAddress: {
    type: String,
    default: ''
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('Delivery', deliverySchema);
