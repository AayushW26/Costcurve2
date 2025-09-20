import React from 'react';
import './Footer.css';

const Footer = () => {
  return (
    <footer className="footer">
      <div className="container">
        <div className="footer-content">
          <div className="footer-section">
            <h4><i className="fas fa-chart-line"></i> Cost Curve</h4>
            <p>Strike the best deals with smart price tracking</p>
          </div>
          
          <div className="footer-section">
            <h5>Features</h5>
            <ul>
              <li>Price Comparison</li>
              <li>Price Predictions</li>
              <li>Deal Alerts</li>
              <li>Watchlist</li>
            </ul>
          </div>
          
          <div className="footer-section">
            <h5>Support</h5>
            <ul>
              <li>Help Center</li>
              <li>Contact Us</li>
              <li>Privacy Policy</li>
              <li>Terms of Service</li>
            </ul>
          </div>
        </div>
        
        <div className="footer-bottom">
          <p>&copy; 2025 Cost Curve. Smart shopping made simple.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;