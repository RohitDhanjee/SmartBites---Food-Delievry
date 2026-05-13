// ============================================================
// Admin Authorization Middleware
// ============================================================
// This middleware runs in individual services. It checks the 
// headers passed by the API Gateway to ensure the user has 
// the 'admin' role.
// ============================================================

const adminMiddleware = (req, res, next) => {
  console.log('--- Admin Middleware Check ---');
  console.log('Headers:', req.headers);
  const userRole = req.headers['x-user-role'];

  if (!userRole || userRole !== 'admin') {
    return res.status(403).json({
      success: false,
      message: 'Forbidden: Admin access required'
    });
  }

  next();
};

module.exports = adminMiddleware;
