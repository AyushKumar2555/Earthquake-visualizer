// src/components/Footer.jsx
import React from "react";

const Footer = ({ lastRefreshed }) => {
  return (
    // The footer container. Using 'mt-auto' pushes it to the bottom of the page.
    // We're using flexbox to lay out the content, making it responsive for both
    // mobile and desktop views.
    <footer className="mt-auto bg-gray-100 text-gray-700 p-4 flex flex-col md:flex-row justify-between items-center shadow-inner text-sm z-20 md:h-10  h-20">
      {/* Left side: Displays the current year for copyright. */}
      <p>&copy; {new Date().getFullYear()} Earthquake Tracker</p>

      {/* Center: Shows when the data was last updated.
          This gives the user confidence that the data is current. */}
      <p className="text-gray-500">Last Refreshed: {lastRefreshed || "N/A"}</p>

      {/* Right side: Credits the mapping library. It's a small detail, but it's
          good practice to acknowledge the tools you use. */}
      <p className="text-gray-400">Map powered by Leaflet</p>
    </footer>
  );
};

export default Footer;