// ============================================================
// SmartBite Order Service
// ============================================================
// Microservice responsible for:
// - Order creation and management
// - Inter-service communication with Payment & Delivery services
// - Order status tracking
// - Order history
//
// Database: smartbite_orders (MongoDB)
// Port: 4003
//
// KEY DISTRIBUTED COMPUTING CONCEPT:
// This service demonstrates SERVICE ORCHESTRATION — it
// coordinates multiple services (Payment, Delivery) to
// complete a business transaction.
// ============================================================

// IMPORTANT: dotenv MUST be loaded FIRST, before any module that reads process.env
// Otherwise, PAYMENT_SERVICE_URL and DELIVERY_SERVICE_URL will be undefined
// when orderController.js is first loaded.
require('dotenv').config();

const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
const connectDB = require('./config/db');
const orderRoutes = require('./routes/orderRoutes');

const app = express();
const PORT = process.env.PORT || 4003;

// ---- Middleware ----
app.use(cors());
app.use(morgan('dev'));
app.use(express.json());

// ---- Health Check ----
app.get('/health', (req, res) => {
  res.json({
    service: 'Order Service',
    status: 'healthy',
    timestamp: new Date().toISOString()
  });
});

// ---- Routes ----
app.use('/', orderRoutes);

// ---- Connect to DB and Start Server ----
const startServer = async () => {
  await connectDB();
  app.listen(PORT, () => {
    console.log(`\n📦 Order Service running on port ${PORT}`);
    console.log(`💚 Health check: http://localhost:${PORT}/health\n`);
  });
};

startServer();
