// ============================================================
// SmartBite Payment Service
// ============================================================
// Microservice responsible for:
// - Simulated payment processing
// - Payment status tracking
// - Transaction logging
//
// Database: smartbite_payments (MongoDB)
// Port: 4004
//
// NOTE: This uses MOCK payment logic. No real money is
// processed. This is suitable for an academic project.
// ============================================================

// IMPORTANT: dotenv MUST be loaded FIRST, before any module that reads process.env
require('dotenv').config();

const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
const connectDB = require('./config/db');
const paymentRoutes = require('./routes/paymentRoutes');

const app = express();
const PORT = process.env.PORT || 4004;

// ---- Middleware ----
app.use(cors());
app.use(morgan('dev'));
app.use(express.json());

// ---- Health Check ----
app.get('/health', (req, res) => {
  res.json({
    service: 'Payment Service',
    status: 'healthy',
    timestamp: new Date().toISOString()
  });
});

// ---- Routes ----
app.use('/', paymentRoutes);

// ---- Connect to DB and Start Server ----
const startServer = async () => {
  await connectDB();
  app.listen(PORT, () => {
    console.log(`\n💳 Payment Service running on port ${PORT}`);
    console.log(`💚 Health check: http://localhost:${PORT}/health\n`);
  });
};

startServer();
