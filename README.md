# Cost Curve - Smart Price Comparison Platform

## 🎯 Project Overview

Cost Curve is a comprehensive price tracking and comparison platform built with React frontend and Node.js backend. It helps users find the best deals across multiple e-commerce platforms through intelligent web scraping, price prediction, and real-time alerts.

## 🏗️ Project Structure

```
Cost Curve/
├── frontend/                    # React application
│   ├── public/
│   ├── src/
│   │   ├── components/         # Reusable React components
│   │   │   ├── Header/
│   │   │   ├── SearchSection/
│   │   │   ├── ProductCard/
│   │   │   ├── LoginModal/
│   │   │   ├── PriceChart/
│   │   │   ├── DealScore/
│   │   │   ├── Footer/
│   │   │   └── Notifications/
│   │   ├── pages/              # Main application pages
│   │   │   ├── Home/
│   │   │   ├── Results/
│   │   │   └── Dashboard/
│   │   ├── context/            # React Context for state management
│   │   │   ├── AuthContext.js
│   │   │   └── AppContext.js
│   │   ├── hooks/              # Custom React hooks
│   │   ├── services/           # API service functions
│   │   └── styles/             # Global CSS styles
│   └── package.json
├── backend/                     # Node.js API server
│   ├── src/
│   │   ├── routes/             # Express route handlers
│   │   ├── models/             # Database models
│   │   ├── services/           # Business logic services
│   │   ├── middleware/         # Express middleware
│   │   └── server.js           # Main server file
│   └── package.json
├── legacy/                      # Original HTML/CSS/JS files (backup)
│   ├── index.html
│   ├── styles.css
│   └── script.js
└── README.md                    # This file
```

## 🚀 Key Features

### ✅ Implemented (Frontend)
- **React Component Architecture** - Modular, reusable components
- **Responsive Design** - Works on desktop, tablet, and mobile
- **User Authentication** - Login/signup with session management
- **Price Comparison Display** - Product cards with detailed information
- **Deal Scoring System** - AI-powered deal quality ratings
- **Real-time Notifications** - Toast notifications for user feedback
- **Search Functionality** - URL and keyword-based product search
- **Watchlist Management** - Save and track favorite products
- **Price Alerts** - Budget-based notification system
- **Interactive Charts** - Price history visualization
- **User Dashboard** - Personal watchlist and alert management

### 🔄 Ready for Backend Integration
- **RESTful API Structure** - Complete backend scaffolding
- **Web Scraping Services** - Framework for multi-platform scraping
- **Database Models** - User, Product, Alert, and Price history models
- **Authentication System** - JWT-based secure authentication
- **Email Notifications** - Price alert email system
- **Rate Limiting** - API protection and security
- **Cron Jobs** - Scheduled price monitoring

## 🛠️ Technology Stack

### Frontend
- **React 18** - Modern React with hooks and context
- **React Router** - Client-side routing
- **CSS3** - Custom responsive styling
- **FontAwesome** - Icon library
- **Canvas API** - Custom chart rendering

### Backend
- **Node.js** - JavaScript runtime
- **Express.js** - Web application framework
- **MongoDB** - NoSQL database
- **Mongoose** - MongoDB ODM
- **JWT** - Authentication tokens
- **Puppeteer** - Web scraping
- **Cheerio** - HTML parsing
- **Nodemailer** - Email notifications
- **Helmet** - Security middleware
- **Morgan** - HTTP logging

## 🏃‍♂️ Quick Start

### Prerequisites
- Node.js (v16 or higher)
- npm or yarn
- MongoDB (local or cloud)

### Frontend Setup
```bash
cd frontend
npm install
npm start
```
The React app will run on `http://localhost:3000`

### Backend Setup
```bash
cd backend
npm install
cp .env.example .env
# Edit .env with your configuration
npm run dev
```
The API server will run on `http://localhost:5000`

## 📱 Usage Examples

### 1. Search for Products
- Enter product URL or search term in the search bar
- Set optional budget for price alerts
- View results across multiple platforms

### 2. Compare Prices
- See real-time prices from different retailers
- View total cost including shipping and taxes
- Check stock availability and deal scores

### 3. Track Price History
- Interactive charts show price trends
- AI-powered predictions for future prices
- Optimal buying recommendations

### 4. Manage Watchlist
- Save products to personal watchlist
- Set custom price alert thresholds
- Receive notifications when prices drop

## 🔧 Configuration

### Environment Variables
Create `.env` file in backend directory:
```env
NODE_ENV=development
PORT=5000
MONGODB_URI=mongodb://localhost:27017/costcurve
JWT_SECRET=your-secret-key
EMAIL_USER=your-email@gmail.com
EMAIL_PASS=your-app-password
```

### Database Setup
1. Install MongoDB locally or use MongoDB Atlas
2. Update `MONGODB_URI` in `.env`
3. The app will create collections automatically

## 🧪 Testing

### Frontend Testing
```bash
cd frontend
npm test
```

### Backend Testing
```bash
cd backend
npm test
```

## 📈 Future Enhancements

### Phase 1 (Current)
- [x] React frontend conversion
- [x] Component-based architecture
- [x] User authentication
- [x] Basic price comparison

### Phase 2 (Planned)
- [ ] Web scraping implementation
- [ ] Real-time price monitoring
- [ ] Email notification system
- [ ] Advanced filtering and sorting

### Phase 3 (Future)
- [ ] Mobile app (React Native)
- [ ] Browser extension
- [ ] Price prediction ML model
- [ ] Social features and sharing
- [ ] Bulk import/export tools

## 🔒 Security Features

- **Helmet.js** - Security headers
- **Rate Limiting** - API protection
- **Input Validation** - XSS and injection prevention
- **JWT Authentication** - Secure user sessions
- **CORS Configuration** - Cross-origin protection
- **Environment Variables** - Secure configuration

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📝 API Documentation

### Authentication Endpoints
- `POST /api/auth/register` - User registration
- `POST /api/auth/login` - User login
- `POST /api/auth/logout` - User logout
- `GET /api/auth/me` - Get current user

### Product Endpoints
- `GET /api/products/search` - Search products
- `GET /api/products/:id` - Get product details
- `POST /api/products/:id/track` - Add to watchlist

### Alert Endpoints
- `GET /api/alerts` - Get user alerts
- `POST /api/alerts` - Create price alert
- `DELETE /api/alerts/:id` - Delete alert

## 🐛 Known Issues

- Chart rendering needs Chart.js integration for better visuals
- Web scraping requires proxy rotation for scale
- Price prediction model needs training data
- Mobile responsive design needs fine-tuning

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 👥 Team

- **Frontend Development** - React components and user interface
- **Backend Development** - API design and database architecture
- **Web Scraping** - Multi-platform data extraction
- **DevOps** - Deployment and infrastructure

## 🙏 Acknowledgments

- React community for excellent documentation
- FontAwesome for icons
- Express.js team for robust framework
- MongoDB for flexible database solution

---

**Status**: ✅ React conversion complete, ready for backend integration
**Version**: 1.0.0
**Last Updated**: September 2025