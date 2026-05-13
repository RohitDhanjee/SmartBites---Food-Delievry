// ============================================================
// Order Service Routes
// ============================================================

const express = require('express');
const router = express.Router();
const orderController = require('../controllers/orderController');

// POST /create — Create a new order (triggers payment + delivery)
router.post('/create', orderController.createOrder);

// GET /user/:userId — Get all orders for a user
router.get('/user/:userId', orderController.getUserOrders);

// GET /:orderId — Get single order details
router.get('/:orderId', orderController.getOrder);

// PUT /status — Update order status
router.put('/status', orderController.updateOrderStatus);

// PUT /cancel/:orderId — Cancel an order
router.put('/cancel/:orderId', orderController.cancelOrder);

// GET /analytics/stats — Get aggregated order stats (Admin)
router.get('/analytics/stats', orderController.getOrderStats);

module.exports = router;
