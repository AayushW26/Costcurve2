import React from 'react';
import { useApp } from '../../context/AppContext';
import ProductCard from '../../components/ProductCard/ProductCard';
import PriceChart from '../../components/PriceChart/PriceChart';
import DealScore from '../../components/DealScore/DealScore';
import './Results.css';

const Results = () => {
  const { searchResults, isSearching } = useApp();

  // All hooks must be called at the top level, before any early returns
  const bestDeal = React.useMemo(() => {
    if (!searchResults || searchResults.length === 0) return null;
    return searchResults.reduce((best, current) => 
      (current.price || current.totalCost || 0) < (best.price || best.totalCost || 0) ? current : best
    );
  }, [searchResults]);

  const maxSavings = React.useMemo(() => {
    if (!searchResults || searchResults.length === 0) return 0;
    const prices = searchResults.map(p => p.price || p.totalCost || 0);
    return Math.max(...prices) - Math.min(...prices);
  }, [searchResults]);

  const inStockCount = React.useMemo(() => {
    if (!searchResults || searchResults.length === 0) return 0;
    return searchResults.filter(p => p.inStock).length;
  }, [searchResults]);

  const avgDiscount = React.useMemo(() => {
    if (!searchResults || searchResults.length === 0) return 0;
    return Math.round(searchResults.reduce((acc, p) => acc + (p.discount || 0), 0) / searchResults.length);
  }, [searchResults]);

  // Early returns after all hooks are called
  if (isSearching) {
    return (
      <div className="results-page">
        <div className="loading-container">
          <div className="loading-spinner">
            <div className="spinner"></div>
            <p>Analyzing prices across platforms...</p>
          </div>
        </div>
      </div>
    );
  }

  if (!searchResults || searchResults.length === 0) {
    return (
      <div className="results-page">
        <div className="no-results">
          <div className="container">
            <i className="fas fa-search"></i>
            <h3>No Results Yet</h3>
            <p>Start by searching for a product to see price comparisons across platforms.</p>
            <button 
              onClick={() => window.history.back()} 
              className="back-btn"
            >
              Go Back to Search
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="results-page">
      <div className="container">
        {/* Results Header */}
        <div className="results-header">
          <h2>Price Comparison Results</h2>
          <p>Found {searchResults.length} results across different platforms</p>
        </div>

        {/* Best Deal Highlight */}
        {bestDeal && (
          <div className="best-deal-section">
            <div className="best-deal-badge">
              <i className="fas fa-trophy"></i>
              <span>Best Deal Found</span>
            </div>
            <ProductCard product={bestDeal} />
          </div>
        )}

        {/* All Results */}
        <div className="all-results-section">
          <h3>All Available Options</h3>
          <div className="results-grid">
            {searchResults.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        </div>

        {/* Analytics Section */}
        <div className="analytics-section">
          <div className="analytics-grid">
            <div className="chart-container">
              <PriceChart 
                productName={searchResults[0]?.name || searchResults[0]?.title || 'Product'} 
                currentPrice={searchResults[0]?.price || 134900}
                priceHistory={[
                  { date: '2024-01-01', price: 149900 },
                  { date: '2024-01-15', price: 145000 },
                  { date: '2024-02-01', price: 142000 },
                  { date: '2024-02-15', price: 138000 },
                  { date: '2024-03-01', price: 140000 },
                  { date: '2024-03-15', price: 136000 },
                  { date: '2024-04-01', price: searchResults[0]?.price || 134900 }
                ]}
              />
            </div>
            <div className="deal-score-container">
              <DealScore score={bestDeal?.dealScore || 8.5} />
            </div>
          </div>
        </div>

        {/* Summary Stats */}
        <div className="summary-stats">
          <div className="stat-item">
            <div className="stat-value">₹{maxSavings}</div>
            <div className="stat-label">Max Savings Possible</div>
          </div>
          <div className="stat-item">
            <div className="stat-value">{inStockCount}</div>
            <div className="stat-label">In Stock</div>
          </div>
          <div className="stat-item">
            <div className="stat-value">{avgDiscount}%</div>
            <div className="stat-label">Avg Discount</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Results;