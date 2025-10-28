export const originalMedicineData = {
  naveen: {
    morning: [
      { name: "Maxi PhD", dose: "1 tablet at each timeslot", stock: 30, originalStock: 30, lastTaken: null }
    ],
    afterBreakfast: [
      { name: "Metolol MF 60mg", dose: "1 tablet at each timeslot", stock: 30, originalStock: 30, lastTaken: null },
      { name: "Pilclop 75mg", dose: "1 tablet at each timeslot", stock: 30, originalStock: 30, lastTaken: null },
      { name: "Cordarone", dose: "1 tablet at each timeslot", stock: 30, originalStock: 30, lastTaken: null },
      { name: "Orofer XT", dose: "1 tablet at each timeslot", stock: 30, originalStock: 30, lastTaken: null },
      { name: "Hyqvit", dose: "1 tablet at each timeslot", stock: 30, originalStock: 30, lastTaken: null }
    ],
    afternoon: [
      { name: "Acitrom", dose: "1mg/2mg alternate days", timing: "4pm", stock: 30, originalStock: 30, lastTaken: null }
    ],
    afterDinner: [
      { name: "Rotin F", dose: "1 tablet at each timeslot", stock: 30, originalStock: 30, lastTaken: null },
      { name: "Telmiford 40mg", dose: "1 tablet at each timeslot", stock: 30, originalStock: 30, lastTaken: null }
    ]
  },
  nisha: {
    afterBreakfast: [
      { name: "Telzox H", dose: "1 tablet at each timeslot", stock: 30, originalStock: 30, lastTaken: null },
      { name: "Cinod 10mg", dose: "1 tablet at each timeslot", stock: 60, originalStock: 60, lastTaken: null },
      { name: "Zavamet 50/500", dose: "1 tablet at each timeslot", stock: 60, originalStock: 60, lastTaken: null }
    ],
    afterDinner: [
      { name: "Cinod 10mg", dose: "1 tablet at each timeslot", stock: 60, originalStock: 60, lastTaken: null },
      { name: "Zavamet 50/500", dose: "1 tablet at each timeslot", stock: 60, originalStock: 60, lastTaken: null }
    ]
  }
};

export const timeSlots = {
  naveen: [
    { key: 'morning', title: 'Morning (Before Breakfast)', icon: '🌅' },
    { key: 'afterBreakfast', title: 'After Breakfast', icon: '🥞' },
    { key: 'afternoon', title: 'Afternoon (4 PM)', icon: '☀️' },
    { key: 'afterDinner', title: 'After Dinner', icon: '🌙' }
  ],
  nisha: [
    { key: 'afterBreakfast', title: 'After Breakfast', icon: '🥞' },
    { key: 'afterDinner', title: 'After Dinner', icon: '🌙' }
  ]
};

export const wasTakenToday = (lastTaken) => {
  if (!lastTaken) return false;
  const today = new Date().toDateString();
  const takenDate = new Date(lastTaken).toDateString();
  return today === takenDate;
};