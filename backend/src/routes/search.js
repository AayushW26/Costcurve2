const express = require('express');
const { query, body, validationResult } = require('express-validator');
const router = express.Router();

// @route   POST /api/search
// @desc    Search for products across platforms
// @access  Public
router.post('/', [
  body('query').notEmpty().trim().withMessage('Search query is required'),
  body('filters').optional().isObject(),
  body('filters.category').optional().isIn(['fashion', 'electronics', 'home', 'books', 'all']),
  body('filters.budget').optional().isNumeric()
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        errors: errors.array()
      });
    }

    const { query: searchQuery, filters = {} } = req.body;
    const { category = 'all', budget } = filters;

    // Mock search results (replace with actual scraping logic)
    const mockResults = [
      {
        id: 1,
        name: `${searchQuery} - Premium Quality`,
        price: 2999,
        originalPrice: 4999,
        platform: 'Amazon',
        rating: 4.5,
        reviews: 1250,
        image: 'https://via.placeholder.com/300x300',
        url: '#',
        savings: 2000,
        dealScore: 85
      },
      {
        id: 2,
        name: `${searchQuery} - Best Value`,
        price: 1999,
        originalPrice: 2999,
        platform: 'eBay',
        rating: 4.2,
        reviews: 890,
        image: 'https://via.placeholder.com/300x300',
        url: '#',
        savings: 1000,
        dealScore: 75
      }
    ];

    res.json({
      success: true,
      products: mockResults,
      totalResults: mockResults.length,
      searchQuery,
      filters
    });

  } catch (error) {
    console.error('Search error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error during search'
    });
  }
});

// @route   GET /api/search/products
// @desc    Search for products across platforms
// @access  Public
router.get('/products', [
  query('q').notEmpty().trim().withMessage('Search query is required'),
  query('category').optional().isIn(['fashion', 'electronics', 'home', 'books', 'all']),
  query('budget').optional().isNumeric()
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        errors: errors.array()
      });
    }

    const { q: searchQuery, category = 'all', budget } = req.query;

    // Mock search results (replace with actual scraping logic)
    const mockResults = [
      {
        id: 1,
        name: `${searchQuery} - Premium Quality`,
        price: 2999,
        originalPrice: 4999,
        discount: 40,
        platform: 'Amazon',
        url: 'https://amazon.com/product/1',
        image: 'https://via.placeholder.com/200x200',
        rating: 4.5,
        reviews: 150,
        inStock: true,
        dealScore: 8.5
      },
      {
        id: 2,
        name: `${searchQuery} - Best Seller`,
        price: 3499,
        originalPrice: 3999,
        discount: 12,
        platform: 'Flipkart',
        url: 'https://flipkart.com/product/2',
        image: 'https://via.placeholder.com/200x200',
        rating: 4.2,
        reviews: 89,
        inStock: true,
        dealScore: 7.8
      }
    ];

    // Filter by budget if provided
    const filteredResults = budget ? 
      mockResults.filter(item => item.price <= parseInt(budget)) : 
      mockResults;

    res.json({
      success: true,
      query: searchQuery,
      category,
      budget: budget ? parseInt(budget) : null,
      totalResults: filteredResults.length,
      results: filteredResults,
      searchTime: Math.random() * 2 + 0.5 // Mock search time
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: 'Search failed'
    });
  }
});

// @route   GET /api/search/suggestions
// @desc    Get search suggestions
// @access  Public
router.get('/suggestions', [
  query('q').optional().trim()
], (req, res) => {
  const { q } = req.query;
  
  const suggestions = q ? [
    `${q} deals`,
    `${q} best price`,
    `${q} discount`,
    `cheap ${q}`,
    `${q} reviews`
  ] : [
    'smartphones',
    'laptops',
    'headphones',
    'watches',
    'shoes'
  ];

  res.json({
    success: true,
    suggestions: suggestions.slice(0, 5)
  });
});

module.exports = router;