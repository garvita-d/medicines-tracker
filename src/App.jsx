import React, { useState, useEffect } from 'react';
import { Mic, MicOff, RotateCcw, Send } from 'lucide-react';
import './styles/App.css';
import Header from './components/Header';
import TimeSlot from './components/TimeSlot';
import Notification from './components/Notification';
import CalendarModal from './components/CalendarModal';
import CalendarExportModal from './components/CalendarExportModal';
import HistoryModal from './components/HistoryModal';
import { originalMedicineData, timeSlots } from './utils/medicineData';
import { 
  checkStorageAvailability, 
  saveToStorage, 
  loadFromStorage,
  logMedicineHistory,
  getMedicineHistory 
} from './utils/storage';
import { 
  saveReminder, 
  scheduleNotification, 
  initializeReminders 
} from './utils/reminderService';
import { processCommand } from './utils/voiceAssistant';

function App() {
  const [medicineData, setMedicineData] = useState(originalMedicineData);
  const [activeTab, setActiveTab] = useState('naveen');
  const [notification, setNotification] = useState({ 
    message: '', 
    type: 'success', 
    show: false 
  });
  const [storageAvailable, setStorageAvailable] = useState(false);
  const [lastUpdate, setLastUpdate] = useState('Never');
  const [isListening, setIsListening] = useState(false);
  const [showCalendarModal, setShowCalendarModal] = useState({ 
    show: false, 
    person: null, 
    medicineName: null 
  });
  const [showExportModal, setShowExportModal] = useState({ 
    show: false, 
    reminder: null 
  });
  const [showHistoryModal, setShowHistoryModal] = useState({ 
    show: false, 
    person: null, 
    medicineName: null,
    history: {} 
  });
  const [transcript, setTranscript] = useState('');
  const [recognition, setRecognition] = useState(null);
  const [textCommand, setTextCommand] = useState('');
  const [assistantResponse, setAssistantResponse] = useState('');

  // Initialize app
  useEffect(() => {
    const isAvailable = checkStorageAvailability();
    setStorageAvailable(isAvailable);

    const savedData = loadFromStorage();
    if (savedData) {
      setMedicineData(savedData.data);
      setLastUpdate(savedData.timestamp);
      showNotification('✅ Previous data loaded successfully!');
    } else {
      const result = saveToStorage(originalMedicineData);
      if (result.success) {
        setLastUpdate(result.timestamp);
      }
      showNotification('👋 Welcome to Medicine Tracking System!');
    }

    // Initialize reminders
    initializeReminders();
  }, []);

  // Auto-save on data change
  useEffect(() => {
    if (storageAvailable && medicineData !== originalMedicineData) {
      const result = saveToStorage(medicineData);
      if (result.success) {
        setLastUpdate(result.timestamp);
      }
    }
  }, [medicineData, storageAvailable]);

  useEffect(() => {
    // Initialize speech recognition
    if ('webkitSpeechRecognition' in window) {
      const recognition = new window.webkitSpeechRecognition();
      recognition.continuous = false;
      recognition.interimResults = false;

      recognition.onresult = (event) => {
        const transcript = event.results[0][0].transcript.toLowerCase();
        setTranscript(transcript);
        processVoiceCommand(transcript);
      };

      recognition.onerror = (event) => {
        console.error('Speech recognition error:', event.error);
        setIsListening(false);
        showNotification('🎤 Voice recognition failed. Please try again.', 'error');
      };

      recognition.onend = () => {
        setIsListening(false);
      };

      setRecognition(recognition);
    }
  }, []);

  const showNotification = (message, type = 'success') => {
    setNotification({ message, type, show: true });
    setTimeout(() => {
      setNotification(prev => ({ ...prev, show: false }));
    }, 4000);
  };

  const takeMedicine = (person, timeSlot, medicineIndex) => {
    const medicine = medicineData[person][timeSlot][medicineIndex];
    
    const wasTakenToday = medicine.lastTaken && 
      new Date(medicine.lastTaken).toDateString() === new Date().toDateString();
    
    if (wasTakenToday) {
      showNotification('⚠️ This medicine was already taken today!', 'error');
      return;
    }
    
    if (medicine.stock <= 0) {
      showNotification('❌ Out of stock! Please refill this medicine.', 'error');
      return;
    }

    setMedicineData(prev => {
      const newData = JSON.parse(JSON.stringify(prev));
      newData[person][timeSlot][medicineIndex].stock--;
      newData[person][timeSlot][medicineIndex].lastTaken = new Date().toISOString();
      return newData;
    });

    logMedicineHistory(person, medicine.name, 'taken');

    showNotification(
      `✅ ${medicine.name} taken successfully! ${medicine.stock - 1} tablets remaining.`
    );

    const threshold = person === 'nisha' ? 10 : 5;
    if (medicine.stock - 1 <= threshold) {
      setTimeout(() => {
        showNotification(
          `⚠️ Low stock alert: Only ${medicine.stock - 1} ${medicine.name} tablets left!`, 
          'error'
        );
      }, 2000);
    }
  };

  const resetStock = () => {
    if (window.confirm('Are you sure you want to reset all medicine stock to original levels?')) {
      setMedicineData(JSON.parse(JSON.stringify(originalMedicineData)));
      showNotification('🔄 All medicine stock has been reset!');
    }
  };

  const processVoiceCommand = (command) => {
    const response = processCommand(command, medicineData);
    setAssistantResponse(response.message);
    
    // Show notification with response
    showNotification(response.message, response.type === 'error' ? 'error' : 'info');

    // If it's a reminder request, open calendar modal
    if (response.type === 'reminder' && response.data) {
      handleAddReminder(response.data.person, response.data.name);
    }
  };

  const findMedicineInCommand = (command) => {
    // Extract medicine name from command by comparing with available medicines
    const allMedicines = [...Object.values(medicineData.naveen), ...Object.values(medicineData.nisha)]
      .flat()
      .map(med => med.name.toLowerCase());

    return allMedicines.find(medicine => command.includes(medicine.toLowerCase()));
  };

  const handleViewHistory = (person, medicineName) => {
    const history = getMedicineHistory(person, medicineName);
    setShowHistoryModal({ 
      show: true, 
      person, 
      medicineName, 
      history 
    });
  };

  const handleTextCommand = () => {
    if (textCommand.trim()) {
      processVoiceCommand(textCommand.toLowerCase());
      setTextCommand('');
    }
  };

  const handleAddReminder = (person, medicineName) => {
    setShowCalendarModal({ show: true, person, medicineName });
  };

  const handleSetReminder = (reminder) => {
    if (saveReminder(reminder)) {
      scheduleNotification(reminder);
      showNotification(`🔔 Reminder set for ${reminder.medicineName} on ${reminder.date} at ${reminder.time}`);
      setShowExportModal({ show: true, reminder });
    } else {
      showNotification('❌ Failed to save reminder', 'error');
    }
  };

  const toggleVoiceAssistant = () => {
    if (!recognition) {
      showNotification('🎤 Voice recognition is not supported in your browser', 'error');
      return;
    }

    if (isListening) {
      recognition.stop();
      setIsListening(false);
      showNotification('🎤 Voice assistant deactivated');
    } else {
      recognition.start();
      setIsListening(true);
      showNotification('🎤 Voice assistant activated. Say something...');
    }
  };

  // Add these helper functions for voice commands
  const checkMedicineStock = (medicineName) => {
    const medicine = findMedicineInAllData(medicineName);
    if (medicine) {
      showNotification(`💊 ${medicine.name}: ${medicine.stock} tablets remaining`, 'info');
    }
  };

  const checkMedicineDose = (medicineName) => {
    const medicine = findMedicineInAllData(medicineName);
    if (medicine) {
      showNotification(`💊 ${medicine.name}: ${medicine.dose}`, 'info');
    }
  };

  const findMedicineInAllData = (medicineName) => {
    for (const person of ['naveen', 'nisha']) {
      for (const timeSlot in medicineData[person]) {
        const medicine = medicineData[person][timeSlot].find(
          med => med.name.toLowerCase() === medicineName.toLowerCase()
        );
        if (medicine) return medicine;
      }
    }
    return null;
  };

  return (
    <div className="app-container">
      <Header storageAvailable={storageAvailable} lastUpdate={lastUpdate} />

      <div className="tabs">
        <button 
          className={`tab ${activeTab === 'naveen' ? 'active' : ''}`}
          onClick={() => setActiveTab('naveen')}
        >
          Naveen
        </button>
        <button 
          className={`tab ${activeTab === 'nisha' ? 'active' : ''}`}
          onClick={() => setActiveTab('nisha')}
        >
          Nisha
        </button>
        <button 
          className={`tab ${activeTab === 'chat' ? 'active' : ''}`}
          onClick={() => setActiveTab('chat')}
        >
          Voice Assistant
        </button>
      </div>

      {activeTab === 'naveen' && (
        <div>
          {timeSlots.naveen.map(slot => (
            <TimeSlot
              key={slot.key}
              title={slot.title}
              icon={slot.icon}
              medicines={medicineData.naveen[slot.key]}
              person="naveen"
              timeSlotKey={slot.key}
              onTake={takeMedicine}
              onViewHistory={handleViewHistory}
              onAddReminder={handleAddReminder}
            />
          ))}
        </div>
      )}

      {activeTab === 'nisha' && (
        <div>
          {timeSlots.nisha.map(slot => (
            <TimeSlot
              key={slot.key}
              title={slot.title}
              icon={slot.icon}
              medicines={medicineData.nisha[slot.key]}
              person="nisha"
              timeSlotKey={slot.key}
              onTake={takeMedicine}
              onViewHistory={handleViewHistory}
              onAddReminder={handleAddReminder}
            />
          ))}
        </div>
      )}

      {activeTab === 'chat' && (
        <div className="time-slot">
          <h3>🎙️ Voice Assistant</h3>
          <p>Speak or type your command below:</p>
          <div className="voice-features">
            <div className="feature-list">
              <h4>Available Commands:</h4>
              <ul>
                <li>✓ "Check [medicine name] stock"</li>
                <li>✓ "What is the dose for [medicine name]?"</li>
                <li>✓ "When was [medicine name] last taken?"</li>
                <li>✓ Type "help" for more commands</li>
              </ul>
            </div>
            <div className="voice-status">
              {isListening ? (
                <p className="listening-status">🎤 Listening... Say something</p>
              ) : (
                <p>Click the microphone icon or type below</p>
              )}
              {transcript && (
                <p className="transcript">You said: "{transcript}"</p>
              )}
              {assistantResponse && (
                <p className="assistant-response">🤖 {assistantResponse}</p>
              )}
            </div>
            <div className="voice-input-container">
              <input
                type="text"
                className="voice-input"
                placeholder="Type your command here... (e.g., 'check Maxi PhD stock')"
                value={textCommand}
                onChange={(e) => setTextCommand(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleTextCommand()}
              />
              <button className="send-button" onClick={handleTextCommand}>
                <Send size={16} />
                Send
              </button>
            </div>
          </div>
        </div>
      )}

      <button 
        className={`voice-assistant ${isListening ? 'listening' : ''}`}
        onClick={toggleVoiceAssistant}
        aria-label="Voice Assistant"
      >
        {isListening ? <MicOff size={24} /> : <Mic size={24} />}
      </button>

      <button className="reset-btn" onClick={resetStock}>
        <RotateCcw size={18} />
        Reset Stock
      </button>

      <Notification {...notification} />

      <CalendarModal
        show={showCalendarModal.show}
        person={showCalendarModal.person}
        medicineName={showCalendarModal.medicineName}
        onClose={() => setShowCalendarModal({ show: false, person: null, medicineName: null })}
        onSetReminder={handleSetReminder}
      />

      <CalendarExportModal
        show={showExportModal.show}
        reminder={showExportModal.reminder}
        onClose={() => setShowExportModal({ show: false, reminder: null })}
      />

      <HistoryModal 
        {...showHistoryModal}
        onClose={() => setShowHistoryModal({ show: false, person: null, medicineName: null, history: {} })}
      />
    </div>
  );
}

export default App;