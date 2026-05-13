// ============================================================
// Payment Controller
// ============================================================
// Simulates payment processing. In a real system, this would
// integrate with Stripe, PayPal, or a local payment gateway.
//
// For this academic project, we simulate:
// - 90% success rate for card payments
// - 100% success rate for cash payments
// - Random processing delay (500ms-2s)
//
// This demonstrates how a payment microservice works
// independently from the order service.
// ============================================================

const Payment = require('../models/Payment');
const { v4: uuidv4 } = require('uuid');

// ============================================================
// POST /pay — Process a payment (simulated)
// ============================================================
exports.processPayment = async (req, res) => {
  try {
    const { orderId, userId, amount, method } = req.body;

    // Generate a unique transaction ID
    const transactionId = `TXN-${uuidv4().slice(0, 8).toUpperCase()}`;

    // Simulate payment processing delay (realistic feel)
    await new Promise(resolve => setTimeout(resolve, 500 + Math.random() * 1000));

    // Simulate payment success/failure
    // Card: 90% success, Cash: 100% success, Others: 85% success
    let paymentSuccess;
    switch (method) {
      case 'cash':
        paymentSuccess = true;
        break;
      case 'card':
        paymentSuccess = Math.random() < 0.9;
        break;
      default:
        paymentSuccess = Math.random() < 0.85;
    }

    // Create payment record
    const payment = await Payment.create({
      orderId,
      userId,
      amount,
      method: method || 'card',
      status: paymentSuccess ? 'completed' : 'failed',
      transactionId
    });

    if (paymentSuccess) {
      console.log(`💳 Payment SUCCESS: ${transactionId} | Amount: ${amount}`);
      res.status(201).json({
        success: true,
        message: 'Payment processed successfully',
        data: payment
      });
    } else {
      console.log(`❌ Payment FAILED: ${transactionId} | Amount: ${amount}`);
      res.status(402).json({
        success: false,
        message: 'Payment failed. Please try again.',
        data: payment
      });
    }
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Payment processing error',
      error: error.message
    });
  }
};

// ============================================================
// GET /status/:paymentId — Check payment status
// ============================================================
exports.getPaymentStatus = async (req, res) => {
  try {
    const payment = await Payment.findById(req.params.paymentId);
    if (!payment) {
      return res.status(404).json({
        success: false,
        message: 'Payment record not found'
      });
    }

    res.json({
      success: true,
      data: payment
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to fetch payment status',
      error: error.message
    });
  }
};

// ============================================================
// GET /order/:orderId — Get payment by order ID
// ============================================================
exports.getPaymentByOrder = async (req, res) => {
  try {
    const payment = await Payment.findOne({ orderId: req.params.orderId });
    if (!payment) {
      return res.status(404).json({
        success: false,
        message: 'Payment not found for this order'
      });
    }

    res.json({
      success: true,
      data: payment
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to fetch payment',
      error: error.message
    });
  }
};
// ============================================================
// GET /analytics/stats — Get aggregated payment stats (Admin)
// ============================================================
exports.getPaymentStats = async (req, res) => {
  try {
    const totalPayments = await Payment.countDocuments();
    const statusBreakdown = await Payment.aggregate([
      { $group: { _id: '$status', count: { $sum: 1 } } }
    ]);
    const methodBreakdown = await Payment.aggregate([
      { $group: { _id: '$method', count: { $sum: 1 } } }
    ]);

    res.json({
      success: true,
      data: {
        totalPayments,
        statusBreakdown,
        methodBreakdown
      }
    });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};
