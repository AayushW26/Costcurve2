import React, { createContext, useContext, useState, useMemo, useCallback } from 'react';
import { useAuth } from './AuthContext';

// --- User Data API Utilities ---
export async function saveSearchHistory(username, query, filters) {
  const res = await fetch(`/api/user/${username}/search-history`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ query, filters })
  });
  return res.json();
}

export async function getSearchHistory(username) {
  const res = await fetch(`/api/user/${username}/search-history`);
  return res.json();
}

export async function addToCart(username, item) {
  const res = await fetch(`/api/user/${username}/cart`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(item)
  });
  return res.json();
}

export async function getCart(username) {
  const res = await fetch(`/api/user/${username}/cart`);
  return res.json();
}

export async function removeFromCart(username, productId) {
  const res = await fetch(`/api/user/${username}/cart/${productId}`, {
    method: 'DELETE'
  });
  return res.json();
}

export async function clearSearchHistory(username) {
  const res = await fetch(`/api/user/${username}/search-history`, {
    method: 'DELETE'
  });
  return res.json();
}

const AppContext = createContext();

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within AppProvider');
  }
  return context;
};

export const AppProvider = ({ children }) => {
  const [searchResults, setSearchResults] = useState([]);
  const [isSearching, setIsSearching] = useState(false);
  const [notifications, setNotifications] = useState([]);
  const [searchHistory, setSearchHistory] = useState([]);
  const { user } = useAuth();
  // Fetch user search history
  const fetchUserSearchHistory = useCallback(async (username) => {
    try {
      const res = await getSearchHistory(username);
      if (res.success) {
        setSearchHistory(res.searchHistory);
      }
    } catch (e) {
      // Optionally handle error
    }
  }, []);

  const showNotification = useCallback((message, type = 'info') => {
    const notification = {
      id: Date.now(),
      message,
      type,
    };
    setNotifications((prev) => [...prev, notification]);
  }, []);

  const removeNotification = useCallback((id) => {
    setNotifications((prev) => prev.filter((notification) => notification.id !== id));
  }, []);

  const searchProducts = useCallback(async (query, filters) => {
    setIsSearching(true);
    try {
      const response = await fetch('/api/search', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ query, filters }),
      });
      const data = await response.json();
      setSearchResults(data.products || []);
      // Save search history if user is logged in
      if (user && user.username) {
        try {
          await saveSearchHistory(user.username, query, filters);
        } catch (e) {
          // Ignore errors for search history
        }
      }
    } catch (error) {
      showNotification('Search failed. Please try again.', 'error');
      console.error('Search error:', error);
    } finally {
      setIsSearching(false);
    }
  }, [showNotification, user]);


  const contextValue = useMemo(
    () => ({
      searchResults,
      isSearching,
      notifications,
      showNotification,
      removeNotification,
      searchProducts,
      searchHistory,
      fetchUserSearchHistory,
    }),
    [searchResults, isSearching, notifications, showNotification, removeNotification, searchProducts, searchHistory, fetchUserSearchHistory]
  );

  return React.createElement(AppContext.Provider, { value: contextValue }, children);
};