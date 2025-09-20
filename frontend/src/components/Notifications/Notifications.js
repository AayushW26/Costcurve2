import React from 'react';
import { useApp } from '../../context/AppContext';
import './Notifications.css';

const Notifications = () => {
  const { notifications, removeNotification } = useApp();

  if (notifications.length === 0) return null;

  return (
    <div className="notification-container">
      {notifications.map((notification) => (
        <div
          key={notification.id}
          className={`notification ${notification.type}`}
          onClick={() => removeNotification(notification.id)}
        >
          <div className="notification-content">
            <div className="notification-icon">
              {notification.type === 'success' && <i className="fas fa-check-circle"></i>}
              {notification.type === 'error' && <i className="fas fa-exclamation-circle"></i>}
              {notification.type === 'warning' && <i className="fas fa-exclamation-triangle"></i>}
              {notification.type === 'info' && <i className="fas fa-info-circle"></i>}
            </div>
            <div className="notification-message">
              {notification.message}
            </div>
          </div>
          <button
            className="notification-close"
            onClick={(e) => {
              e.stopPropagation();
              removeNotification(notification.id);
            }}
          >
            <i className="fas fa-times"></i>
          </button>
        </div>
      ))}
    </div>
  );
};

export default Notifications;