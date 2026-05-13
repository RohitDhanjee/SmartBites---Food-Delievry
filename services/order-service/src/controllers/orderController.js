// ============================================================
// Order Controller
// ============================================================
// This is the MOST IMPORTANT controller for demonstrating
// INTER-SERVICE COMMUNICATION in the distributed system.
//
// When an order is created:
// 1. Order is saved to the orders database
// 2. HTTP request is made to Payment Service to process payment
// 3. HTTP request is made to Delivery Service to assign a rider
// 4. Order is updated with payment and delivery IDs
//
// This demonstrates synchronous inter-service communication
// using REST APIs — a core concept in distributed computing.
// ============================================================

const Order = require('../models/Order');
const axios = require('axios');

const PAYMENT_SERVICE = process.env.PAYMENT_SERVICE_URL;
const DELIVERY_SERVICE = process.env.DELIVERY_SERVICE_URL;

// ============================================================
// POST /create — Create a new order
// ============================================================
// This endpoint orchestrates multiple microservices:
// Order Service → Payment Service → Delivery Service
// ============================================================
exports.createOrder = async (req, res) => {
  try {
    const { restaurantId, restaurantName, items, totalAmount, deliveryAddress } = req.body;
    const userId = req.headers['x-user-id'] || req.body.userId;

    if (!userId) {
      return res.status(400).json({
        success: false,
        message: 'User ID is required'
      });
    }

    // Step 1: Create the order in our database
    const order = await Order.create({
      userId,
      restaurantId,
      restaurantName,
      items,
      totalAmount,
      deliveryAddress,
      status: 'placed'
    });

    console.log(`📦 Order ${order._id} created for user ${userId}`);

    // Step 2: Call Payment Service to process payment
    // This demonstrates INTER-SERVICE COMMUNICATION
    let paymentResult = null;
    try {
      const paymentResponse = await axios.post(`${PAYMENT_SERVICE}/pay`, {
        orderId: order._id.toString(),
        userId,
        amount: totalAmount,
        method: req.body.paymentMethod || 'card'
      });
      paymentResult = paymentResponse.data;
      
      if (paymentResult.success) {
        order.paymentId = paymentResult.data._id;
        order.status = 'confirmed';
        console.log(`💳 Payment processed: ${paymentResult.data._id}`);
      }
    } catch (payErr) {
      console.log(`⚠️  Payment Service unavailable, continuing with order: ${payErr.message}`);
      // Order continues even if payment service is down (fault tolerance)
    }

    // Step 3: Call Delivery Service to assign a rider
    // Another INTER-SERVICE COMMUNICATION example
    let deliveryResult = null;
    try {
      const deliveryResponse = await axios.post(`${DELIVERY_SERVICE}/assign`, {
        orderId: order._id.toString(),
        deliveryAddress
      });
      deliveryResult = deliveryResponse.data;
      
      if (deliveryResult.success) {
        order.deliveryId = deliveryResult.data._id;
        console.log(`🚴 Delivery assigned: ${deliveryResult.data._id}`);
      }
    } catch (delErr) {
      console.log(`⚠️  Delivery Service unavailable, continuing with order: ${delErr.message}`);
      // Order continues even if delivery service is down (fault tolerance)
    }

    // Save updated order with payment and delivery IDs
    await order.save();

    res.status(201).json({
      success: true,
      message: 'Order created successfully',
      data: {
        order,
        payment: paymentResult?.data || null,
        delivery: deliveryResult?.data || null
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to create order',
      error: error.message
    });
  }
};

// ============================================================
// GET /user/:userId — Get all orders for a user
// ============================================================
exports.getUserOrders = async (req, res) => {
  try {
    const userId = req.params.userId;
    const orders = await Order.find({ userId }).sort({ createdAt: -1 });
    
    res.json({
      success: true,
      count: orders.length,
      data: orders
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to fetch orders',
      error: error.message
    });
  }
};

// ============================================================
// GET /:orderId — Get single order details
// ============================================================
exports.getOrder = async (req, res) => {
  try {
    const order = await Order.findById(req.params.orderId);
    if (!order) {
      return res.status(404).json({
        success: false,
        message: 'Order not found'
      });
    }

    res.json({
      success: true,
      data: order
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to fetch order',
      error: error.message
    });
  }
};

// ============================================================
// PUT /status — Update order status
// ============================================================
exports.updateOrderStatus = async (req, res) => {
  try {
    const { orderId, status } = req.body;

    const order = await Order.findByIdAndUpdate(
      orderId,
      { status },
      { new: true, runValidators: true }
    );

    if (order && status === 'delivered') {
      try {
        const axios = require('axios');
        const points = Math.floor(order.totalAmount * 0.1);
        await axios.post(`${process.env.USER_SERVICE_URL || 'http://user-service:4001'}/add-points`, {
          userId: order.userId,
          points
        });
      } catch (err) {
        console.error('Points award failed:', err.message);
      }
    }

    if (!order) {
      return res.status(404).json({
        success: false,
        message: 'Order not found'
      });
    }

    res.json({
      success: true,
      message: `Order status updated to ${status}`,
      data: order
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to update order status',
      error: error.message
    });
  }
};

// ============================================================
// PUT /cancel/:orderId — Cancel an order
// ============================================================
exports.cancelOrder = async (req, res) => {
  try {
    const order = await Order.findById(req.params.orderId);
    if (!order) {
      return res.status(404).json({
        success: false,
        message: 'Order not found'
      });
    }

    if (['delivered', 'cancelled'].includes(order.status)) {
      return res.status(400).json({
        success: false,
        message: `Cannot cancel order with status: ${order.status}`
      });
    }

    order.status = 'cancelled';
    await order.save();

    res.json({
      success: true,
      message: 'Order cancelled successfully',
      data: order
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to cancel order',
      error: error.message
    });
  }
};
// ============================================================
// GET /analytics/stats — Get aggregated order stats (Admin)
// ============================================================
exports.getOrderStats = async (req, res) => {
  try {
    const totalOrders = await Order.countDocuments();
    const totalRevenue = await Order.aggregate([
      { $match: { status: { $ne: 'cancelled' } } },
      { $group: { _id: null, total: { $sum: '$totalAmount' } } }
    ]);

    const statusBreakdown = await Order.aggregate([
      { $group: { _id: '$status', count: { $sum: 1 } } }
    ]);

    // Daily trends (last 7 days)
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

    const dailyTrends = await Order.aggregate([
      { $match: { createdAt: { $gte: sevenDaysAgo } } },
      {
        $group: {
          _id: { $dateToString: { format: '%Y-%m-%d', date: '$createdAt' } },
          orders: { $sum: 1 },
          revenue: { $sum: '$totalAmount' }
        }
      },
      { $sort: { _id: 1 } }
    ]);

    res.json({
      success: true,
      data: {
        totalOrders,
        totalRevenue: totalRevenue[0]?.total || 0,
        statusBreakdown,
        dailyTrends
      }
    });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};
