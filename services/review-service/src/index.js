const dotenv = require('dotenv');
dotenv.config();

const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const reviewRoutes = require('./routes/reviewRoutes');

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
let mongoUri = process.env.MONGO_URI;
const dbName = 'smartbite_reviews';
if (mongoUri && !mongoUri.includes(dbName)) {
  if (mongoUri.includes('?')) {
    const [base, query] = mongoUri.split('?');
    mongoUri = `${base.replace(/\/$/, '')}/${dbName}?${query}`;
  } else {
    mongoUri = `${mongoUri.replace(/\/$/, '')}/${dbName}`;
  }
}

mongoose.connect(mongoUri || `mongodb://localhost:27017/${dbName}`)
  .then(() => console.log('📦 Review DB Connected'))
  .catch(err => console.error('❌ DB Error:', err));

const PORT = process.env.PORT || 4007;
app.listen(PORT, () => {
  console.log(`⭐ Review Service running on port ${PORT}`);
});
