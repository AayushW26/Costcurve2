import React, { createContext, useContext, useState, useMemo, useCallback } from 'react';

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
    } catch (error) {
      showNotification('Search failed. Please try again.', 'error');
      console.error('Search error:', error);
    } finally {
      setIsSearching(false);
    }
  }, [showNotification]);

  const contextValue = useMemo(
    () => ({
      searchResults,
      isSearching,
      notifications,
      showNotification,
      removeNotification,
      searchProducts,
    }),
    [searchResults, isSearching, notifications, showNotification, removeNotification, searchProducts]
  );

  return React.createElement(AppContext.Provider, { value: contextValue }, children);
};