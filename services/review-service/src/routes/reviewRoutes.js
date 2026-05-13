const express = require('express');
const router = express.Router();
const reviewController = require('../controllers/reviewController');

// Public: Get reviews for a restaurant
router.get('/restaurant/:restaurantId', reviewController.getRestaurantReviews);

// Protected: Add a review
router.post('/add', reviewController.addReview);

module.exports = router;
