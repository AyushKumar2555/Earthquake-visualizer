// src/components/Footer.jsx
import React from "react";

const Footer = ({ lastRefreshed }) => {
  return (
    <footer className="mt-auto bg-gray-100 text-gray-700 p-4 flex flex-col md:flex-row justify-between items-center shadow-inner text-sm">
      {/* Left side: App info */}
      <p>
        &copy; {new Date().getFullYear()} Earthquake Tracker
      </p>

      {/* Center: Last refreshed */}
      <p className="text-gray-500">
        Last Refreshed: {lastRefreshed || "N/A"}
      </p>

      {/* Right side: Map library info */}
      <p className="text-gray-400">
        Map powered by Leaflet
      </p>
    </footer>
  );
};

export default Footer;
