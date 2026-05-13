// ============================================================
// SmartBite User Service
// ============================================================
// Microservice responsible for:
// - User registration with password hashing
// - User login with JWT token generation
// - User profile management
//
// Database: smartbite_users (MongoDB)
// Port: 4001
//
// This service demonstrates the SINGLE RESPONSIBILITY
// principle — it only handles user-related operations.
// ============================================================

const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
const connectDB = require('./config/db');
const userRoutes = require('./routes/userRoutes');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 4001;

// ---- Middleware ----
app.use(cors());
app.use(morgan('dev'));
app.use(express.json());

// ---- Health Check ----
app.get('/health', (req, res) => {
  res.json({
    service: 'User Service',
    status: 'healthy',
    timestamp: new Date().toISOString()
  });
});

// ---- Routes ----
app.use('/', userRoutes);

// ---- Connect to DB and Start Server ----
const startServer = async () => {
  await connectDB();
  app.listen(PORT, () => {
    console.log(`\n👤 User Service running on port ${PORT}`);
    console.log(`💚 Health check: http://localhost:${PORT}/health\n`);
  });
};

startServer();
