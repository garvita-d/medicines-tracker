const getFuzzyMatch = (input, medicines) => {
  const inputLower = input.toLowerCase();
  
  // First try exact match
  const exact = medicines.find(med => 
    med.name.toLowerCase() === inputLower
  );
  if (exact) return exact;

  // Try contains match
  const contains = medicines.find(med => 
    med.name.toLowerCase().includes(inputLower) || 
    inputLower.includes(med.name.toLowerCase())
  );
  if (contains) return contains;

  // Try similarity match
  const similar = medicines.find(med => {
    const medName = med.name.toLowerCase();
    const distance = levenshteinDistance(inputLower, medName);
    // Allow more fuzzy matching if word is longer
    const threshold = Math.max(2, Math.floor(medName.length * 0.3));
    return distance <= threshold;
  });
  
  return similar;
};

const levenshteinDistance = (a, b) => {
  const matrix = [];

  for (let i = 0; i <= b.length; i++) {
    matrix[i] = [i];
  }

  for (let j = 0; j <= a.length; j++) {
    matrix[0][j] = j;
  }

  for (let i = 1; i <= b.length; i++) {
    for (let j = 1; j <= a.length; j++) {
      if (b.charAt(i-1) === a.charAt(j-1)) {
        matrix[i][j] = matrix[i-1][j-1];
      } else {
        matrix[i][j] = Math.min(
          matrix[i-1][j-1] + 1,
          matrix[i][j-1] + 1,
          matrix[i-1][j] + 1
        );
      }
    }
  }

  return matrix[b.length][a.length];
};

export const processCommand = (command, medicineData) => {
  const commandLower = command.toLowerCase().trim();
  
  // Get all medicines
  const allMedicines = [];
  for (const person of ['naveen', 'nisha']) {
    for (const timeSlot in medicineData[person]) {
      allMedicines.push(...medicineData[person][timeSlot]);
    }
  }

  // Extract potential medicine name from command
  const words = commandLower.split(' ');
  let medicineName = '';
  let foundMedicine = null;

  // Try each word as potential medicine name
  for (const word of words) {
    const match = getFuzzyMatch(word, allMedicines);
    if (match) {
      medicineName = match.name;
      foundMedicine = match;
      break;
    }
  }

  if (!foundMedicine && words.length > 1) {
    // Try pairs of words
    for (let i = 0; i < words.length - 1; i++) {
      const pair = words[i] + ' ' + words[i + 1];
      const match = getFuzzyMatch(pair, allMedicines);
      if (match) {
        medicineName = match.name;
        foundMedicine = match;
        break;
      }
    }
  }

  if (foundMedicine) {
    // Check medicine stock
    if (commandLower.includes('stock') || commandLower.includes('remaining')) {
      return {
        type: 'stock',
        message: `${foundMedicine.name} has ${foundMedicine.stock} tablets remaining.`,
        data: foundMedicine
      };
    }

    // Check medicine dose
    if (commandLower.includes('dose') || commandLower.includes('dosage')) {
      return {
        type: 'dose',
        message: `The dosage for ${foundMedicine.name} is ${foundMedicine.dose}.`,
        data: foundMedicine
      };
    }

    // Check last taken
    if (commandLower.includes('when') || commandLower.includes('last') || commandLower.includes('taken')) {
      const lastTaken = foundMedicine.lastTaken 
        ? new Date(foundMedicine.lastTaken).toLocaleString()
        : 'not taken yet';
      return {
        type: 'lastTaken',
        message: `${foundMedicine.name} was ${lastTaken}.`,
        data: foundMedicine
      };
    }

    // Default response for found medicine
    return {
      type: 'info',
      message: `Found medicine ${foundMedicine.name}. Try asking about its stock, dose, or when it was last taken.`,
      data: foundMedicine
    };
  }

  // Help command
  if (commandLower.includes('help') || commandLower.includes('commands')) {
    return {
      type: 'help',
      message: 'Available commands:\n- Check [medicine] stock\n- What is the dose for [medicine]?\n- When was [medicine] last taken?',
    };
  }

  // No matching medicine found
  return {
    type: 'error',
    message: 'I couldn\'t find that medicine. Please check the medicine name and try again.',
  };
};
