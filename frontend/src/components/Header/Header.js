import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import LoginModal from '../LoginModal/LoginModal';
import './Header.css';

const Header = () => {
  const { user, logout, isAuthenticated } = useAuth();
  const [showLoginModal, setShowLoginModal] = useState(false);
  const location = useLocation();

  const handleLoginClick = () => {
    if (isAuthenticated) {
      // Show user menu or logout
      const shouldLogout = window.confirm(
        `Hello ${user.username}!\n\nWatchlist: ${user.watchlist?.length || 0} items\nAlerts: ${user.alerts?.length || 0} active\n\nClick OK to logout, Cancel to continue`
      );
      if (shouldLogout) {
        logout();
      }
    } else {
      setShowLoginModal(true);
    }
  };

  const isActiveLink = (path) => {
    if (path === '/') return location.pathname === '/';
    return location.pathname.startsWith(path);
  };

  return (
    <>
      <header className="header">
        <div className="container">
          <div className="nav-brand">
            <Link to="/" className="brand-link">
              <h1>
                <i className="fas fa-chart-line"></i> Cost Curve
              </h1>
              <p className="tagline">Strike the Best Deals with Smart Price Tracking</p>
            </Link>
          </div>
          <nav className="nav-menu">
            <Link 
              to="/" 
              className={`nav-link ${isActiveLink('/') ? 'active' : ''}`}
            >
              Home
            </Link>
            <Link 
              to="/results" 
              className={`nav-link ${isActiveLink('/results') ? 'active' : ''}`}
            >
              Results
            </Link>
            {isAuthenticated && (
              <Link 
                to="/dashboard" 
                className={`nav-link ${isActiveLink('/dashboard') ? 'active' : ''}`}
              >
                Dashboard
              </Link>
            )}
            <button 
              onClick={handleLoginClick}
              className="nav-link login-btn"
            >
              {isAuthenticated ? `👋 ${user.username}` : 'Login'}
            </button>
          </nav>
        </div>
      </header>

      {showLoginModal && (
        <LoginModal 
          isOpen={showLoginModal}
          onClose={() => setShowLoginModal(false)}
        />
      )}
    </>
  );
};

export default Header;