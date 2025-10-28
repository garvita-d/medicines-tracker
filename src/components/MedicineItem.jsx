import React, { useState } from 'react';
import { Calendar, History } from 'lucide-react';
import { wasTakenToday } from '../utils/medicineData';

const MedicineItem = ({ medicine, person, timeSlot, index, onTake, onViewHistory, onAddReminder }) => {
  const [isHistoryLoading, setIsHistoryLoading] = useState(false);
  const takenToday = wasTakenToday(medicine.lastTaken);
  const threshold = person === 'nisha' ? 10 : 5;
  const isLowStock = medicine.stock <= threshold;

  const handleHistoryClick = async () => {
    setIsHistoryLoading(true);
    try {
      await onViewHistory(person, medicine.name);
    } finally {
      setIsHistoryLoading(false);
    }
  };

  return (
    <div className="medicine-item">
      <div className="medicine-header">
        <div className="medicine-name">{medicine.name}</div>
        <div className={`stock-count ${isLowStock ? 'low' : takenToday ? 'taken' : ''}`}>
          {medicine.stock} left
        </div>
      </div>
      
      <div className="medicine-details">
        <strong>Dose:</strong> {medicine.dose}
        {medicine.timing && (
          <>
            <br /><strong>Timing:</strong> {medicine.timing}
          </>
        )}
      </div>

      {takenToday && (
        <div className="last-taken">
          ✅ Taken today at {new Date(medicine.lastTaken).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
        </div>
      )}

      <div className="action-buttons">
        <button 
          className={`btn-take ${takenToday ? 'disabled' : ''}`}
          disabled={takenToday}
          onClick={() => onTake(person, timeSlot, index)}
        >
          {takenToday ? '✅ Taken Today' : '💊 Take Medicine'}
        </button>
        
        <button 
          className="btn-calendar"
          onClick={() => onAddReminder(person, medicine.name)}
        >
          <Calendar size={16} />
          Set Reminder
        </button>
        
        <button 
          className="btn-history"
          onClick={handleHistoryClick}
          disabled={isHistoryLoading}
        >
          <History size={16} />
          {isHistoryLoading ? 'Loading...' : 'View History'}
        </button>
      </div>
    </div>
  );
};

export default MedicineItem;