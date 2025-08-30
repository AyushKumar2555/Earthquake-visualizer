// src/App.jsx
import React, { useState, useEffect } from "react";
import SideBar from "./components/SideBar";
import MapView from "./components/MapView";
import Header from "./components/Header";
import Footer from "./components/Footer";
import "./App.css";

const USGS_BASE = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/";

function App() {
  const [earthquakes, setEarthquakes] = useState([]);
  const [filters, setFilters] = useState({ minMag: 0, time: "day" });
  const [selectedEarthquake, setSelectedEarthquake] = useState(null);
  const [lastRefreshed, setLastRefreshed] = useState(null);
  const [isRefreshing, setIsRefreshing] = useState(false);

  // NEW: sidebar open/close
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const toggleSidebar = () => setIsSidebarOpen((prev) => !prev);

  // Build USGS API URL based on selected time
  const getApiUrl = () => {
    if (filters.time === "week") return `${USGS_BASE}all_week.geojson`;
    if (filters.time === "month") return `${USGS_BASE}all_month.geojson`;
    return `${USGS_BASE}all_day.geojson`;
  };

  // Fetch earthquake data
  const fetchEarthquakeData = async () => {
    setIsRefreshing(true);
    try {
      const res = await fetch(getApiUrl());
      const data = await res.json();

      const parsed = (data.features || [])
        .filter(
          (eq) =>
            eq.properties.mag !== null &&
            eq.geometry &&
            eq.geometry.coordinates.length >= 2
        )
        .map((eq) => ({
          id: eq.id,
          magnitude: eq.properties.mag,
          place: eq.properties.place,
          time: eq.properties.time,
          depth: eq.geometry.coordinates[2],
          coordinates: [
            eq.geometry.coordinates[0],
            eq.geometry.coordinates[1],
          ],
        }));

      setEarthquakes(parsed);
      setLastRefreshed(new Date());
      setSelectedEarthquake(null); // reset selection on refresh/filter
    } catch (error) {
      console.error("Error fetching earthquake data:", error);
    } finally {
      setIsRefreshing(false);
    }
  };

  useEffect(() => {
    fetchEarthquakeData();
    // eslint-disable-next-line
  }, [filters.time]);

  const handleFilterChange = (key, value) => {
    setFilters((prev) => ({ ...prev, [key]: value }));
  };

  const handleRefresh = () => {
    fetchEarthquakeData();
  };

  return (
    <div className="flex flex-col h-screen">
      {/* Pass toggle handler to header */}
      <Header
        onRefresh={handleRefresh}
        isRefreshing={isRefreshing}
        onToggleSidebar={toggleSidebar}
      />

      <div className="flex flex-1 overflow-hidden">
        <SideBar
          earthquakes={earthquakes}
          filters={filters}
          onFilterChange={handleFilterChange}
          onSelectEq={setSelectedEarthquake}
          selectedEq={selectedEarthquake}
          isRefreshing={isRefreshing}
          isOpen={isSidebarOpen}
        />

        <MapView
          earthquakes={earthquakes}
          selectedEq={selectedEarthquake}
          setSelectedEq={setSelectedEarthquake}
        />
      </div>

      <Footer
        lastRefreshed={
          lastRefreshed ? lastRefreshed.toLocaleString() : "Not refreshed yet"
        }
      />
    </div>
  );
}

export default App;
