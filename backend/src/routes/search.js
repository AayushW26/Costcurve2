const express = require('express');
const { query, body, validationResult } = require('express-validator');
const { spawn } = require('child_process');
const path = require('path');
const router = express.Router();

// @route   POST /api/search
// @desc    Search for products across platforms using Python scraper
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
    const startTime = Date.now();

    // Call Python scraper
    const scraperPath = path.join(__dirname, '../../scraper.py');
    const python = spawn('python', [scraperPath, searchQuery]);

    let data = '';
    let errorData = '';

    python.stdout.on('data', (chunk) => {
      data += chunk.toString();
    });

    python.stderr.on('data', (chunk) => {
      errorData += chunk.toString();
    });

    python.on('close', (code) => {
      const searchTime = (Date.now() - startTime) / 1000;

      if (code !== 0) {
        console.error('Python scraper error:', errorData);
        return res.status(500).json({
          success: false,
          message: 'Scraper failed',
          error: errorData
        });
      }

      try {
        clearTimeout(timeout); // Clear timeout since we got a response
        
        const scraperResult = JSON.parse(data);

        if (!scraperResult.success) {
          return res.status(500).json({
            success: false,
            message: 'Scraper returned error',
            error: scraperResult.error
          });
        }

        // Filter by budget if provided
        let filteredResults = scraperResult.products;
        if (budget) {
          filteredResults = scraperResult.products.filter(item => item.price <= parseInt(budget));
        }

        // Format results for frontend compatibility
        const formattedResults = filteredResults.map(product => ({
          id: product.id,
          name: product.title,
          price: product.price,
          originalPrice: Math.floor(product.price * 1.2),
          platform: product.platform,
          rating: product.rating,
          reviews: product.reviews,
          image: product.image,
          url: product.url,
          savings: Math.floor(product.price * 0.2),
          dealScore: product.dealScore,
          inStock: product.availability === 'In Stock',
          shipping: product.shipping
        }));

        res.json({
          success: true,
          products: formattedResults,
          totalResults: formattedResults.length,
          searchQuery,
          filters,
          searchTime: searchTime,
          scrapedAt: new Date().toISOString()
        });

      } catch (parseError) {
        clearTimeout(timeout); // Clear timeout on error too
        console.error('Error parsing scraper result:', parseError);
        console.error('Raw data:', data);
        
        if (!res.headersSent) {
          res.status(500).json({
            success: false,
            message: 'Failed to parse scraper results',
            error: parseError.message
          });
        }
      }
    });

    // Timeout after 90 seconds (scraping multiple sites takes time)
    const timeout = setTimeout(() => {
      python.kill();
      if (!res.headersSent) {
        res.status(408).json({
          success: false,
          message: 'Search timeout - please try again with a simpler query'
        });
      }
    }, 90000);

  } catch (error) {
    console.error('Search error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error during search',
      error: error.message
    });
  }
});

// @route   GET /api/search/products
// @desc    Search for products across platforms using Python scraper
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
    const startTime = Date.now();

    // Call Python scraper
    const scraperPath = path.join(__dirname, '../../scraper.py');
    const python = spawn('python', [scraperPath, searchQuery]);

    let data = '';
    let errorData = '';

    python.stdout.on('data', (chunk) => {
      data += chunk.toString();
    });

    python.stderr.on('data', (chunk) => {
      errorData += chunk.toString();
    });

    python.on('close', (code) => {
      const searchTime = (Date.now() - startTime) / 1000;

      if (code !== 0) {
        console.error('Python scraper error:', errorData);
        return res.status(500).json({
          success: false,
          message: 'Scraper failed',
          error: errorData
        });
      }

      try {
        clearTimeout(timeout); // Clear timeout since we got a response
        
        const scraperResult = JSON.parse(data);

        if (!scraperResult.success) {
          return res.status(500).json({
            success: false,
            message: 'Scraper returned error',
            error: scraperResult.error
          });
        }

        // Filter by budget if provided
        let filteredResults = scraperResult.products;
        if (budget) {
          filteredResults = scraperResult.products.filter(item => item.price <= parseInt(budget));
        }

        // Enhance results with additional data for frontend
        const enhancedResults = filteredResults.map(product => ({
          ...product,
          originalPrice: Math.floor(product.price * 1.2), // Mock original price (20% higher)
          discount: Math.floor(Math.random() * 30) + 10, // Mock discount 10-40%
          inStock: product.availability === 'In Stock',
          name: product.title, // Map title to name for consistency
        }));

        res.json({
          success: true,
          query: searchQuery,
          category,
          budget: budget ? parseInt(budget) : null,
          totalResults: enhancedResults.length,
          results: enhancedResults,
          searchTime: searchTime,
          scrapedAt: new Date().toISOString()
        });

      } catch (parseError) {
        clearTimeout(timeout); // Clear timeout on error too
        console.error('Error parsing scraper result:', parseError);
        console.error('Raw data:', data);
        
        if (!res.headersSent) {
          res.status(500).json({
            success: false,
            message: 'Failed to parse scraper results',
            error: parseError.message
          });
        }
      }
    });

    // Timeout after 90 seconds (scraping multiple sites takes time)
    const timeout = setTimeout(() => {
      python.kill();
      if (!res.headersSent) {
        res.status(408).json({
          success: false,
          message: 'Search timeout - please try again with a simpler query'
        });
      }
    }, 90000);

  } catch (error) {
    console.error('Search route error:', error);
    res.status(500).json({
      success: false,
      message: 'Search failed',
      error: error.message
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