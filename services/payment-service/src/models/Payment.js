// ============================================================
// Payment Model (Mongoose Schema)
// ============================================================
// Stores payment transaction records. Uses simulated/mock
// payment processing — no real payment gateway is needed.
// Each payment gets a unique transactionId (UUID).
// ============================================================

const mongoose = require('mongoose');

const paymentSchema = new mongoose.Schema({
  orderId: {
    type: String,
    required: [true, 'Order ID is required']
  },
  userId: {
    type: String,
    required: [true, 'User ID is required']
  },
  amount: {
    type: Number,
    required: [true, 'Amount is required'],
    min: 0
  },
  method: {
    type: String,
    enum: ['card', 'cash', 'wallet', 'upi'],
    default: 'card'
  },
  status: {
    type: String,
    enum: ['pending', 'completed', 'failed', 'refunded'],
    default: 'pending'
  },
  transactionId: {
    type: String,
    unique: true
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('Payment', paymentSchema);
