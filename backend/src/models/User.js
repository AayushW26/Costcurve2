const mongoose = require('mongoose');

const CartItemSchema = new mongoose.Schema({
  productId: String,
  title: String,
  price: Number,
  image: String,
  url: String,
  platform: String,
  quantity: { type: Number, default: 1 },
}, { _id: false });

const SearchHistorySchema = new mongoose.Schema({
  query: String,
  filters: Object,
  searchedAt: { type: Date, default: Date.now },
}, { _id: false });

const UserSchema = new mongoose.Schema({
  username: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  searchHistory: [SearchHistorySchema],
  cart: [CartItemSchema],
});

module.exports = mongoose.model('User', UserSchema);