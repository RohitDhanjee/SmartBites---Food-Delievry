const Review = require('../models/Review');
const axios = require('axios');

// Helper to get Order Service URL with fallback
const getOrderServiceURL = () => (process.env.ORDER_SERVICE_URL || 'http://order-service:4003').replace(/\/+$/, '');

// ---- AI Sentiment Analyzer (Smart & Multilingual) ----
const analyzeSentiment = (text) => {
  const positive = ['good', 'great', 'excellent', 'amazing', 'delicious', 'best', 'love', 'nice', 'awesome', 'fast', 'hot', 'zabardast', 'behtareen', 'maza', 'fresh'];
  const negative = ['bad', 'worst', 'horrible', 'slow', 'cold', 'poor', 'expensive', 'late', 'rude', 'bakwas', 'bekar', 'thanda', 'mehnga', 'ganda'];
  
  const words = text.toLowerCase().split(/\W+/);
  let score = 0;
  
  words.forEach(word => {
    if (positive.includes(word)) score++;
    if (negative.includes(word)) score--;
  });
  
  if (score > 0) return 'Positive';
  if (score < 0) return 'Negative';
  return 'Neutral';
};

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
    try {
      const orderServiceUrl = `${getOrderServiceURL()}/${orderId}`;
      const orderRes = await axios.get(orderServiceUrl);
      const order = orderRes.data.data;

      if (!order || order.userId !== userId || order.status !== 'delivered') {
        return res.status(400).json({ success: false, message: 'Invalid order for review' });
      }
    } catch (err) {
      return res.status(500).json({ success: false, message: 'Could not verify order' });
    }

    // 2. Check if review already exists
    const existing = await Review.findOne({ orderId });
    if (existing) {
      return res.status(400).json({ success: false, message: 'Review already submitted' });
    }

    // 3. AI Sentiment Analysis
    const sentiment = analyzeSentiment(comment);

    // 4. Save the review
    const review = await Review.create({
      userId,
      userName,
      restaurantId,
      orderId,
      rating,
      comment,
      sentiment
    });

    res.status(201).json({
      success: true,
      message: `Review submitted with ${sentiment} sentiment`,
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
