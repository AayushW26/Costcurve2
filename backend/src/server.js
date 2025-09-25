const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const compression = require('compression');
const cookieParser = require('cookie-parser');
const rateLimit = require('express-rate-limit');
require('dotenv').config();

// Import routes
const authRoutes = require('./routes/auth');
const userRoutes = require('./routes/users');
const productRoutes = require('./routes/products');
const searchRoutes = require('./routes/search');

const alertRoutes = require('./routes/alerts');
const scrapingRoutes = require('./routes/scraping');
const userDataRoutes = require('./routes/userData');

// Import middleware
const errorHandler = require('./middleware/errorHandler');
const { auth, optionalAuth } = require('./middleware/auth');


// MongoDB connection with error handling
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/costcurve';

// Add connection timeout and error handling
const connectToMongoDB = async () => {
  try {
    await mongoose.connect(MONGODB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      serverSelectionTimeoutMS: 5000, // Timeout after 5s instead of 30s
      connectTimeoutMS: 10000, // Give up initial connection after 10s
    });
    console.log('✅ Connected to MongoDB');
  } catch (error) {
    console.error('❌ MongoDB connection failed:', error.message);
    console.log('⚠️  Server will continue running without database functionality');
    console.log('📝 To fix: Update MONGODB_URI in .env or start MongoDB locally');
  }
};

// Connect to MongoDB (non-blocking)
connectToMongoDB();

mongoose.connection.on('connected', () => {
  console.log('✅ MongoDB connection established');
});

mongoose.connection.on('error', (err) => {
  console.error('❌ MongoDB error:', err.message);
});

mongoose.connection.on('disconnected', () => {
  console.log('⚠️  MongoDB disconnected');
});

const app = express();
const PORT = process.env.PORT || 5000;

// Trust proxy for rate limiting
app.set('trust proxy', 1);

// Security middleware
app.use(helmet());

// CORS configuration
app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:3000',
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With']
}));

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: process.env.NODE_ENV === 'production' ? 100 : 1000, // limit each IP to 100 requests per windowMs in production
  message: 'Too many requests from this IP, please try again later.',
  standardHeaders: true,
  legacyHeaders: false,
});
app.use('/api/', limiter);

// Body parsing middleware
app.use(express.json({ limit: '10mb' }));

// User data routes (search history, cart)
app.use('/api/user', userDataRoutes);
app.use(express.urlencoded({ extended: true, limit: '10mb' }));
app.use(cookieParser());

// Compression middleware
app.use(compression());

// Logging middleware
app.use(morgan(process.env.NODE_ENV === 'production' ? 'combined' : 'dev'));

// Health check endpoint
app.get('/health', (req, res) => {
  res.status(200).json({
    status: 'OK',
    message: 'Cost Curve API is running',
    timestamp: new Date().toISOString(),
    version: process.env.npm_package_version || '1.0.0'
  });
});

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/users', auth, userRoutes);
app.use('/api/products', productRoutes);
app.use('/api/search', searchRoutes);
app.use('/api/alerts', auth, alertRoutes);
app.use('/api/scraping', scrapingRoutes);

// API documentation route (placeholder)
app.get('/api', (req, res) => {
  res.json({
    message: 'Welcome to Cost Curve API',
    version: '1.0.0',
    endpoints: {
      auth: '/api/auth',
      users: '/api/users',
      products: '/api/products',
      search: '/api/search',
      alerts: '/api/alerts',
      scraping: '/api/scraping'
    },
    documentation: '/api/docs' // Future implementation
  });
});

// 404 handler for undefined routes
app.use('*', (req, res) => {
  res.status(404).json({
    success: false,
    message: 'Route not found',
    path: req.originalUrl
  });
});

// Global error handler (must be last)
app.use(errorHandler);

// Graceful shutdown handling
process.on('SIGTERM', () => {
  console.log('SIGTERM received. Shutting down gracefully...');
  process.exit(0);
});

process.on('SIGINT', () => {
  console.log('SIGINT received. Shutting down gracefully...');
  process.exit(0);
});

// Start server
if (require.main === module) {
  app.listen(PORT, () => {
    console.log(`🚀 Cost Curve API Server running on port ${PORT}`);
    console.log(`📊 Environment: ${process.env.NODE_ENV || 'development'}`);
    console.log(`🔗 Health Check: http://localhost:${PORT}/health`);
    console.log(`📚 API Docs: http://localhost:${PORT}/api`);
  });
}

module.exports = app;