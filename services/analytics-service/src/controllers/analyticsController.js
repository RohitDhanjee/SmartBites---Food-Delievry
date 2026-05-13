const axios = require('axios');

const ORDER_SERVICE = process.env.ORDER_SERVICE_URL;
const PAYMENT_SERVICE = process.env.PAYMENT_SERVICE_URL;
const RESTAURANT_SERVICE = process.env.RESTAURANT_SERVICE_URL;

exports.getDashboardStats = async (req, res) => {
  try {
    // Aggregate data from multiple microservices concurrently
    // This demonstrates the API AGGREGATION PATTERN
    const [orderRes, paymentRes, restaurantRes] = await Promise.allSettled([
      axios.get(`${ORDER_SERVICE}/analytics/stats`),
      axios.get(`${PAYMENT_SERVICE}/analytics/stats`),
      axios.get(`${RESTAURANT_SERVICE}/`)
    ]);

    const stats = {
      orders: orderRes.status === 'fulfilled' ? orderRes.value.data.data : null,
      payments: paymentRes.status === 'fulfilled' ? paymentRes.value.data.data : null,
      restaurants: restaurantRes.status === 'fulfilled' ? { count: restaurantRes.value.data.count } : null,
      timestamp: new Date().toISOString()
    };

    res.json({
      success: true,
      data: stats
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to aggregate analytics',
      error: error.message
    });
  }
};
