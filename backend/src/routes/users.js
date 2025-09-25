const express = require('express');
const router = express.Router();

// Example: Get user profile (mock)
router.get('/profile', (req, res) => {
  res.json({ success: true, user: { id: 1, username: 'testuser', email: 'test@example.com' } });
});

// TODO: Add more user-related endpoints as needed

module.exports = router;
