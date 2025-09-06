// src/components/Footer.jsx
import React from "react";

const Footer = ({ lastRefreshed }) => {
  return (
    <footer className="mt-auto bg-gradient-to-r from-gray-800 to-gray-900 text-white p-3 md:p-4 flex flex-col md:flex-row justify-between items-center shadow-lg space-y-2 md:space-y-0">
      {/* Copyright section */}
      <div className="flex items-center gap-2">
        <div className="bg-blue-600 p-1 rounded hidden xs:block">
          <svg className="h-3 w-3 md:h-4 md:w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
          </svg>
        </div>
        <p className="text-xs md:text-sm">&copy; {new Date().getFullYear()} Earthquake Tracker</p>
      </div>

      {/* Last refreshed with responsive layout */}
      <div className="flex items-center gap-2">
        <svg className="h-3 w-3 md:h-4 md:w-4 text-blue-400 hidden sm:block" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
        <p className="text-xs md:text-sm">
          <span className="text-gray-400 hidden sm:inline">Last Refreshed: </span>
          <span className="sm:ml-1 font-medium">{lastRefreshed || "N/A"}</span>
        </p>
      </div>

      {/* Leaflet credit with responsive text */}
      <div className="flex items-center gap-2">
        <svg className="h-3 w-3 md:h-4 md:w-4 text-green-400 hidden sm:block" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7" />
        </svg>
        <p className="text-xs md:text-sm text-gray-400">
          Powered by <span className="text-green-400 font-medium">Leaflet</span>
        </p>
      </div>
    </footer>
  );
};

export default Footer;