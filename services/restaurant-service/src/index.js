// ============================================================
// SmartBite Restaurant Service
// ============================================================
// Microservice responsible for:
// - Restaurant management (CRUD)
// - Menu item management (CRUD)
// - Public browsing of restaurants and menus
//
// Database: smartbite_restaurants (MongoDB)
// Port: 4002
// ============================================================

const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
const connectDB = require('./config/db');
const restaurantRoutes = require('./routes/restaurantRoutes');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 4002;

// ---- Middleware ----
app.use(cors());
app.use(morgan('dev'));
app.use(express.json());

// ---- Health Check ----
app.get('/health', (req, res) => {
  res.json({
    service: 'Restaurant Service',
    status: 'healthy',
    timestamp: new Date().toISOString()
  });
});

// ---- Routes ----
app.use('/', restaurantRoutes);

// ---- Connect to DB and Start Server ----
const startServer = async () => {
  await connectDB();
  app.listen(PORT, () => {
    console.log(`\n🍽️  Restaurant Service running on port ${PORT}`);
    console.log(`💚 Health check: http://localhost:${PORT}/health\n`);
  });
};

startServer();
