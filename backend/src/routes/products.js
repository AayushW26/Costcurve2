const express = require('express');
const { param, validationResult } = require('express-validator');
const router = express.Router();

// @route   GET /api/products
// @desc    Get trending products
// @access  Public
router.get('/', (req, res) => {
  const trendingProducts = [
    {
      id: 1,
      name: 'iPhone 15 Pro',
      category: 'electronics',
      avgPrice: 129900,
      platforms: ['Amazon', 'Flipkart', 'Apple Store'],
      trending: true
    },
    {
      id: 2,
      name: 'Nike Air Max',
      category: 'fashion',
      avgPrice: 8999,
      platforms: ['Nike', 'Amazon', 'Myntra'],
      trending: true
    }
  ];

  res.json({
    success: true,
    products: trendingProducts
  });
});

// @route   GET /api/products/:id
// @desc    Get product details and price history
// @access  Public
router.get('/:id', [
  param('id').isNumeric().withMessage('Invalid product ID')
], (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({
      success: false,
      errors: errors.array()
    });
  }

  const { id } = req.params;
  
  // Mock product details
  const product = {
    id: parseInt(id),
    name: 'Sample Product',
    description: 'High-quality product with excellent reviews',
    category: 'electronics',
    currentPrices: [
      { platform: 'Amazon', price: 2999, url: 'https://amazon.com' },
      { platform: 'Flipkart', price: 3199, url: 'https://flipkart.com' }
    ],
    priceHistory: [
      { date: '2025-09-01', price: 3499 },
      { date: '2025-09-10', price: 3199 },
      { date: '2025-09-20', price: 2999 }
    ],
    bestPrice: 2999,
    savings: 500
  };

  res.json({
    success: true,
    product
  });
});

module.exports = router;