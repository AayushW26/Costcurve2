import React from 'react';
import { useAuth } from '../../context/AuthContext';
import { useApp } from '../../context/AppContext';
import './ProductCard.css';

const ProductCard = ({ product }) => {
  const { user, updateUser, isAuthenticated } = useAuth();
  const { showNotification } = useApp();

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR'
    }).format(amount);
  };

  const handleViewDeal = () => {
    if (!product.inStock) {
      showNotification(`${product.title} is currently out of stock on ${product.platform}`, 'info');
      return;
    }
    
    showNotification(`Redirecting to ${product.platform}...`, 'info');
    // In real app, this would open the actual product link
    window.open(product.link, '_blank');
  };

  const handleAddToWatchlist = () => {
    if (!isAuthenticated) {
      showNotification('Please login to add items to watchlist', 'warning');
      return;
    }

    const isAlreadyInWatchlist = user.watchlist?.some(item => item.id === product.id);
    
    if (isAlreadyInWatchlist) {
      showNotification('Item already in watchlist', 'info');
      return;
    }

    const updatedWatchlist = [...(user.watchlist || []), product];
    updateUser({ watchlist: updatedWatchlist });
    showNotification(`${product.title} added to watchlist!`, 'success');
  };

  const getStockStatus = () => {
    return product.inStock ? {
      text: '✓ In Stock',
      className: 'in-stock'
    } : {
      text: '✗ Out of Stock',
      className: 'out-of-stock'
    };
  };

  const stockStatus = getStockStatus();

  return (
    <div className="product-card">
      <div className="product-image-container">
        <img 
          src={product.image} 
          alt={product.title}
          onError={(e) => {
            e.target.src = 'https://via.placeholder.com/300x200?text=Product+Image';
          }}
        />
        {product.discount && (
          <div className="discount-badge">
            {product.discount}% OFF
          </div>
        )}
      </div>

      <div className="product-info">
        <h4 className="product-title">{product.title}</h4>
        
        <div className="price-section">
          <div className="current-price">{formatCurrency(product.price)}</div>
          {product.originalPrice && product.originalPrice > product.price && (
            <div className="original-price">{formatCurrency(product.originalPrice)}</div>
          )}
        </div>

        <div className="platform-info">
          <i className="fas fa-store"></i>
          <span>{product.platform}</span>
        </div>

        <div className="cost-breakdown">
          <div className="cost-item">
            <span>Shipping: </span>
            <span>{product.shippingCost === 0 ? 'Free' : formatCurrency(product.shippingCost)}</span>
          </div>
          <div className="cost-item total-cost">
            <span>Total: </span>
            <span>{formatCurrency(product.totalCost)}</span>
          </div>
        </div>

        <div className={`stock-status ${stockStatus.className}`}>
          {stockStatus.text}
        </div>

        {product.dealScore && (
          <div className="deal-score">
            <span>Deal Score: </span>
            <span className={`score ${product.dealScore >= 8 ? 'excellent' : product.dealScore >= 6 ? 'good' : 'fair'}`}>
              {product.dealScore.toFixed(1)}/10
            </span>
          </div>
        )}
      </div>

      <div className="product-actions">
        <button
          onClick={handleViewDeal}
          className={`view-deal-btn ${!product.inStock ? 'disabled' : ''}`}
          disabled={!product.inStock}
        >
          {product.inStock ? 'View Deal' : 'Notify When Available'}
        </button>
        
        <button
          onClick={handleAddToWatchlist}
          className="watchlist-btn"
        >
          <i className="fas fa-eye"></i>
          Add to Watchlist
        </button>
      </div>
    </div>
  );
};

export default ProductCard;