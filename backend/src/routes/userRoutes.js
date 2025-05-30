const express = require('express');
const router = express.Router();
const { check } = require('express-validator');
const { auth, adminAuth } = require('../middleware/auth');
const {
  register,
  login,
  getProfile,
  getAllUsers,
  updateUser,
  deleteUser
} = require('../controllers/userController');

// Register route
router.post(
  '/register',
  [
    check('username', 'Username is required').not().isEmpty(),
    check('email', 'Please include a valid email').isEmail(),
    check('password', 'Please enter a password with 6 or more characters').isLength({ min: 6 })
  ],
  register
);

// Login route
router.post(
  '/login',
  [
    check('email', 'Please include a valid email').isEmail(),
    check('password', 'Password is required').exists()
  ],
  login
);

// Get profile route
router.get('/profile', auth, getProfile);

// Admin routes
router.get('/users', auth, adminAuth, getAllUsers);
router.put('/users/:id', auth, adminAuth, updateUser);
router.delete('/users/:id', auth, adminAuth, deleteUser);

module.exports = router; 