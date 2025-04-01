
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');
const authRoutes = require('./routes/auth');
const productRoutes = require('./routes/products');

// Load environment variables
dotenv.config();

// Create Express app
const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Connect to MongoDB
mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/fullstack-marketplace')
  .then(() => console.log('Connected to MongoDB'))
  .catch(err => console.error('MongoDB connection error:', err));

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/products', productRoutes);

// Analytics routes
app.get('/api/analytics/summary', async (req, res) => {
  try {
    const Product = require('./models/Product');
    const User = require('./models/User');
    
    const userCount = await User.countDocuments({ role: 'user' });
    const productCount = await Product.countDocuments();
    const totalClicks = await Product.aggregate([
      { $group: { _id: null, totalClicks: { $sum: '$clicks' } } }
    ]);
    
    res.json({
      users: userCount,
      products: productCount,
      clicks: totalClicks.length > 0 ? totalClicks[0].totalClicks : 0
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ message: 'Something went wrong!' });
});

// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
