const express = require('express');
const router = express.Router();
const paymentController = require('../controllers/paymentController');

// POST /pay — Process a payment
router.post('/pay', paymentController.processPayment);

// GET /status/:paymentId — Get payment status
router.get('/status/:paymentId', paymentController.getPaymentStatus);

// GET /order/:orderId — Get payment by order ID
router.get('/order/:orderId', paymentController.getPaymentByOrder);

// GET /analytics/stats — Get aggregated payment stats (Admin)
router.get('/analytics/stats', paymentController.getPaymentStats);

module.exports = router;
