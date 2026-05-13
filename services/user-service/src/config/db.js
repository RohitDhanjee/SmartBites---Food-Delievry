// ============================================================
// MongoDB Connection Configuration
// ============================================================
// Each microservice connects to its OWN database.
// This ensures DATA ISOLATION — a core principle of
// microservices architecture. If the User Service database
// goes down, other services continue to function.
// ============================================================

const mongoose = require('mongoose');

const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGO_URI);
    console.log(`📦 MongoDB Connected: ${conn.connection.host}/${conn.connection.name}`);
  } catch (error) {
    console.error(`❌ MongoDB Connection Error: ${error.message}`);
    process.exit(1); // Exit process with failure
  }
};

module.exports = connectDB;
