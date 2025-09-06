// src/components/Header.jsx
import React from "react";
import { Bars3Icon, ArrowPathIcon } from "@heroicons/react/24/outline";

const Header = ({ onRefresh, isRefreshing, onToggleSidebar }) => {
  return (
    <header className="bg-gradient-to-r from-blue-700 to-indigo-800 text-white p-3 md:p-4 flex justify-between items-center shadow-lg sticky top-0 z-50">
      <div className="flex items-center">
        {/* Hamburger menu - ONLY visible on mobile devices */}
        <button
          onClick={onToggleSidebar}
          className="md:hidden mr-3 hover:bg-blue-600 p-2 rounded-full transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-white"
          aria-label="Toggle sidebar"
        >
          <Bars3Icon className="h-5 w-5 md:h-6 md:w-6" />
        </button>

        {/* Title with responsive sizing */}
        <div className="flex items-center gap-2 md:gap-3">
          <div className="bg-white bg-opacity-20 p-1 md:p-2 rounded-full">
            <span className="text-lg md:text-xl">🌎</span>
          </div>
          <div>
            <h1 className="text-lg md:text-xl font-bold">Earthquake Visualizer</h1>
            <p className="text-xs text-blue-100 opacity-80 hidden xs:block">
              Real-time seismic activity monitoring
            </p>
          </div>
        </div>
      </div>

      {/* Refresh button with responsive text */}
      <button
        className="bg-white text-blue-700 px-3 py-1 md:px-4 md:py-2 rounded-full hover:bg-blue-50 transition-all duration-300 cursor-pointer disabled:opacity-70 disabled:cursor-not-allowed flex items-center gap-1 md:gap-2 shadow-md hover:shadow-lg transform hover:-translate-y-0.5 focus:outline-none focus:ring-2 focus:ring-blue-300 text-sm md:text-base"
        onClick={onRefresh}
        disabled={isRefreshing}
      >
        <ArrowPathIcon
          className={`h-4 w-4 md:h-5 md:w-5 ${isRefreshing ? "animate-spin" : ""}`}
        />
        <span className="hidden sm:inline">
          {isRefreshing ? "Refreshing..." : "Refresh Data"}
        </span>
        <span className="sm:hidden">{isRefreshing ? "..." : "Refresh"}</span>
      </button>
    </header>
  );
};

export default Header;