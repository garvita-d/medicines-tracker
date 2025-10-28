import React from 'react';
import { X, Calendar as CalendarIcon, Mail, Copy } from 'lucide-react';

const CalendarExportModal = ({ show, reminder, onClose }) => {
  if (!show || !reminder) return null;

  const openGoogleCalendar = () => {
    try {
      const startDate = new Date(`${reminder.date}T${reminder.time}`);
      const endDate = new Date(startDate.getTime() + 30 * 60000);

      const formatGoogleDate = (date) => {
        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const day = String(date.getDate()).padStart(2, '0');
        const hours = String(date.getHours()).padStart(2, '0');
        const minutes = String(date.getMinutes()).padStart(2, '0');
        return `${year}${month}${day}T${hours}${minutes}00`;
      };

      const params = new URLSearchParams({
        action: 'TEMPLATE',
        text: `💊 Medicine: ${reminder.medicineName}`,
        dates: `${formatGoogleDate(startDate)}/${formatGoogleDate(endDate)}`,
        details: `Time to take ${reminder.medicineName}${reminder.message ? '\n\nNote: ' + reminder.message : ''}`,
        location: '',
        trp: 'false'
      });

      const url = `https://calendar.google.com/calendar/render?${params.toString()}`;
      window.open(url, '_blank', 'noopener,noreferrer');
      onClose();
    } catch (error) {
      console.error('Error opening Google Calendar:', error);
      alert('Could not open Google Calendar');
    }
  };

  const openOutlookCalendar = () => {
    try {
      const startDate = new Date(`${reminder.date}T${reminder.time}`);
      const endDate = new Date(startDate.getTime() + 30 * 60000);

      const params = new URLSearchParams({
        path: '/calendar/action/compose',
        rru: 'addevent',
        subject: `💊 Medicine: ${reminder.medicineName}`,
        startdt: startDate.toISOString(),
        enddt: endDate.toISOString(),
        body: `Time to take ${reminder.medicineName}${reminder.message ? '\n\nNote: ' + reminder.message : ''}`,
        location: ''
      });

      const url = `https://outlook.live.com/calendar/0/deeplink/compose?${params.toString()}`;
      window.open(url, '_blank', 'noopener,noreferrer');
      onClose();
    } catch (error) {
      console.error('Error opening Outlook:', error);
      alert('Could not open Outlook Calendar');
    }
  };

  const copyToClipboard = () => {
    const formatDate = (dateStr) => {
      const date = new Date(dateStr);
      return date.toLocaleDateString('en-US', { 
        weekday: 'short', 
        year: 'numeric', 
        month: 'short', 
        day: 'numeric' 
      });
    };

    const details = `Medicine Reminder: ${reminder.medicineName}
Date: ${formatDate(reminder.date)}
Time: ${reminder.time}
${reminder.message ? 'Note: ' + reminder.message : ''}
${reminder.repeat !== 'once' ? 'Repeat: ' + reminder.repeat : ''}

📅 Set this reminder in your calendar app!`;

    navigator.clipboard.writeText(details)
      .then(() => {
        alert('📋 Details copied to clipboard!');
        onClose();
      })
      .catch(() => {
        alert('Failed to copy. Please copy manually.');
      });
  };

  const isMobile = /Android|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content calendar-export-modal" onClick={(e) => e.stopPropagation()}>
        <button className="modal-close" onClick={onClose}>
          <X size={24} />
        </button>

        <div className="export-header">
          <CalendarIcon size={48} />
          <h2>Add to Calendar</h2>
          <p>{reminder.medicineName}</p>
          <p className="export-datetime">
            {new Date(reminder.date).toLocaleDateString()} at {reminder.time}
          </p>
        </div>

        <div className="export-options">
          <button className="export-btn google" onClick={openGoogleCalendar}>
            <CalendarIcon size={20} />
            Google Calendar
          </button>

          {!isMobile && (
            <button className="export-btn outlook" onClick={openOutlookCalendar}>
              <Mail size={20} />
              Outlook Calendar
            </button>
          )}

          <button className="export-btn copy" onClick={copyToClipboard}>
            <Copy size={20} />
            Copy Details
          </button>
        </div>

        <button className="btn btn-secondary" onClick={onClose}>
          Close
        </button>
      </div>
    </div>
  );
};

export default CalendarExportModal;