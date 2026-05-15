// ============================================================
// SmartBite API Gateway
// ============================================================
// This is the SINGLE ENTRY POINT for the entire SmartBite
// distributed system. All client requests come here first.
//
// Responsibilities:
// 1. Route requests to the correct microservice
// 2. Handle JWT authentication
// 3. Provide CORS support
// 4. Log all incoming requests
//
// Architecture Pattern: API Gateway Pattern
// This pattern is fundamental in microservices architecture
// because it provides a unified interface to clients while
// hiding the complexity of the distributed backend.
// ============================================================

const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
const { createProxyMiddleware } = require('http-proxy-middleware');
const authMiddleware = require('./middleware/auth');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 4000;

// ---- Global Middleware (MUST BE FIRST) ----
app.use(cors());                 // Enable Cross-Origin requests from frontend
app.use(morgan('dev'));          // Log all HTTP requests for debugging

// ---- Security Middleware ----
app.use(helmet());               // Add security headers
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,      // 15 minutes
  max: 1000,                     // Increased to 1000 for development
  message: { success: false, message: 'Too many requests, please try again later.' }
});
app.use('/api/', limiter);        // Apply rate limit to all /api routes
// NOTE: Do NOT use express.json() here!
// The proxy forwards raw request bodies to downstream services.
// If we parse the body here, it gets consumed and the proxy
// sends an empty body to the microservice.

// ---- Health Check Endpoint ----
// Used by Docker and monitoring tools to verify the gateway is running
app.get('/health', (req, res) => {
  res.json({
    service: 'API Gateway',
    status: 'healthy',
    timestamp: new Date().toISOString(),
    uptime: process.uptime()
  });
});

// ============================================================
// PROXY ROUTES - Forward requests to microservices
// ============================================================
// Each route prefix maps to a specific microservice.
// The proxy middleware forwards the entire request
// (headers, body, query params) to the target service.
// ============================================================

// ---- Common Proxy Configuration ----
// This function ensures that custom headers set by authMiddleware 
// are correctly forwarded to downstream services.
const proxyOptions = (target, pathRewrite) => ({
  target,
  changeOrigin: true,
  pathRewrite,
  onProxyReq: (proxyReq, req, res) => {
    // Forward the custom headers set by authMiddleware
    if (req.headers['x-user-id']) proxyReq.setHeader('x-user-id', req.headers['x-user-id']);
    if (req.headers['x-user-role']) proxyReq.setHeader('x-user-role', req.headers['x-user-role']);
    if (req.headers['x-user-email']) proxyReq.setHeader('x-user-email', req.headers['x-user-email']);
    
    // Also forward the raw body if it was already parsed (though we disabled it)
    if (req.body && Object.keys(req.body).length) {
      const bodyData = JSON.stringify(req.body);
      proxyReq.setHeader('Content-Type', 'application/json');
      proxyReq.setHeader('Content-Length', Buffer.byteLength(bodyData));
      proxyReq.write(bodyData);
    }
  },
  onError: (err, req, res) => {
    res.status(503).json({
      success: false,
      message: 'Service is currently unavailable',
      error: err.message
    });
  }
});

// --- User Service ---
// Profile needs authentication, login/register are public
app.use('/api/users/profile', authMiddleware, createProxyMiddleware(proxyOptions(process.env.USER_SERVICE_URL, { '^/api/users/profile': '/profile' })));
app.use('/api/users', createProxyMiddleware(proxyOptions(process.env.USER_SERVICE_URL, { '^/api/users': '' })));

// Anyone can browse restaurants and menus, but management needs auth headers
app.use('/api/restaurants', authMiddleware, createProxyMiddleware(proxyOptions(process.env.RESTAURANT_SERVICE_URL, { '^/api/restaurants': '' })));

// --- Order Service (Protected) ---
app.use('/api/orders', authMiddleware, createProxyMiddleware(proxyOptions(process.env.ORDER_SERVICE_URL, { '^/api/orders': '' })));

// --- Payment Service (Protected) ---
app.use('/api/payments', authMiddleware, createProxyMiddleware(proxyOptions(process.env.PAYMENT_SERVICE_URL, { '^/api/payments': '' })));

// --- Delivery Service (Protected) ---
app.use('/api/delivery', authMiddleware, createProxyMiddleware(proxyOptions(process.env.DELIVERY_SERVICE_URL, { '^/api/delivery': '' })));

// --- Review Service (Protected) ---
app.use('/api/reviews', authMiddleware, createProxyMiddleware(proxyOptions(process.env.REVIEW_SERVICE_URL || 'http://review-service:4007', { '^/api/reviews': '' })));

// --- Analytics Service (Admin Only) ---
app.use('/api/analytics', authMiddleware, (req, res, next) => {
  // Extra security check for admin role
  if (req.headers['x-user-role'] !== 'admin') {
    return res.status(403).json({ success: false, message: 'Admin access required for analytics' });
  }
  next();
}, createProxyMiddleware(proxyOptions(process.env.ANALYTICS_SERVICE_URL || 'http://analytics-service:4006', { '^/api/analytics': '' })));


// ---- 404 Handler ----
app.use('*', (req, res) => {
  res.status(404).json({
    success: false,
    message: `Route ${req.originalUrl} not found on API Gateway`
  });
});

// ---- Start Server ----
app.listen(PORT, () => {
  console.log(`\n🚀 SmartBite API Gateway running on port ${PORT}`);
  console.log(`📡 Routing to services:`);
  console.log(`   → User Service:       ${process.env.USER_SERVICE_URL}`);
  console.log(`   → Restaurant Service: ${process.env.RESTAURANT_SERVICE_URL}`);
  console.log(`   → Order Service:      ${process.env.ORDER_SERVICE_URL}`);
  console.log(`   → Payment Service:    ${process.env.PAYMENT_SERVICE_URL}`);
  console.log(`   → Delivery Service:   ${process.env.DELIVERY_SERVICE_URL}`);
  console.log(`\n💚 Health check: http://localhost:${PORT}/health\n`);
});
