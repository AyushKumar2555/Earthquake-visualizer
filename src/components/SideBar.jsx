import React from "react";
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
    <div className="flex flex-col h-full p-4">
      {/* Close button (only visible on mobile) */}
      <div className="flex justify-end md:hidden">
        <button
          onClick={onToggleSidebar}
          className="p-2 text-gray-500 hover:text-gray-700"
          aria-label="Close sidebar"
        >
          <XMarkIcon className="h-6 w-6" />
        </button>
      </div>

      {/* Scrollable content area */}
      <div className="flex-1 overflow-y-auto p-1">
        {/* Filters */}
        <div className="mb-4">
          <h2 className="text-lg font-semibold mb-2 text-gray-800">Filters</h2>

          {/* Min Magnitude filter */}
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
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm 
                  focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
              />
            </label>
          </div>

          {/* Time Range filter */}
          <div className="mb-4">
            <label className="block text-gray-700 font-medium mb-1">
              Time Range:
              <select
                value={filters.time}
                onChange={(e) => onFilterChange("time", e.target.value)}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm 
                  focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
              >
                <option value="day">Past Day</option>
                <option value="week">Past Week</option>
                <option value="month">Past Month</option>
              </select>
            </label>
          </div>
        </div>

        {/* Earthquake list */}
        <div>
          <h2 className="text-lg font-semibold mb-2 text-gray-800">
            Earthquakes
          </h2>
          {isRefreshing ? (
            <p className="text-gray-500 italic">Loading...</p>
          ) : earthquakes.length === 0 ? (
            <p className="text-gray-500 italic">No earthquakes found.</p>
          ) : (
            <ul className="space-y-2 overflow-y-auto max-h-[70vh]">
              {earthquakes.map((eq) => (
                <li
                  key={eq.id}
                  onClick={() => onSelectEq(eq)}
                  className={`p-3 border rounded-lg cursor-pointer transition-colors duration-200
                    hover:bg-gray-100
                    ${
                      selectedEq?.id === eq.id
                        ? "bg-blue-100 border-blue-400"
                        : "bg-white border-gray-200"
                    }`}
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
