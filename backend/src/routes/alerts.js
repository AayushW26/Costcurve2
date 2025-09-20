const express = require('express');
const router = express.Router();

// Alerts routes placeholder
router.get('/', (req, res) => {
  res.json({ message: 'Price alerts list endpoint - to be implemented' });
});

router.post('/', (req, res) => {
  res.json({ message: 'Create price alert endpoint - to be implemented' });
});

module.exports = router;