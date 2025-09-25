const express = require('express');
const router = express.Router();

// Scraping routes placeholder
router.post('/scrape-product', (req, res) => {
  res.json({ message: 'Product scraping endpoint - to be implemented' });
});

router.get('/supported-sites', (req, res) => {
  res.json({ 
    message: 'Supported sites list',
    sites: ['amazon', 'flipkart', 'myntra', 'bigbasket'] 
  });
});

module.exports = router;