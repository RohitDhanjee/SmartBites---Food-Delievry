const Review = require('../models/Review');
const axios = require('axios');

const ORDER_SERVICE = process.env.ORDER_SERVICE_URL;

// ============================================================
// POST /add — Submit a review
// ============================================================
exports.addReview = async (req, res) => {
  try {
    const { restaurantId, orderId, rating, comment } = req.body;
    const userId = req.headers['x-user-id'];
    const userName = req.headers['x-user-name'] || 'Anonymous';

    if (!userId) {
      return res.status(401).json({ success: false, message: 'Unauthorized' });
    }

    // 1. Verify if the order exists and belongs to the user
    // This is INTER-SERVICE COMMUNICATION
    try {
      const orderRes = await axios.get(`${ORDER_SERVICE}/${orderId}`);
      const order = orderRes.data.data;

      if (!order) {
        return res.status(404).json({ success: false, message: 'Order not found' });
      }

      if (order.userId !== userId) {
        return res.status(403).json({ success: false, message: 'This order does not belong to you' });
      }

      if (order.status !== 'delivered') {
        return res.status(400).json({ success: false, message: 'You can only review delivered orders' });
      }
    } catch (err) {
      console.error('Order Service Communication Error:', err.message);
      return res.status(500).json({ success: false, message: 'Could not verify order status' });
    }

    // 2. Check if review already exists
    const existing = await Review.findOne({ orderId });
    if (existing) {
      return res.status(400).json({ success: false, message: 'Review already submitted for this order' });
    }

    // 3. Save the review
    const review = await Review.create({
      userId,
      userName,
      restaurantId,
      orderId,
      rating,
      comment
    });

    res.status(201).json({
      success: true,
      message: 'Review submitted successfully',
      data: review
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to submit review',
      error: error.message
    });
  }
};

// ============================================================
// GET /restaurant/:restaurantId — Get reviews for a restaurant
// ============================================================
exports.getRestaurantReviews = async (req, res) => {
  try {
    const reviews = await Review.find({ restaurantId: req.params.restaurantId }).sort({ createdAt: -1 });
    res.json({
      success: true,
      count: reviews.length,
      data: reviews
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to fetch reviews',
      error: error.message
    });
  }
};
