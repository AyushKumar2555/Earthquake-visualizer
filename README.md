🌍 Earthquake Visualizer
📌 Overview

Earthquake Visualizer is a React-based application that displays earthquake data from the USGS (United States Geological Survey) API.
It provides a responsive UI with a collapsible sidebar for filtering earthquakes and an interactive Leaflet map to visualize earthquake locations globally.

📂 Folder Structure
/
├── public/                 # Static assets (index.html, favicon, etc.)
├── src/
│   ├── components/         # Reusable components
│   │   ├── Footer.jsx
│   │   ├── Header.jsx
│   │   ├── MapView.jsx
│   │   └── Sidebar.jsx
│   ├── App.jsx             # Root component
│   └── index.css           # Global styles
├── package.json
└── README.md

src/components/ → Header, Sidebar, MapView, Footer

src/ → Root App.jsx and main stylesheet

public/ → Static assets (index.html, favicon)
✨ Key Features

⚡ Real-time Data – Fetches earthquake data from the USGS API (24h, 7d, 30d).

🗺️ Interactive Map – Displays earthquake markers with popups showing details.

🔍 Filtering Options – Filter earthquakes by minimum magnitude & time period.

📱💻 Responsive Design – Sidebar collapses on mobile; full layout on desktop.

📌 Collapsible Sidebar – Displays recent earthquakes and filters side-by-side with the map.

✅ Recent Updates

Layout Fixes – Refactored with flex-col and min-h-screen to keep footer at bottom.

Sidebar Positioning – Now overlays correctly on mobile and stays aligned on larger screens.

Dependency Management – Cleaned imports; unused code removed.

🛠️ Technologies Used

⚛️ React.js – Component-based UI

🎨 Tailwind CSS – Styling

🗺️ Leaflet.js + React-Leaflet – Map visualization

📈 USGS API – Real-time earthquake data

🚀 Deployment

This project is deployed on Vercel for live demo:

👉 https://earthquake-visualizer-tau.vercel.app/

⚙️ Setup Instructions

Clone the repository

git clone https://github.com/your-username/earthquake-visualizer.git
cd earthquake-visualizer

Install dependencies
npm install

Run locally
npm start

Build for production
npm run build

📸 Screenshots



👨‍💻 Author

Ayush Kumar

