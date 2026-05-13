// ============================================================
// Socket.IO Real-Time Tracking Module
// ============================================================
// This module implements REAL-TIME COMMUNICATION using
// WebSockets (via Socket.IO). This is a KEY requirement
// for the distributed computing course.
//
// How it works:
// 1. Client connects via WebSocket to track an order
// 2. Client joins a ROOM specific to their order ID
// 3. Server simulates delivery progress with timed events
// 4. Events are emitted ONLY to the specific order room
//
// Events emitted:
// - rider_assigned: Rider has been assigned
// - order_picked: Rider has picked up the order
// - location_update: Rider location changed (simulated)
// - order_delivered: Delivery complete
//
// This demonstrates:
// - Bi-directional real-time communication
// - Room-based event targeting
// - WebSocket protocol (upgrade from HTTP)
// ============================================================

const Delivery = require('../models/Delivery');

// Simulated rider pool — in a real system, this would be
// a separate Rider Service with actual rider data
const riders = [
  { id: 'R001', name: 'Ahmed Khan', phone: '0300-1234567' },
  { id: 'R002', name: 'Ali Raza', phone: '0321-2345678' },
  { id: 'R003', name: 'Hassan Ali', phone: '0333-3456789' },
  { id: 'R004', name: 'Usman Malik', phone: '0345-4567890' },
  { id: 'R005', name: 'Bilal Ahmed', phone: '0312-5678901' }
];

const setupSocket = (io) => {
  io.on('connection', (socket) => {
    console.log(`🔌 Client connected: ${socket.id}`);

    // ---- Client requests to track an order ----
    // The client sends the orderId, and we join them to a room
    socket.on('track_order', async (data) => {
      const { orderId } = data;
      console.log(`👁️  Client ${socket.id} tracking order: ${orderId}`);
      
      // Join the client to a room for this specific order
      socket.join(`order_${orderId}`);
      
      // Fetch current delivery status
      const delivery = await Delivery.findOne({ orderId });
      if (delivery) {
        socket.emit('delivery_status', {
          orderId,
          status: delivery.status,
          rider: {
            name: delivery.riderName,
            phone: delivery.riderPhone
          },
          estimatedTime: delivery.estimatedTime,
          location: delivery.location
        });
      }
    });

    // ---- Simulate delivery progress ----
    // This is called after an order is assigned to a rider.
    // It simulates the delivery lifecycle with timed events.
    socket.on('start_simulation', async (data) => {
      const { orderId } = data;
      simulateDelivery(io, orderId);
    });

    socket.on('disconnect', () => {
      console.log(`🔌 Client disconnected: ${socket.id}`);
    });
  });
};

// ============================================================
// Delivery Simulation
// ============================================================
// Simulates the delivery lifecycle with realistic timing.
// Each status change is emitted as a WebSocket event to
// all clients tracking this specific order.
// ============================================================
const updateOrderService = async (orderId, status) => {
  try {
    const axios = require('axios');
    const ORDER_SERVICE = process.env.ORDER_SERVICE_URL || 'http://order-service:4003';
    await axios.put(`${ORDER_SERVICE}/status`, { orderId, status });
    console.log(`Synced order ${orderId} status to: ${status}`);
  } catch (err) {
    console.error(`Sync failed for ${status}:`, err.message);
  }
};

const simulateDelivery = async (io, orderId) => {
  const room = `order_${orderId}`;

  // 1. Picking (5s) -> Preparing
  setTimeout(async () => {
    await Delivery.findOneAndUpdate({ orderId }, { status: 'picking', estimatedTime: 25 });
    io.to(room).emit('delivery_update', { orderId, status: 'picking', message: '🏍️ Rider is heading to the restaurant', estimatedTime: 25 });
    await updateOrderService(orderId, 'preparing');
  }, 5000);

  // 2. Picked (10s) -> Picked
  setTimeout(async () => {
    await Delivery.findOneAndUpdate({ orderId }, { status: 'picked', estimatedTime: 15, location: { lat: 24.8650, lng: 67.0050 } });
    io.to(room).emit('delivery_update', { orderId, status: 'picked', message: '📦 Rider has picked up your order!', estimatedTime: 15 });
    await updateOrderService(orderId, 'picked');
  }, 10000);

  // 3. Delivering (15s)
  setTimeout(async () => {
    await Delivery.findOneAndUpdate({ orderId }, { status: 'delivering', estimatedTime: 10, location: { lat: 24.8700, lng: 67.0100 } });
    io.to(room).emit('delivery_update', { orderId, status: 'delivering', message: '🚴 Rider is on the way!', estimatedTime: 10 });
  }, 15000);

  // 4. Delivered (25s) -> Delivered
  setTimeout(async () => {
    await Delivery.findOneAndUpdate({ orderId }, { status: 'delivered', estimatedTime: 0, location: { lat: 24.8800, lng: 67.0200 } });
    io.to(room).emit('delivery_update', { orderId, status: 'delivered', message: '✅ Your order has been delivered!', estimatedTime: 0 });
    await updateOrderService(orderId, 'delivered');
  }, 25000);
};

module.exports = { setupSocket, riders, simulateDelivery };
