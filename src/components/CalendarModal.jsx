import React, { useState, useEffect } from 'react';
import { X, Calendar, Bell } from 'lucide-react';

const CalendarModal = ({ show, person, medicineName, onClose, onSetReminder }) => {
  const [reminderData, setReminderData] = useState({
    date: new Date().toISOString().split('T')[0],
    time: '09:00',
    message: '',
    repeat: 'once'
  });
  const [existingReminders, setExistingReminders] = useState([]);

  useEffect(() => {
    if (show) {
      loadExistingReminders();
      setDefaultTime();
    }
  }, [show, person, medicineName]);

  const setDefaultTime = () => {
    const defaultTimes = {
      'morning': '08:00',
      'afterBreakfast': '09:30',
      'afternoon': '16:00',
      'afterDinner': '21:00'
    };

    // Find the medicine's time slot
    let defaultTime = '09:00';
    const medicineData = JSON.parse(localStorage.getItem('medicine_tracker_data') || '{}');
    
    if (medicineData[person]) {
      Object.entries(medicineData[person]).forEach(([timeSlot, medicines]) => {
        if (medicines.find(med => med.name === medicineName)) {
          defaultTime = defaultTimes[timeSlot] || '09:00';
        }
      });
    }

    setReminderData(prev => ({ ...prev, time: defaultTime }));
  };

  const loadExistingReminders = () => {
    try {
      const reminders = JSON.parse(localStorage.getItem('medicine_reminders') || '[]');
      const filtered = reminders.filter(r => 
        r.person === person && 
        r.medicineName === medicineName && 
        r.active &&
        new Date(`${r.date}T${r.time}`) > new Date()
      );
      setExistingReminders(filtered);
    } catch (error) {
      console.error('Error loading reminders:', error);
    }
  };

  const handleSubmit = () => {
    const { date, time, message, repeat } = reminderData;

    if (!date || !time) {
      alert('Please select both date and time');
      return;
    }

    const reminderDateTime = new Date(`${date}T${time}`);
    const now = new Date();

    if (reminderDateTime <= now) {
      alert('Please select a future date and time');
      return;
    }

    const reminder = {
      id: Date.now(),
      person,
      medicineName,
      date,
      time,
      message,
      repeat,
      active: true,
      created: new Date().toISOString()
    };

    onSetReminder(reminder);
    loadExistingReminders();
  };

  const deleteReminder = (reminderId) => {
    try {
      let reminders = JSON.parse(localStorage.getItem('medicine_reminders') || '[]');
      reminders = reminders.filter(r => r.id !== reminderId);
      localStorage.setItem('medicine_reminders', JSON.stringify(reminders));
      loadExistingReminders();
    } catch (error) {
      console.error('Error deleting reminder:', error);
    }
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      weekday: 'short', 
      year: 'numeric', 
      month: 'short', 
      day: 'numeric' 
    });
  };

  if (!show) return null;

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <button className="modal-close" onClick={onClose}>
          <X size={24} />
        </button>

        <h2 className="modal-title">
          <Calendar size={24} />
          Set Reminder for {medicineName}
        </h2>

        <div className="modal-form">
          <div className="form-group">
            <label>Select Date:</label>
            <input
              type="date"
              value={reminderData.date}
              min={new Date().toISOString().split('T')[0]}
              onChange={(e) => setReminderData({ ...reminderData, date: e.target.value })}
              className="form-input"
            />
          </div>

          <div className="form-group">
            <label>Select Time:</label>
            <input
              type="time"
              value={reminderData.time}
              onChange={(e) => setReminderData({ ...reminderData, time: e.target.value })}
              className="form-input"
            />
          </div>

          <div className="form-group">
            <label>Reminder Message (Optional):</label>
            <textarea
              placeholder="e.g., Take with food, Check blood pressure first, etc."
              value={reminderData.message}
              onChange={(e) => setReminderData({ ...reminderData, message: e.target.value })}
              className="form-textarea"
            />
          </div>

          <div className="form-group">
            <label>Repeat:</label>
            <select
              value={reminderData.repeat}
              onChange={(e) => setReminderData({ ...reminderData, repeat: e.target.value })}
              className="form-select"
            >
              <option value="once">Once</option>
              <option value="daily">Daily</option>
              <option value="weekly">Weekly</option>
              <option value="monthly">Monthly</option>
            </select>
          </div>

          <div className="modal-actions">
            <button className="btn btn-primary" onClick={handleSubmit}>
              <Bell size={16} />
              Set Reminder
            </button>
            <button className="btn btn-secondary" onClick={onClose}>
              Cancel
            </button>
          </div>
        </div>

        {existingReminders.length > 0 && (
          <div className="existing-reminders">
            <h3>📋 Existing Reminders</h3>
            {existingReminders.map((reminder) => (
              <div key={reminder.id} className="reminder-item">
                <div className="reminder-info">
                  <strong>📅 {formatDate(reminder.date)} at {reminder.time}</strong>
                  <p>{reminder.repeat !== 'once' ? `Repeats: ${reminder.repeat}` : 'One-time reminder'}</p>
                  {reminder.message && <p className="reminder-message">"{reminder.message}"</p>}
                </div>
                <button
                  className="btn-delete"
                  onClick={() => deleteReminder(reminder.id)}
                >
                  🗑️ Delete
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default CalendarModal;