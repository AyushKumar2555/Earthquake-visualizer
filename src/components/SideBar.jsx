// src/components/SideBar.jsx
import React, { useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";

const SideBar = ({
  earthquakes,
  filters,
  onFilterChange,
  onSelect,
  selectedEarthquake,
  isRefreshing,
}) => {
  const [collapsed, setCollapsed] = useState(false);

  return (
    <div className={`h-screen bg-gray-100 border-r shadow-md transition-all duration-300 ${collapsed ? "w-12" : "w-80"} flex flex-col`}>

      {/* Collapse button */}
      <button
        onClick={() => setCollapsed(!collapsed)}
        className="p-2 bg-gray-200 hover:bg-gray-300 text-gray-700 flex justify-end items-center"
      >
        {collapsed ? <ChevronRight size={20} /> : <ChevronLeft size={20} />}
      </button>

      {/* Sidebar content */}
      {!collapsed && (
        <div className="flex-1 overflow-y-auto p-3">
          {/* Filters */}
          <div className="mb-4">
            <h2 className="font-bold mb-2">Filters</h2>
            
            {/* Magnitude filter */}
            <label className="block mb-2">
              Min Magnitude:
              <input
                type="number"
                value={filters.minMag}
                onChange={(e) => onFilterChange("minMag", Number(e.target.value))}
                min="0"
                step="1"  // whole numbers only
                className="border rounded px-2 py-1 w-20 ml-2"
              />
            </label>

            {/* Time filter */}
            <label className="block mb-2">
              Time Range:
              <select
                value={filters.time}
                onChange={(e) => onFilterChange("time", e.target.value)}
                className="border rounded px-2 py-1 ml-2"
              >
                <option value="day">Past Day</option>
                <option value="week">Past Week</option>
                <option value="month">Past Month</option>
              </select>
            </label>
          </div>

          {/* Earthquake list */}
          <div>
            <h2 className="font-bold mb-2">Earthquakes</h2>
            {isRefreshing ? (
              <p className="text-gray-500">Loading...</p>
            ) : earthquakes.length === 0 ? (
              <p className="text-gray-500">No earthquakes found.</p>
            ) : (
              <ul className="space-y-2 max-h-[70vh] overflow-y-auto pr-2">
                {earthquakes
                  .filter((eq) => eq.magnitude >= filters.minMag)
                  .map((eq) => (
                    <li
                      key={eq.id}
                      onClick={() => onSelect(eq)}
                      className={`p-2 border rounded cursor-pointer hover:bg-gray-200 ${
                        selectedEarthquake?.id === eq.id ? "bg-blue-200" : ""
                      }`}
                    >
                      <p className="font-semibold">
                        {eq.place || "Unknown Location"}
                      </p>
                      <p>Mag: {eq.magnitude}</p>
                      <p>Depth: {eq.depth} km</p>
                    </li>
                  ))}
              </ul>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default SideBar;
