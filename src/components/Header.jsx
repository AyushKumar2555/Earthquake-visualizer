// src/components/Header.jsx
import React from "react";
// We're pulling these specific icons from the Heroicons library.
// The 'Bars3Icon' is our hamburger menu, and 'ArrowPathIcon' is for refreshing.
import { Bars3Icon, ArrowPathIcon } from "@heroicons/react/24/outline";

const Header = ({ onRefresh, isRefreshing, onToggleSidebar }) => {
  return (
    // This is the main container for our header. We're using flexbox to lay out
    // the content and make sure it's spaced out nicely.
    <header className="bg-blue-600 text-white p-4 flex justify-between items-center shadow-md">
      {/* This button is our hamburger menu. We'll only show it on smaller screens
          (thanks to lg:hidden) to toggle the sidebar. */}
      <button
        onClick={onToggleSidebar}
        className="lg:hidden text-xl mr-4 hover:bg-blue-700 p-1 rounded"
        aria-label="Toggle sidebar"
      >
        <Bars3Icon className="h-6 w-6" />
      </button>

      {/* The main title of our app, with a little earth emoji for fun. */}
      <h1 className="text-xl font-bold flex items-center gap-2">
        🌎 Earthquake Visualizer
      </h1>

      {/* This is our refresh button. It's set up to be a bit more engaging:
          it changes text and spins the icon when data is being refreshed. */}
      <button
        className="bg-white text-blue-600 px-3 py-1 rounded hover:bg-blue-100 transition cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
        onClick={onRefresh}
        disabled={isRefreshing}
      >
        <ArrowPathIcon
          className={`h-5 w-5 ${isRefreshing ? "animate-spin" : ""}`}
        />
        <span className="hidden sm:inline">
          {isRefreshing ? "Refreshing..." : "Refresh"}
        </span>
        <span className="sm:hidden">{isRefreshing ? "..." : "Refresh"}</span>
      </button>
    </header>
  );
};

export default Header;