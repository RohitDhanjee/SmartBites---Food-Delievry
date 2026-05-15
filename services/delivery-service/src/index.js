// ============================================================
// SmartBite Delivery Tracking Service
// ============================================================
// Microservice responsible for:
// - Rider assignment
// - Real-time delivery tracking via WebSockets (Socket.IO)
// - Delivery status management
// - Simulated GPS location updates
//
// Database: smartbite_delivery (MongoDB)
// Port: 4005
//
// KEY DISTRIBUTED COMPUTING CONCEPTS:
// 1. WebSocket Communication — bidirectional real-time data
// 2. Room-based targeting — events sent only to relevant clients
// 3. Event-driven architecture — status changes trigger events
//
// Socket.IO runs on the SAME port as the Express HTTP server.
// The HTTP server is "upgraded" to support WebSocket connections.
// ============================================================

// IMPORTANT: dotenv MUST be loaded FIRST, before any module that reads process.env
require('dotenv').config();

const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const cors = require('cors');
const morgan = require('morgan');
const connectDB = require('./config/db');
const deliveryRoutes = require('./routes/deliveryRoutes');
const { setupSocket } = require('./socket/trackingSocket');
const deliveryController = require('./controllers/deliveryController');

const app = express();
const PORT = process.env.PORT || 4005;

// ---- Create HTTP server ----
// Socket.IO requires an HTTP server instance to attach to
const server = http.createServer(app);

// ---- Setup Socket.IO ----
// CORS is configured to allow connections from the frontend
const io = new Server(server, {
  cors: {
    origin: '*',  // In production, restrict to specific origins
    methods: ['GET', 'POST']
  }
});

// Share the io instance with the controller so REST endpoints
// can also emit WebSocket events
deliveryController.setIO(io);

// Setup Socket.IO event handlers
setupSocket(io);

// ---- Middleware ----
app.use(cors());
app.use(morgan('dev'));
app.use(express.json());

// ---- Health Check ----
app.get('/health', (req, res) => {
  res.json({
    service: 'Delivery Tracking Service',
    status: 'healthy',
    connectedClients: io.engine.clientsCount,
    timestamp: new Date().toISOString()
  });
});

// ---- Routes ----
app.use('/', deliveryRoutes);

// ---- Connect to DB and Start Server ----
const startServer = async () => {
  await connectDB();
  // Note: We use server.listen() instead of app.listen()
  // because Socket.IO is attached to the HTTP server
  server.listen(PORT, () => {
    console.log(`\n🚴 Delivery Tracking Service running on port ${PORT}`);
    console.log(`🔌 WebSocket server ready for connections`);
    console.log(`💚 Health check: http://localhost:${PORT}/health\n`);
  });
};

startServer();
