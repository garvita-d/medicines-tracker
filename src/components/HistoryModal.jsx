import React from 'react';
import { X, Calendar } from 'lucide-react';

const HistoryModal = ({ show, person, medicineName, history, onClose }) => {
  if (!show) return null;

  const last30Days = [...Array(30)].map((_, i) => {
    const date = new Date();
    date.setDate(date.getDate() - i);
    return date.toISOString().split('T')[0];
  });

  const formatDate = (dateStr) => {
    return new Date(dateStr).toLocaleDateString('en-US', {
      weekday: 'short',
      month: 'short',
      day: 'numeric'
    });
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content history-modal" onClick={e => e.stopPropagation()}>
        <button className="modal-close" onClick={onClose}>
          <X size={24} />
        </button>

        <h2 className="modal-title">
          <Calendar size={24} />
          Medicine History: {medicineName}
        </h2>

        <div className="history-grid">
          {last30Days.map(date => {
            const status = history[date];
            return (
              <div 
                key={date} 
                className={`history-day ${status === 'taken' ? 'taken' : 'missed'}`}
              >
                <div className="date">{formatDate(date)}</div>
                <div className="status">
                  {status === 'taken' ? '✅ Taken' : '❌ Missed'}
                </div>
              </div>
            );
          })}
        </div>

        <div className="history-summary">
          <div className="summary-item">
            <span className="label">Last 30 Days:</span>
            <span className="value">
              ✅ Taken: {last30Days.filter(date => history[date] === 'taken').length} days
            </span>
            <span className="value">
              ❌ Missed: {last30Days.filter(date => !history[date]).length} days
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HistoryModal;
