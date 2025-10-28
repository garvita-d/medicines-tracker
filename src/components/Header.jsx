import React from 'react';

const Header = ({ storageAvailable, lastUpdate }) => {
  return (
    <div className="header">
      <h1>💊 Medicine Tracking System</h1>
      <p>Never miss your medication again!</p>
      <div className="data-info">
        Data persists across sessions • Last updated: {lastUpdate}
      </div>
      <div className={`storage-status ${storageAvailable ? 'enabled' : 'disabled'}`}>
        {storageAvailable 
          ? '✅ Persistent storage enabled' 
          : '⚠️ Storage unavailable - data will reset on refresh'}
      </div>
    </div>
  );
};

export default Header;