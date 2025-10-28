const STORAGE_KEY = 'medicine_tracker_data';
const STORAGE_VERSION = '2.0';

export const checkStorageAvailability = () => {
  try {
    const test = '__storage_test__';
    localStorage.setItem(test, 'test');
    localStorage.removeItem(test);
    return true;
  } catch(e) {
    console.warn('localStorage is not available');
    return false;
  }
};

export const saveToStorage = (data) => {
  try {
    const jsonData = JSON.stringify({
      ...data,
      lastUpdated: new Date().toISOString(),
      version: STORAGE_VERSION
    });
    localStorage.setItem(STORAGE_KEY, jsonData);
    return { success: true, timestamp: new Date().toLocaleString() };
  } catch (error) {
    console.error('Error saving data:', error);
    return { success: false, error };
  }
};

export const loadFromStorage = () => {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      const data = JSON.parse(stored);
      const timestamp = data.lastUpdated ? new Date(data.lastUpdated).toLocaleString() : 'Unknown';
      delete data.lastUpdated;
      delete data.version;
      return { data, timestamp };
    }
    return null;
  } catch (error) {
    console.error('Error loading data:', error);
    return null;
  }
};

export const logMedicineHistory = (person, medName, status) => {
  try {
    const today = new Date().toISOString().split('T')[0];
    const historyKey = 'medicine_history';
    let history = JSON.parse(localStorage.getItem(historyKey) || '{}');

    if (!history[person]) history[person] = {};
    if (!history[person][medName]) history[person][medName] = {};

    history[person][medName][today] = status;
    localStorage.setItem(historyKey, JSON.stringify(history));
    return true;
  } catch (error) {
    console.error('Error logging history:', error);
    return false;
  }
};

export const getMedicineHistory = (person, medName) => {
  try {
    const historyKey = 'medicine_history';
    const history = JSON.parse(localStorage.getItem(historyKey) || '{}');
    return history[person]?.[medName] || {};
  } catch (error) {
    console.error('Error getting history:', error);
    return {};
  }
};