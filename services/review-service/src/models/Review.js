const mongoose = require('mongoose');

const ReviewSchema = new mongoose.Schema({
  userId: {
    type: String,
    required: true
  },
  userName: {
    type: String,
    required: true
  },
  restaurantId: {
    type: String,
    required: true
  },
  orderId: {
    type: String,
    required: true,
    unique: true // One review per order
  },
  rating: {
    type: Number,
    required: true,
    min: 1,
    max: 5
  },
  comment: {
    type: String,
    required: true
  },
  sentiment: {
    type: String,
    enum: ['Positive', 'Negative', 'Neutral'],
    default: 'Neutral'
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('Review', ReviewSchema);
