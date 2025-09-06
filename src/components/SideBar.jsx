// src/components/SideBar.jsx
import React from "react";
import { XMarkIcon, MagnifyingGlassIcon } from "@heroicons/react/24/solid";

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
    <div className="flex flex-col h-full bg-gradient-to-b from-gray-50 to-gray-100">
      {/* Header with close button - only visible on mobile */}
      <div className="flex justify-between items-center p-4 bg-gradient-to-r from-blue-700 to-indigo-800 text-white md:hidden">
        <h2 className="text-xl font-bold">Earthquake Dashboard</h2>
        <button
          onClick={onToggleSidebar}
          className="p-1 rounded-full hover:bg-blue-600 transition-colors"
          aria-label="Close sidebar"
        >
          <XMarkIcon className="h-6 w-6" />
        </button>
      </div>

      {/* Scrollable content */}
      <div className="flex-1 overflow-y-auto p-3 md:p-4">
        {/* Filters Section */}
        <div className="mb-4 md:mb-6 bg-white rounded-lg md:rounded-xl shadow-sm p-3 md:p-4">
          <h3 className="text-md md:text-lg font-semibold mb-2 md:mb-3 text-gray-800 flex items-center gap-2">
            <MagnifyingGlassIcon className="h-4 w-4 md:h-5 md:w-5 text-blue-600" />
            Filters
          </h3>

          {/* Min Magnitude */}
          <div className="mb-3 md:mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Minimum Magnitude: {filters.minMag.toFixed(1)}
            </label>
            <div className="relative">
              <input
                type="range"
                value={filters.minMag}
                onChange={(e) => onFilterChange("minMag", Number(e.target.value))}
                min="0"
                max="10"
                step="0.1"
                className="w-full h-2 bg-blue-100 rounded-lg appearance-none cursor-pointer"
              />
              <div className="flex justify-between text-xs text-gray-500 mt-1">
                <span>0</span>
                <span>5</span>
                <span>10</span>
              </div>
            </div>
          </div>

          {/* Time Range */}
          <div className="mb-2">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Time Range
            </label>
            <div className="grid grid-cols-3 gap-2">
              {[
                { value: "day", label: "Day" },
                { value: "week", label: "Week" },
                { value: "month", label: "Month" }
              ].map((option) => (
                <button
                  key={option.value}
                  onClick={() => onFilterChange("time", option.value)}
                  className={`py-1 md:py-2 text-xs md:text-sm font-medium rounded-md md:rounded-lg transition-colors ${
                    filters.time === option.value
                      ? "bg-blue-600 text-white shadow-md"
                      : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                  }`}
                >
                  {option.label}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Earthquake list */}
        <div className="bg-white rounded-lg md:rounded-xl shadow-sm p-3 md:p-4">
          <div className="flex justify-between items-center mb-2 md:mb-3">
            <h3 className="text-md md:text-lg font-semibold text-gray-800">
              Recent Earthquakes
            </h3>
            <span className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded-full">
              {earthquakes.length} events
            </span>
          </div>

          {isRefreshing ? (
            <div className="flex justify-center items-center py-6 md:py-8">
              <div className="animate-spin rounded-full h-6 w-6 md:h-8 md:w-8 border-b-2 border-blue-600"></div>
            </div>
          ) : earthquakes.length === 0 ? (
            <div className="text-center py-4 md:py-6">
              <div className="text-gray-400 mb-2">
                <svg className="w-10 h-10 md:w-12 md:h-12 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9.172 16.172a4 4 0 015.656 0M9 12h6m-6-4h6m2 5.291A7.962 7.962 0 0112 15c-2.34 0-4.47.86-6.12 2.28l-.88.72M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                </svg>
              </div>
              <p className="text-sm text-gray-500">No earthquakes match your filters</p>
            </div>
          ) : (
            <ul className="space-y-2">
              {earthquakes.map((eq) => {
                const magnitude = eq.magnitude.toFixed(1);
                let intensityColor = "bg-green-100 text-green-800";
                
                if (magnitude >= 5.0) intensityColor = "bg-red-100 text-red-800";
                else if (magnitude >= 4.0) intensityColor = "bg-orange-100 text-orange-800";
                else if (magnitude >= 3.0) intensityColor = "bg-yellow-100 text-yellow-800";
                
                return (
                  <li
                    key={eq.id}
                    onClick={() => onSelectEq(eq)}
                    className={`p-2 md:p-3 rounded-md md:rounded-lg cursor-pointer transition-all duration-200 border
                      hover:shadow-md
                      ${
                        selectedEq?.id === eq.id
                          ? "bg-blue-50 border-blue-400 shadow-md"
                          : "bg-white border-gray-200"
                      }`}
                  >
                    <div className="flex justify-between items-start">
                      <div className="flex-1 min-w-0">
                        <p className="font-semibold text-gray-900 text-sm md:text-base truncate">
                          {eq.place || "Unknown Location"}
                        </p>
                        <div className="flex items-center gap-2 md:gap-3 mt-1 md:mt-2">
                          <span className={`px-2 py-1 rounded-full text-xs font-bold ${intensityColor}`}>
                            M{magnitude}
                          </span>
                          <span className="text-xs text-gray-500">
                            Depth: {eq.depth} km
                          </span>
                        </div>
                      </div>
                      {selectedEq?.id === eq.id && (
                        <div className="bg-blue-600 text-white rounded-full p-1">
                          <svg className="h-3 w-3 md:h-4 md:w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                          </svg>
                        </div>
                      )}
                    </div>
                  </li>
                );
              })}
            </ul>
          )}
        </div>
      </div>
    </div>
  );
};

export default SideBar;