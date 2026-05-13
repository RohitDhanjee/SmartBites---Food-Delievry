// ============================================================
// User Service Routes
// ============================================================
// Defines all HTTP endpoints for the User Service.
// Input validation is performed using express-validator
// before the request reaches the controller.
// ============================================================

const express = require('express');
const router = express.Router();
const { body, validationResult } = require('express-validator');
const userController = require('../controllers/userController');

// ---- Validation Middleware ----
const validate = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({
      success: false,
      message: 'Validation failed',
      errors: errors.array()
    });
  }
  next();
};

// ---- POST /register ----
// Creates a new user account
// Validates: name (2-50 chars), email (valid format), password (6+ chars)
router.post('/register', [
  body('name').trim().isLength({ min: 2, max: 50 }).withMessage('Name must be 2-50 characters'),
  body('email').isEmail().withMessage('Please enter a valid email'),
  body('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters'),
  validate
], userController.register);

// ---- POST /login ----
// Authenticates user and returns JWT token
router.post('/login', [
  body('email').isEmail().withMessage('Please enter a valid email'),
  body('password').notEmpty().withMessage('Password is required'),
  validate
], userController.login);

// ---- GET /profile ----
// Returns the authenticated user's profile
// Note: Authentication is handled at the API Gateway level
router.get('/profile', userController.getProfile);
router.put('/profile', userController.updateProfile);
router.delete('/profile', userController.deleteProfile);
router.post('/add-points', userController.addPoints);

module.exports = router;
