// Save reminder to localStorage
export const saveReminder = (reminder) => {
  try {
    let reminders = JSON.parse(localStorage.getItem('medicine_reminders') || '[]');
    reminders.push(reminder);
    localStorage.setItem('medicine_reminders', JSON.stringify(reminders));
    return true;
  } catch (error) {
    console.error('Error saving reminder:', error);
    return false;
  }
};

// Load all reminders
export const loadReminders = () => {
  try {
    return JSON.parse(localStorage.getItem('medicine_reminders') || '[]');
  } catch (error) {
    console.error('Error loading reminders:', error);
    return [];
  }
};

// Schedule notification
export const scheduleNotification = (reminder) => {
  const reminderTime = new Date(`${reminder.date}T${reminder.time}`);
  const now = new Date();
  const timeUntilReminder = reminderTime.getTime() - now.getTime();

  if (timeUntilReminder > 0 && timeUntilReminder < 24 * 60 * 60 * 1000) {
    setTimeout(() => {
      showReminderNotification(reminder);
      
      if (reminder.repeat !== 'once') {
        scheduleRecurringReminder(reminder);
      }
    }, timeUntilReminder);
  }
};

// Show notification
const showReminderNotification = (reminder) => {
  const message = `💊 Medicine Reminder: ${reminder.medicineName}${reminder.message ? '\n' + reminder.message : ''}`;

  // Browser notification
  if ('Notification' in window && Notification.permission === 'granted') {
    new Notification('Medicine Reminder', {
      body: `Time to take ${reminder.medicineName}${reminder.message ? '\n' + reminder.message : ''}`,
      icon: '/favicon.ico',
      tag: `medicine-${reminder.id}`,
      requireInteraction: true
    });
  }

  // Play sound
  playNotificationSound();
};

// Play notification sound
const playNotificationSound = () => {
  try {
    const audioContext = new (window.AudioContext || window.webkitAudioContext)();
    const oscillator = audioContext.createOscillator();
    const gainNode = audioContext.createGain();

    oscillator.connect(gainNode);
    gainNode.connect(audioContext.destination);

    oscillator.frequency.setValueAtTime(800, audioContext.currentTime);
    oscillator.frequency.setValueAtTime(600, audioContext.currentTime + 0.1);
    oscillator.frequency.setValueAtTime(800, audioContext.currentTime + 0.2);

    gainNode.gain.setValueAtTime(0.3, audioContext.currentTime);
    gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.3);

    oscillator.start(audioContext.currentTime);
    oscillator.stop(audioContext.currentTime + 0.3);
  } catch (error) {
    console.error('Error playing notification sound:', error);
  }
};

// Schedule recurring reminder
const scheduleRecurringReminder = (reminder) => {
  const nextDate = calculateNextReminderDate(reminder.date, reminder.repeat);
  const newReminder = {
    ...reminder,
    id: Date.now(),
    date: nextDate
  };

  saveReminder(newReminder);
  scheduleNotification(newReminder);
};

// Calculate next reminder date
const calculateNextReminderDate = (currentDate, repeat) => {
  const date = new Date(currentDate);

  switch (repeat) {
    case 'daily':
      date.setDate(date.getDate() + 1);
      break;
    case 'weekly':
      date.setDate(date.getDate() + 7);
      break;
    case 'monthly':
      date.setMonth(date.getMonth() + 1);
      break;
    default:
      break;
  }

  return date.toISOString().split('T')[0];
};

// Request notification permission
export const requestNotificationPermission = () => {
  if ('Notification' in window && Notification.permission === 'default') {
    return Notification.requestPermission();
  }
  return Promise.resolve(Notification.permission);
};

// Initialize all existing reminders
export const initializeReminders = () => {
  requestNotificationPermission().then(permission => {
    if (permission === 'granted') {
      const reminders = loadReminders();
      const activeReminders = reminders.filter(r => 
        r.active && 
        new Date(`${r.date}T${r.time}`) > new Date()
      );

      activeReminders.forEach(reminder => {
        scheduleNotification(reminder);
      });

      console.log(`Scheduled ${activeReminders.length} active reminders`);
    }
  });
};