import React from 'react';

const Notification = ({ message, type, show }) => {
  const getIcon = () => {
    switch (type) {
      case 'success': return '✅';
      case 'error': return '❌';
      case 'warning': return '⚠️';
      case 'info': return 'ℹ️';
      default: return '📢';
    }
  };

  return (
    <div className={`notification ${type} ${show ? 'show' : ''}`}>
      <span className="notification-icon">{getIcon()}</span>
      <span className="notification-message">{message}</span>
    </div>
  );
};

export default Notification;