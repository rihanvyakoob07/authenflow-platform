
const express = require('express');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const { registerValidation, loginValidation } = require('../utils/validation');
const auth = require('../middleware/auth');

const router = express.Router();

// Register new user
router.post('/register', async (req, res) => {
  try {
    // Validate request data
    const { error } = registerValidation(req.body);
    if (error) {
      return res.status(400).json({ message: error.details[0].message });
    }

    // Check if user already exists
    const emailExists = await User.findOne({ email: req.body.email });
    if (emailExists) {
      return res.status(400).json({ message: 'Email already exists' });
    }

    // Create new user
    const user = new User({
      name: req.body.name,
      email: req.body.email,
      password: req.body.password
    });

    // Save user to database
    const savedUser = await user.save();

    // Generate JWT token
    const token = jwt.sign(
      { userId: savedUser._id },
      process.env.JWT_SECRET || 'your-secret-key',
      { expiresIn: '1d' }
    );

    // Return user data and token
    res.status(201).json({
      user: {
        id: savedUser._id,
        name: savedUser.name,
        email: savedUser.email
      },
      token
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Login user
router.post('/login', async (req, res) => {
  try {
    // Validate request data
    const { error } = loginValidation(req.body);
    if (error) {
      return res.status(400).json({ message: error.details[0].message });
    }

    // Check if user exists
    const user = await User.findOne({ email: req.body.email });
    if (!user) {
      return res.status(400).json({ message: 'Invalid email or password' });
    }

    // Check password
    const validPassword = await user.comparePassword(req.body.password);
    if (!validPassword) {
      return res.status(400).json({ message: 'Invalid email or password' });
    }

    // Generate JWT token
    const token = jwt.sign(
      { userId: user._id },
      process.env.JWT_SECRET || 'your-secret-key',
      { expiresIn: '1d' }
    );

    // Return user data and token
    res.json({
      user: {
        id: user._id,
        name: user.name,
        email: user.email
      },
      token
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get current user
router.get('/me', auth, async (req, res) => {
  try {
    const user = await User.findById(req.userId).select('-password');
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    res.json(user);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
