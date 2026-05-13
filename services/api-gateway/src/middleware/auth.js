// ============================================================
// JWT Authentication Middleware
// ============================================================
// This middleware intercepts requests at the API Gateway level.
// It verifies the JWT token from the Authorization header
// and attaches the decoded user info to the request headers
// before forwarding to downstream microservices.
// ============================================================

const jwt = require('jsonwebtoken');

const authMiddleware = (req, res, next) => {
  // Extract token from Authorization header
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    // If no token, just continue. Downstream services will handle 
    // public vs protected access.
    return next();
  }

  const token = authHeader.split(' ')[1];

  try {
    // Verify the JWT token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    
    // Attach user info to headers so downstream services can access it
    req.headers['x-user-id'] = decoded.userId;
    req.headers['x-user-email'] = decoded.email;
    req.headers['x-user-role'] = decoded.role;
    
    console.log('--- Gateway Auth Middleware ---');
    console.log('Decoded Role:', decoded.role);
    console.log('Setting x-user-role:', req.headers['x-user-role']);
    
    next();
  } catch (error) {
    // Log WHY the token failed
    console.log('--- Gateway Auth FAILED ---');
    console.log('Token error:', error.message);
    console.log('JWT_SECRET used:', process.env.JWT_SECRET);
    // If token is invalid/expired, treat as unauthenticated
    next();
  }
};

module.exports = authMiddleware;
