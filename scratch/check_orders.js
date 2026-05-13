const mongoose = require('mongoose');

const checkOrders = async () => {
  try {
    await mongoose.connect('mongodb://localhost:27017/smartbite_orders');
    const Order = mongoose.model('Order', new mongoose.Schema({}, { strict: false, collection: 'orders' }));
    
    const count = await Order.countDocuments();
    console.log('Total Orders:', count);
    
    const recent = await Order.find().sort({ createdAt: -1 }).limit(5);
    recent.forEach(o => {
      console.log(`Order: ${o._id}, Status: ${o.status}, CreatedAt: ${o.createdAt}`);
    });
    
    process.exit(0);
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
};

checkOrders();
