const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const analyticsController = require('./controllers/analyticsController');

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

// Routes
app.get('/dashboard', analyticsController.getDashboardStats);

// Health check
app.get('/health', (req, res) => {
  res.json({ status: 'Analytics Service is healthy' });
});

const PORT = process.env.PORT || 4006;
app.listen(PORT, () => {
  console.log(`📊 Analytics Service running on port ${PORT}`);
});
