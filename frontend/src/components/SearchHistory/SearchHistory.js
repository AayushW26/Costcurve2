import React, { useEffect, useState, useRef } from 'react';
import { useApp, clearSearchHistory } from '../../context/AppContext';
import { useAuth } from '../../context/AuthContext';
import { FaSearch, FaCalendarAlt } from 'react-icons/fa';
import './SearchHistory.css';

const SearchHistory = () => {
  const { searchHistory, fetchUserSearchHistory } = useApp();
  const { user } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const fetchedRef = useRef(false);

  useEffect(() => {
    const fetchHistory = async () => {
      if (user && user.username && !fetchedRef.current && !isLoading) {
        setIsLoading(true);
        fetchedRef.current = true;
        try {
          await fetchUserSearchHistory(user.username);
        } catch (error) {
          console.error('Error fetching search history:', error);
        } finally {
          setIsLoading(false);
        }
      }
    };

    fetchHistory();
  }, [user?.username, fetchUserSearchHistory]); // Only depend on username, not entire user object

  const handleClearHistory = async () => {
    if (user && user.username) {
      setIsLoading(true);
      try {
        await clearSearchHistory(user.username);
        await fetchUserSearchHistory(user.username);
      } catch (error) {
        console.error('Error clearing search history:', error);
      } finally {
        setIsLoading(false);
      }
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
        {isLoading && <li>Loading search history...</li>}
        {!isLoading && searchHistory.length === 0 && <li>No search history found.</li>}
        {!isLoading && searchHistory.map((item, idx) => (
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
