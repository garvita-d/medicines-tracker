import React from 'react';
import MedicineItem from './MedicineItem';

const TimeSlot = ({ title, icon, medicines, person, timeSlotKey, onTake, onViewHistory, onAddReminder }) => {
  if (!medicines || medicines.length === 0) return null;

  return (
    <div className="time-slot">
      <h3>{icon} {title}</h3>
      {medicines.map((medicine, index) => (
        <MedicineItem
          key={`${medicine.name}-${index}`}
          medicine={medicine}
          person={person}
          timeSlot={timeSlotKey}
          index={index}
          onTake={onTake}
          onViewHistory={onViewHistory}
          onAddReminder={onAddReminder}
        />
      ))}
    </div>
  );
};

export default TimeSlot;