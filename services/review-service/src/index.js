const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');
const reviewRoutes = require('./routes/reviewRoutes');

dotenv.config();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use('/', reviewRoutes);

// Health check
app.get('/health', (req, res) => {
  res.json({ status: 'Review Service is healthy' });
});

// Database connection
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log('📦 Review DB Connected'))
  .catch(err => console.error('❌ DB Error:', err));

const PORT = process.env.PORT || 4006;
app.listen(PORT, () => {
  console.log(`⭐ Review Service running on port ${PORT}`);
});
