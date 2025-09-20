import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useApp } from '../../context/AppContext';
import { useAuth } from '../../context/AuthContext';
import './SearchSection.css';

const SearchSection = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [enableAlerts, setEnableAlerts] = useState(false);
  const [budget, setBudget] = useState('');
  
  const { searchProducts, isSearching } = useApp();
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();

  const isValidUrl = (string) => {
    try {
      new URL(string);
      return true;
    } catch (_) {
      return false;
    }
  };

  const handleSearch = async () => {
    if (!searchQuery.trim()) {
      alert('Please enter a product URL or search term');
      return;
    }

    if (!isValidUrl(searchQuery) && searchQuery.length < 3) {
      alert('Please enter a valid URL or search term');
      return;
    }

    const budgetValue = budget ? parseInt(budget) : null;
    const filters = budgetValue ? { budget: budgetValue } : {};
    await searchProducts(searchQuery, filters);
    
    // Navigate to results page
    navigate('/results');
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      handleSearch();
    }
  };

  const handleAlertsChange = (e) => {
    if (!isAuthenticated && e.target.checked) {
      alert('Please login to enable price alerts');
      return;
    }
    setEnableAlerts(e.target.checked);
  };

  return (
    <div className="search-section">
      <div className="search-input-group">
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          onKeyPress={handleKeyPress}
          placeholder="Paste product URL or enter search term..."
          className="search-input"
          disabled={isSearching}
        />
        <button
          onClick={handleSearch}
          className="search-btn"
          disabled={isSearching}
        >
          <i className="fas fa-search"></i>
          {isSearching ? 'Searching...' : 'Track Price'}
        </button>
      </div>
      
      <div className="search-options">
        <label className="checkbox-label">
          <input
            type="checkbox"
            checked={enableAlerts}
            onChange={handleAlertsChange}
            disabled={isSearching}
          />
          Enable price alerts
          {!isAuthenticated && <span className="login-required"> (Login required)</span>}
        </label>
        
        <input
          type="number"
          value={budget}
          onChange={(e) => setBudget(e.target.value)}
          placeholder="Set budget (₹)"
          className="budget-input"
          disabled={isSearching}
          min="0"
        />
      </div>
    </div>
  );
};

export default SearchSection;