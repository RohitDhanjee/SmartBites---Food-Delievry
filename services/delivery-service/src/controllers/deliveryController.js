// ============================================================
// Delivery Controller
// ============================================================
// Manages delivery assignments and status updates.
// When a rider is assigned, the delivery simulation can be
// triggered via WebSocket to show real-time progress.
// ============================================================

const Delivery = require('../models/Delivery');
const { riders, simulateDelivery } = require('../socket/trackingSocket');

// Store io instance for emitting events from REST endpoints
let ioInstance = null;

exports.setIO = (io) => {
  ioInstance = io;
};

// ============================================================
// POST /assign — Assign a rider to an order
// ============================================================
// Called by the Order Service when a new order is created.
// This demonstrates inter-service communication.
// ============================================================
exports.assignRider = async (req, res) => {
  try {
    const { orderId, deliveryAddress } = req.body;

    // Check if delivery already exists for this order
    const existing = await Delivery.findOne({ orderId });
    if (existing) {
      return res.json({
        success: true,
        message: 'Delivery already assigned',
        data: existing
      });
    }

    // Randomly assign a rider from the pool
    const rider = riders[Math.floor(Math.random() * riders.length)];
    const estimatedTime = 20 + Math.floor(Math.random() * 25); // 20-45 minutes

    const delivery = await Delivery.create({
      orderId,
      riderId: rider.id,
      riderName: rider.name,
      riderPhone: rider.phone,
      status: 'assigned',
      estimatedTime,
      deliveryAddress
    });

    console.log(`🚴 Rider ${rider.name} assigned to order ${orderId}`);

    // Emit WebSocket event to notify the client
    if (ioInstance) {
      ioInstance.to(`order_${orderId}`).emit('delivery_update', {
        orderId,
        status: 'assigned',
        message: `🚴 ${rider.name} has been assigned as your rider!`,
        rider: { name: rider.name, phone: rider.phone },
        estimatedTime
      });

      // Start the delivery simulation automatically
      simulateDelivery(ioInstance, orderId);
    }

    res.status(201).json({
      success: true,
      message: 'Rider assigned successfully',
      data: delivery
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to assign rider',
      error: error.message
    });
  }
};

// ============================================================
// GET /:orderId — Get delivery status for an order
// ============================================================
exports.getDeliveryStatus = async (req, res) => {
  try {
    const delivery = await Delivery.findOne({ orderId: req.params.orderId });
    if (!delivery) {
      return res.status(404).json({
        success: false,
        message: 'Delivery not found for this order'
      });
    }

    res.json({
      success: true,
      data: delivery
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to fetch delivery status',
      error: error.message
    });
  }
};

// ============================================================
// PUT /status — Update delivery status manually
// ============================================================
exports.updateDeliveryStatus = async (req, res) => {
  try {
    const { orderId, status } = req.body;

    const delivery = await Delivery.findOneAndUpdate(
      { orderId },
      { status },
      { new: true }
    );

    if (!delivery) {
      return res.status(404).json({
        success: false,
        message: 'Delivery not found'
      });
    }

    // Emit WebSocket event for status update
    if (ioInstance) {
      ioInstance.to(`order_${orderId}`).emit('delivery_update', {
        orderId,
        status,
        message: `Delivery status updated to: ${status}`
      });
    }

    res.json({
      success: true,
      message: `Delivery status updated to ${status}`,
      data: delivery
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to update delivery status',
      error: error.message
    });
  }
};
