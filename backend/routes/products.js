
const express = require('express');
const Product = require('../models/Product');
const auth = require('../middleware/auth');
const router = express.Router();

// Middleware to check if user is admin
const isAdmin = async (req, res, next) => {
  try {
    const user = await require('../models/User').findById(req.userId);
    if (user.role !== 'admin') {
      return res.status(403).json({ message: 'Access denied. Admin privileges required.' });
    }
    next();
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get all products
router.get('/', async (req, res) => {
  try {
    const products = await Product.find({});
    res.json(products);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get single product by ID
router.get('/:id', async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }
    res.json(product);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Create new product (admin only)
router.post('/', auth, isAdmin, async (req, res) => {
  try {
    const product = new Product({
      title: req.body.title,
      description: req.body.description,
      images: req.body.images,
      price: req.body.price,
      category: req.body.category,
      inStock: req.body.inStock,
      purchaseLink: req.body.purchaseLink
    });
    
    const newProduct = await product.save();
    res.status(201).json(newProduct);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Update product (admin only)
router.put('/:id', auth, isAdmin, async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }

    product.title = req.body.title || product.title;
    product.description = req.body.description || product.description;
    product.images = req.body.images || product.images;
    product.price = req.body.price || product.price;
    product.category = req.body.category || product.category;
    product.inStock = req.body.inStock !== undefined ? req.body.inStock : product.inStock;
    product.purchaseLink = req.body.purchaseLink || product.purchaseLink;

    const updatedProduct = await product.save();
    res.json(updatedProduct);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Delete product (admin only)
router.delete('/:id', auth, isAdmin, async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }

    await product.deleteOne();
    res.json({ message: 'Product removed' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Add review to product
router.post('/:id/reviews', auth, async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }

    const user = await require('../models/User').findById(req.userId);
    
    const review = {
      user: req.userId,
      name: user.name,
      rating: req.body.rating,
      comment: req.body.comment
    };

    product.reviews.push(review);

    // Update product rating
    product.numReviews = product.reviews.length;
    product.rating = product.reviews.reduce((acc, item) => item.rating + acc, 0) / product.reviews.length;

    const updatedProduct = await product.save();
    res.status(201).json(updatedProduct);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Record product click (for analytics)
router.post('/:id/click', async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }

    product.clicks += 1;
    await product.save();
    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Add fake reviews (admin only)
router.post('/:id/fake-reviews', auth, isAdmin, async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }

    const fakeReviews = req.body.reviews;
    if (!Array.isArray(fakeReviews)) {
      return res.status(400).json({ message: 'Reviews must be an array' });
    }

    // Add fake reviews
    product.reviews = [...product.reviews, ...fakeReviews];

    // Update product rating
    product.numReviews = product.reviews.length;
    product.rating = product.reviews.reduce((acc, item) => item.rating + acc, 0) / product.reviews.length;

    const updatedProduct = await product.save();
    res.status(201).json(updatedProduct);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

module.exports = router;
