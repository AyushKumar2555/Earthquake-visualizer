import React from "react";

const Header = ({ onRefresh, isRefreshing, onToggleSidebar }) => {
  return (
    <header className="bg-blue-600 text-white p-4 flex justify-between items-center shadow-md">
      {/* Hamburger menu for mobile */}
      <button 
        onClick={onToggleSidebar}
        className="lg:hidden text-xl mr-4 hover:bg-blue-700 p-1 rounded"
        aria-label="Toggle sidebar"
      >
        
      </button>
      
      <h1 className="text-xl font-bold flex items-center gap-2">
        🌎 Earthquake Visualizer
      </h1>
      
      <button
        className="bg-white text-blue-600 px-3 py-1 rounded hover:bg-blue-100 transition cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
        onClick={onRefresh}
        disabled={isRefreshing}
      >
        {isRefreshing ? "Refreshing..." : "Refresh"}
      </button>
    </header>
  );
};

export default Header;