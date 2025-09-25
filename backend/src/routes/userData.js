
const express = require('express');
const User = require('../models/User');
const router = express.Router();

// Clear user's search history
router.delete('/:username/search-history', async (req, res) => {
  try {
    const user = await User.findOneAndUpdate(
      { username: req.params.username },
      { $set: { searchHistory: [] } },
      { new: true }
    );
    res.json({ success: true, searchHistory: user ? user.searchHistory : [] });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// Save a search to user's search history
router.post('/:username/search-history', async (req, res) => {
  const { query, filters } = req.body;
  try {
    const user = await User.findOneAndUpdate(
      { username: req.params.username },
      { $push: { searchHistory: { query, filters } } },
      { new: true, upsert: true }
    );
    res.json({ success: true, searchHistory: user.searchHistory });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// Get user's search history
router.get('/:username/search-history', async (req, res) => {
  try {
    const user = await User.findOne({ username: req.params.username });
    res.json({ success: true, searchHistory: user ? user.searchHistory : [] });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// Add item to cart
router.post('/:username/cart', async (req, res) => {
  const item = req.body;
  try {
    const user = await User.findOneAndUpdate(
      { username: req.params.username },
      { $push: { cart: item } },
      { new: true, upsert: true }
    );
    res.json({ success: true, cart: user.cart });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// Get user's cart
router.get('/:username/cart', async (req, res) => {
  try {
    const user = await User.findOne({ username: req.params.username });
    res.json({ success: true, cart: user ? user.cart : [] });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// Remove item from cart by productId
router.delete('/:username/cart/:productId', async (req, res) => {
  try {
    const user = await User.findOneAndUpdate(
      { username: req.params.username },
      { $pull: { cart: { productId: req.params.productId } } },
      { new: true }
    );
    res.json({ success: true, cart: user ? user.cart : [] });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

module.exports = router;