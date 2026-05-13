// ============================================================
// User Controller
// ============================================================
// Contains the business logic for user operations:
// - register: Create a new user account
// - login: Authenticate and return JWT token
// - getProfile: Get user profile by ID
//
// Each function handles its own error cases and returns
// appropriate HTTP status codes.
// ============================================================

const User = require('../models/User');
const jwt = require('jsonwebtoken');

// ---- Helper: Generate JWT Token ----
const generateToken = (user) => {
  return jwt.sign(
    {
      userId: user._id,
      email: user.email,
      role: user.role
    },
    process.env.JWT_SECRET,
    { expiresIn: process.env.JWT_EXPIRES_IN || '24h' }
  );
};

// ============================================================
// POST /register — Create a new user account
// ============================================================
exports.register = async (req, res) => {
  try {
    const { name, email, password, phone, address } = req.body;

    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: 'User with this email already exists'
      });
    }

    // Create new user (password is automatically hashed by pre-save hook)
    const user = await User.create({
      name,
      email,
      password,
      phone,
      address
    });

    // Generate JWT token for immediate login after registration
    const token = generateToken(user);

    res.status(201).json({
      success: true,
      message: 'User registered successfully',
      data: {
        user: user.toJSON(),
        token
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Registration failed',
      error: error.message
    });
  }
};

// ============================================================
// POST /login — Authenticate user and return JWT
// ============================================================
exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Validate input
    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: 'Email and password are required'
      });
    }

    // Find user by email
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'Invalid email or password'
      });
    }

    // Verify password using bcrypt comparison
    const isPasswordValid = await user.comparePassword(password);
    if (!isPasswordValid) {
      return res.status(401).json({
        success: false,
        message: 'Invalid email or password'
      });
    }

    // Generate JWT token
    const token = generateToken(user);

    res.json({
      success: true,
      message: 'Login successful',
      data: {
        user: user.toJSON(),
        token
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Login failed',
      error: error.message
    });
  }
};

// ============================================================
// GET /profile — Get authenticated user's profile
// ============================================================
exports.getProfile = async (req, res) => {
  try {
    // x-user-id is set by the API Gateway's auth middleware
    const userId = req.headers['x-user-id'];

    if (!userId) {
      return res.status(401).json({
        success: false,
        message: 'User ID not found in request'
      });
    }

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    res.json({
      success: true,
      data: user.toJSON()
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to fetch profile',
      error: error.message
    });
  }
};

// ============================================================
// PUT /profile — Update user's profile details
// ============================================================
exports.updateProfile = async (req, res) => {
  try {
    const userId = req.headers['x-user-id'];
    const { name, phone, address } = req.body;

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }

    if (name) user.name = name;
    if (phone) user.phone = phone;
    if (address) user.address = address;

    await user.save();

    res.json({
      success: true,
      message: 'Profile updated successfully',
      data: user.toJSON()
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to update profile',
      error: error.message
    });
  }
};

// ============================================================
// DELETE /profile — Delete user account
// ============================================================
exports.deleteProfile = async (req, res) => {
  try {
    const userId = req.headers['x-user-id'];
    
    const user = await User.findByIdAndDelete(userId);
    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }

    res.json({
      success: true,
      message: 'Account deleted successfully'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to delete account',
      error: error.message
    });
  }
};

// ============================================================
// POST /add-points — Add loyalty points (Internal use)
// ============================================================
exports.addPoints = async (req, res) => {
  try {
    const { userId, points } = req.body;
    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ success: false });

    user.loyaltyPoints += points;
    await user.save();

    res.json({ success: true, points: user.loyaltyPoints });
  } catch (error) {
    res.status(500).json({ success: false });
  }
};
