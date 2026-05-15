const mongoose = require('mongoose');

const connectDB = async () => {
  try {
    let uri = process.env.MONGO_URI;
    const dbName = 'smartbite_payments';
    
    if (uri && !uri.includes(dbName)) {
      if (uri.includes('?')) {
        const [base, query] = uri.split('?');
        uri = `${base.replace(/\/$/, '')}/${dbName}?${query}`;
      } else {
        uri = `${uri.replace(/\/$/, '')}/${dbName}`;
      }
    }

    const conn = await mongoose.connect(uri || `mongodb://localhost:27017/${dbName}`);
    console.log(`📦 Payment DB Connected: ${conn.connection.host}/${conn.connection.name}`);
  } catch (error) {
    console.error(`❌ MongoDB Connection Error: ${error.message}`);
    process.exit(1);
  }
};

module.exports = connectDB;
