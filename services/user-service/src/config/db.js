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
    let uri = process.env.MONGO_URI;
    const dbName = 'smartbite_users';
    
    // Intelligent URI handling: If URI exists but doesn't have the specific DB name, 
    // and it's an Atlas URI (mongodb+srv), we need to handle the query parameters.
    if (uri && !uri.includes(dbName)) {
      if (uri.includes('?')) {
        const [base, query] = uri.split('?');
        uri = `${base.replace(/\/$/, '')}/${dbName}?${query}`;
      } else {
        uri = `${uri.replace(/\/$/, '')}/${dbName}`;
      }
    }

    const conn = await mongoose.connect(uri || `mongodb://localhost:27017/${dbName}`);
    console.log(`📦 User DB Connected: ${conn.connection.host}/${conn.connection.name}`);
  } catch (error) {
    console.error(`❌ MongoDB Connection Error: ${error.message}`);
    process.exit(1); // Exit process with failure
  }
};

module.exports = connectDB;
