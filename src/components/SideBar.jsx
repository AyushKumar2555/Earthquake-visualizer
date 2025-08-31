// src/components/SideBar.jsx
import React from "react";
// We're using a solid 'X' icon from Heroicons for our close button.
import { XMarkIcon } from "@heroicons/react/24/solid";

const SideBar = ({
  earthquakes,
  filters,
  onFilterChange,
  onSelectEq,
  selectedEq,
  isRefreshing,
  onToggleSidebar,
}) => {
  return (
    // This main div is the container for the entire sidebar, setting its layout and size.
    <div className="flex flex-col h-full w-full p-4 ">
      {/* This is our close button for the sidebar. We only show it on mobile devices,
          since the sidebar is always visible on larger screens. */}
      <div className="flex justify-end md:hidden">
        <button
          onClick={onToggleSidebar}
          className="p-2 text-gray-500 hover:text-gray-700"
          aria-label="Close sidebar"
        >
          <XMarkIcon className="h-6 w-6" />
        </button>
      </div>

      {/* This is the scrollable content area for our filters and earthquake list.
          Using 'overflow-y-auto' ensures the content won't overflow its container. */}
      <div className="flex-1 overflow-y-auto p-1">
        {/* Here's the filters section. It's a key part of our app's interactivity. */}
        <div className="mb-4">
          <h2 className="text-lg font-semibold mb-2 text-gray-800">Filters</h2>

          {/* The magnitude filter lets users set a minimum magnitude.
              We convert the input value to a number to make sure our filter logic works correctly. */}
          <div className="mb-4">
            <label className="block text-gray-700 font-medium mb-1">
              Min Magnitude:
              <input
                type="number"
                value={filters.minMag}
                onChange={(e) =>
                  onFilterChange("minMag", Number(e.target.value))
                }
                min="0"
                step="1"
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
              />
            </label>
          </div>

          {/* The time range filter lets users see earthquakes from a different time period. */}
          <div className="mb-4">
            <label className="block text-gray-700 font-medium mb-1">
              Time Range:
              <select
                value={filters.time}
                onChange={(e) => onFilterChange("time", e.target.value)}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
              >
                <option value="day">Past Day</option>
                <option value="week">Past Week</option>
                <option value="month">Past Month</option>
              </select>
            </label>
          </div>
        </div>

        {/* This is the list of earthquakes that matches our filters. */}
        <div>
          <h2 className="text-lg font-semibold mb-2 text-gray-800">
            Earthquakes
          </h2>
          {/* We're using conditional rendering here to show different messages
              depending on the app's state. */}
          {isRefreshing ? (
            <p className="text-gray-500 italic">Loading...</p>
          ) : earthquakes.length === 0 ? (
            <p className="text-gray-500 italic">No earthquakes found.</p>
          ) : (
            // This list scrolls vertically and has a fixed height to prevent it from
            // pushing the rest of the page content out of view.
            <ul className="space-y-2 overflow-y-auto max-h-[70vh]">
              {/* NOTE: You're filtering the list again here, but it's already
                  filtered in App.jsx and passed down as 'earthquakes'. You can
                  remove this .filter() call for better performance! */}
              {earthquakes
                .filter((eq) => eq.magnitude >= filters.minMag)
                .map((eq) => (
                  <li
                    key={eq.id}
                    onClick={() => onSelectEq(eq)}
                    className={`
                      p-3 border rounded-lg cursor-pointer transition-colors duration-200
                      hover:bg-gray-100
                      ${selectedEq?.id === eq.id ? "bg-blue-100 border-blue-400" : "bg-white border-gray-200"}
                    `}
                  >
                    <p className="font-semibold text-sm text-gray-900">
                      {eq.place || "Unknown Location"}
                    </p>
                    <div className="text-xs text-gray-600 mt-1">
                      <p>Mag: {eq.magnitude.toFixed(1)}</p>
                      <p>Depth: {eq.depth} km</p>
                    </div>
                  </li>
                ))}
            </ul>
          )}
        </div>
      </div>
    </div>
  );
};

export default SideBar;