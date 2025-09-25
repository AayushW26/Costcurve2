import React from 'react';
import { useAuth } from '../../context/AuthContext';
import ProductCard from '../../components/ProductCard/ProductCard';
import PriceChart from '../../components/PriceChart/PriceChart';
import SavingsChart from '../../components/SavingsChart/SavingsChart';
import SearchHistory from '../../components/SearchHistory/SearchHistory';
import './Dashboard.css';

const Dashboard = () => {
  const { user, isAuthenticated } = useAuth();

  if (!isAuthenticated) {
    return (
      <div className="dashboard-page">
        <div className="not-authenticated">
          <div className="container">
            <i className="fas fa-lock"></i>
            <h3>Please Login</h3>
            <p>You need to be logged in to access your dashboard.</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="dashboard-page">
      <div className="container">
        {/* Dashboard Header */}
        <div className="dashboard-header">
          <h2>Welcome back, {user.username}! 👋</h2>
          <p>Manage your watchlist, alerts, and price tracking</p>
        </div>

        {/* Search History Section */}
        <SearchHistory />

        {/* Stats Cards */}
        <div className="stats-grid">
          <div className="stat-card">
            <div className="stat-icon">
              <i className="fas fa-eye"></i>
            </div>
            <div className="stat-info">
              <div className="stat-number">{user.watchlist?.length || 0}</div>
              <div className="stat-label">Items Watched</div>
            </div>
          </div>
          
          <div className="stat-card">
            <div className="stat-icon">
              <i className="fas fa-bell"></i>
            </div>
            <div className="stat-info">
              <div className="stat-number">{user.alerts?.length || 0}</div>
              <div className="stat-label">Active Alerts</div>
            </div>
          </div>
          
          <div className="stat-card">
            <div className="stat-icon">
              <i className="fas fa-piggy-bank"></i>
            </div>
            <div className="stat-info">
              <div className="stat-number">₹12,500</div>
              <div className="stat-label">Money Saved</div>
            </div>
          </div>
          
          <div className="stat-card">
            <div className="stat-icon">
              <i className="fas fa-chart-line"></i>
            </div>
            <div className="stat-info">
              <div className="stat-number">15</div>
              <div className="stat-label">Deals Found</div>
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="quick-actions">
          <h3>Quick Actions</h3>
          <div className="actions-grid">
            <button className="action-btn">
              <i className="fas fa-search"></i>
              <span>Search Products</span>
            </button>
            <button className="action-btn">
              <i className="fas fa-bell"></i>
              <span>Manage Alerts</span>
            </button>
            <button className="action-btn">
              <i className="fas fa-cog"></i>
              <span>Settings</span>
            </button>
            <button className="action-btn">
              <i className="fas fa-download"></i>
              <span>Export Data</span>
            </button>
          </div>
        </div>

        {/* Analytics Section */}
        <div className="analytics-section">
          <h3>Your Analytics</h3>
          <div className="analytics-grid">
            <div className="chart-item">
              <SavingsChart />
            </div>
            <div className="chart-item">
              <PriceChart 
                productName="Sample Tracked Product"
                currentPrice={25999}
                priceHistory={[
                  { date: '2024-01-01', price: 28999 },
                  { date: '2024-01-15', price: 27500 },
                  { date: '2024-02-01', price: 26800 },
                  { date: '2024-02-15', price: 26200 },
                  { date: '2024-03-01', price: 25800 },
                  { date: '2024-03-15', price: 26100 },
                  { date: '2024-04-01', price: 25999 }
                ]}
              />
            </div>
          </div>
        </div>

        {/* Watchlist Section */}
        <div className="watchlist-section">
          <div className="section-header">
            <h3>Your Watchlist</h3>
            <p>Track prices and get notified of deals</p>
          </div>
          
          {user.watchlist && user.watchlist.length > 0 ? (
            <div className="watchlist-grid">
              {user.watchlist.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          ) : (
            <div className="empty-state">
              <i className="fas fa-heart"></i>
              <h4>Your watchlist is empty</h4>
              <p>Start adding products to track their prices and get the best deals!</p>
              <button className="cta-btn" onClick={() => window.location.href = '/'}>
                Start Shopping
              </button>
            </div>
          )}
        </div>

        {/* Recent Alerts */}
        <div className="alerts-section">
          <h3>Recent Price Alerts</h3>
          
          {user.alerts && user.alerts.length > 0 ? (
            <div className="alerts-list">
              {user.alerts.map((alert, index) => (
                <div key={index} className="alert-item">
                  <div className="alert-icon">
                    <i className="fas fa-bell"></i>
                  </div>
                  <div className="alert-content">
                    <h5>{alert.productTitle}</h5>
                    <p>Target price: ₹{alert.targetPrice?.toLocaleString()}</p>
                  </div>
                  <div className="alert-status active">
                    Active
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="empty-state">
              <i className="fas fa-bell-slash"></i>
              <h4>No active alerts</h4>
              <p>Set up price alerts to get notified when prices drop!</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;