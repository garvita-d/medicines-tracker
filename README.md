# 💊 Medicine Tracker

A modern, intuitive web application to help you track and manage your daily medications with reminders, calendar integration, and voice assistance.

## 🚀 Deployment

This project is live on Netlify:  
👉 [**View Live Site**](https://stately-kashata-5a6a78.netlify.app)

---

## ✨ Features

- **📅 Daily Medicine Scheduling**: Organize medications by time slots (Morning, Afternoon, Evening, Night)
- **⏰ Smart Reminders**: Get timely notifications for your medication schedule
- **🗓️ Calendar Integration**: Export your medicine schedule to Google Calendar or Apple Calendar
- **📊 History Tracking**: View your medication history and track compliance
- **🎤 Voice Assistant**: Use voice commands to manage your medicines
- **📱 Responsive Design**: Works seamlessly on desktop, tablet, and mobile devices
- **💾 Local Storage**: All data is stored locally in your browser for privacy

## 🚀 Getting Started

### Prerequisites

- Node.js (v14 or higher)
- npm or yarn

### Installation

1. Clone the repository:
```bash
   git clone https://github.com/garvita-d/medicines-tracker.git
   cd medicines-tracker
```

2. Install dependencies:
```bash
   npm install
```

3. Start the development server:
```bash
   npm start
```

4. Open [http://localhost:3000](http://localhost:3000) in your browser
5.  `npm run build`
Builds the app for production to the `build` folder.  
The build is minified and optimized for best performance.

---
## 🌐 Deployment Steps (Summary)

1. Run `npm run build` to create a production build.
2. Deployed manually to **Netlify** via drag & drop of the `build/` folder.
3. (Optional) Connected GitHub repo for automatic deployments:
   - **Build command:** `npm run build`
   - **Publish directory:** `build`

## 🏗️ Built With

- **React** - Frontend framework
- **CSS3** - Styling and animations
- **Local Storage API** - Data persistence
- **Notification API** - Browser notifications
- **Web Speech API** - Voice assistance (if implemented)

## 📂 Project Structure
```
medicine-tracker/
├── public/
│   ├── index.html
│   └── manifest.json
├── src/
│   ├── components/
│   │   ├── Header.jsx
│   │   ├── TimeSlot.jsx
│   │   ├── MedicineItem.jsx
│   │   ├── CalendarModal.jsx
│   │   ├── CalendarExportModal.jsx
│   │   ├── HistoryModal.jsx
│   │   └── Notification.jsx
│   ├── styles/
│   │   └── App.css
│   ├── utils/
│   │   ├── storage.js
│   │   ├── reminderService.js
│   │   ├── medicineData.js
│   │   └── voiceAssistant.js
│   ├── App.jsx
│   └── index.jsx
├── package.json
└── README.md
```

## 🎯 Usage

### Adding a Medicine

1. Click on the "+" button in any time slot
2. Enter medicine name and dosage
3. Set reminder time
4. Click "Add Medicine"

### Managing Medicines

- **Edit**: Click the edit icon to modify medicine details
- **Delete**: Click the delete icon to remove a medicine
- **Mark as Taken**: Check the box when you've taken your medicine

### Calendar Export

1. Click the "Export to Calendar" button
2. Choose your calendar service (Google Calendar or Apple Calendar)
3. Follow the instructions to import the schedule

### View History

- Click the "History" button to see your medication compliance record
- Track which medicines you've taken and when

## 🔔 Browser Permissions

The app may request the following permissions:

- **Notifications**: To send medicine reminders
- **Microphone** (optional): For voice assistant features

## 🛠️ Available Scripts

- `npm start` - Runs the app in development mode
- `npm test` - Launches the test runner
- `npm run build` - Builds the app for production
- `npm run eject` - Ejects from Create React App (one-way operation)

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

1. Fork the project
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 👤 Author

**Garvita Dalmia**

- GitHub: [@garvita-d](https://github.com/garvita-d)

## 🙏 Acknowledgments

- Icons and design inspiration from modern UI/UX patterns
- React community for excellent documentation and resources

## 📧 Contact

For questions or feedback, please open an issue on GitHub.

---

⭐ If you find this project helpful, please consider giving it a star!
