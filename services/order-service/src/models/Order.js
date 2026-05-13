// ============================================================
// Order Model (Mongoose Schema)
// ============================================================
// Stores order information. Orders reference users, restaurants,
// and contain embedded item data. The status field tracks the
// order through its lifecycle.
//
// Order Lifecycle:
// placed → confirmed → preparing → ready → picked → delivered
//                                              ↓
//                                          cancelled
// ============================================================

const mongoose = require('mongoose');

const orderItemSchema = new mongoose.Schema({
  name: { type: String, required: true },
  price: { type: Number, required: true },
  quantity: { type: Number, required: true, min: 1 }
}, { _id: false });

const orderSchema = new mongoose.Schema({
  userId: {
    type: String,
    required: [true, 'User ID is required']
  },
  restaurantId: {
    type: String,
    required: [true, 'Restaurant ID is required']
  },
  restaurantName: {
    type: String,
    required: [true, 'Restaurant name is required']
  },
  items: {
    type: [orderItemSchema],
    required: [true, 'Order items are required'],
    validate: [arr => arr.length > 0, 'Order must have at least one item']
  },
  totalAmount: {
    type: Number,
    required: true,
    min: 0
  },
  status: {
    type: String,
    enum: ['placed', 'confirmed', 'preparing', 'ready', 'picked', 'delivered', 'cancelled'],
    default: 'placed'
  },
  paymentId: {
    type: String,
    default: null
  },
  deliveryId: {
    type: String,
    default: null
  },
  deliveryAddress: {
    type: String,
    required: [true, 'Delivery address is required']
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('Order', orderSchema);
