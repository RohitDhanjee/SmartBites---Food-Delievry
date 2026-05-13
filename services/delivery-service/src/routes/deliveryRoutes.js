const express = require('express');
const router = express.Router();
const deliveryController = require('../controllers/deliveryController');

// POST /assign — Assign a rider to an order
router.post('/assign', deliveryController.assignRider);

// GET /:orderId — Get delivery status
router.get('/:orderId', deliveryController.getDeliveryStatus);

// PUT /status — Update delivery status
router.put('/status', deliveryController.updateDeliveryStatus);

module.exports = router;
