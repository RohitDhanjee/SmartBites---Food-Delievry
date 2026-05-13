// ============================================================
// User Model (Mongoose Schema)
// ============================================================
// Defines the structure of user documents in MongoDB.
// Uses bcrypt for password hashing — passwords are NEVER
// stored in plain text. The pre-save hook automatically
// hashes the password before saving to the database.
// ============================================================

const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Name is required'],
    trim: true,
    minlength: 2,
    maxlength: 50
  },
  email: {
    type: String,
    required: [true, 'Email is required'],
    unique: true,
    lowercase: true,
    trim: true,
    match: [/^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/, 'Please enter a valid email']
  },
  password: {
    type: String,
    required: [true, 'Password is required'],
    minlength: 6
  },
  phone: {
    type: String,
    default: ''
  },
  address: {
    type: String,
    default: ''
  },
  role: {
    type: String,
    enum: ['customer', 'admin'],
    default: 'customer'
  },
  loyaltyPoints: {
    type: Number,
    default: 0
  }
}, {
  timestamps: true  // Automatically adds createdAt and updatedAt
});

// ---- Pre-save Hook: Hash password before saving ----
// This runs BEFORE every save operation.
// If the password hasn't changed, skip hashing.
userSchema.pre('save', async function(next) {
  if (!this.isModified('password')) return next();
  
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

// ---- Instance Method: Compare passwords ----
// Used during login to verify the entered password
// against the stored hashed password.
userSchema.methods.comparePassword = async function(candidatePassword) {
  return await bcrypt.compare(candidatePassword, this.password);
};

// ---- Remove password from JSON output ----
// When sending user data to the client, never include the password
userSchema.methods.toJSON = function() {
  const user = this.toObject();
  delete user.password;
  return user;
};

module.exports = mongoose.model('User', userSchema);
