import React, { useEffect } from 'react';
import { useApp, clearSearchHistory } from '../../context/AppContext';
import { useAuth } from '../../context/AuthContext';
import { FaSearch, FaCalendarAlt } from 'react-icons/fa';
import './SearchHistory.css';

const SearchHistory = () => {
  const { searchHistory, fetchUserSearchHistory } = useApp();
  const { user } = useAuth();

  useEffect(() => {
    if (user && user.username) {
      fetchUserSearchHistory(user.username);
    }
  }, [user, fetchUserSearchHistory]);

  const handleClearHistory = async () => {
    if (user && user.username) {
      await clearSearchHistory(user.username);
      fetchUserSearchHistory(user.username);
    }
  };

  return (
    <div className="search-history-container">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <h2 className="search-history-title">Search History</h2>
        {searchHistory.length > 0 && (
          <button className="clear-history-btn" onClick={handleClearHistory}>
            Clear All
          </button>
        )}
      </div>
      <ul className="search-history-list">
        {searchHistory.length === 0 && <li>No search history found.</li>}
        {searchHistory.map((item, idx) => (
          <li className="search-history-item" key={idx}>
            <span className="search-history-query">
              <FaSearch style={{ marginRight: 6, color: '#3182ce' }} />
              {item.query}
            </span>
            <span className="search-history-filters">{JSON.stringify(item.filters)}</span>
            <span className="search-history-date">
              <FaCalendarAlt style={{ marginRight: 4, color: '#718096' }} />
              {item.searchedAt ? new Date(item.searchedAt).toLocaleString() : 'N/A'}
            </span>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default SearchHistory;
