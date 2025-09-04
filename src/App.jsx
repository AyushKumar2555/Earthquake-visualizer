import React, { useState, useEffect } from "react";
import SideBar from "./components/SideBar";
import MapView from "./components/MapView";
import Header from "./components/Header";
import Footer from "./components/Footer";
import "./App.css";

const USGS_BASE = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/";

function App() {
  // Let's set up all our main state variables. This is like the brain of our app.
  const [earthquakes, setEarthquakes] = useState([]);
  const [filters, setFilters] = useState({ minMag: 0, time: "day" });
  const [selectedEarthquake, setSelectedEarthquake] = useState(null);
  const [lastRefreshed, setLastRefreshed] = useState(null);
  const [isRefreshing, setIsRefreshing] = useState(false);

  // This state controls whether the sidebar is open on mobile. We'll start it open by default.
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  // This little function just flips the sidebar state. Super handy for the close button.
  const toggleSidebar = () => setIsSidebarOpen((prev) => !prev);

  // A helper function to build the right API URL based on our time filter.
  const getApiUrl = () => {
    if (filters.time === "week") return `${USGS_BASE}all_week.geojson`;
    if (filters.time === "month") return `${USGS_BASE}all_month.geojson`;
    return `${USGS_BASE}all_day.geojson`;
  };

  // This is the main function that talks to the USGS API to get earthquake data.
  const fetchEarthquakeData = async () => {
    setIsRefreshing(true);
    try {
      const res = await fetch(getApiUrl());
      const data = await res.json();

      // We'll process the raw API data here to make it easier to work with.
      // We're also making sure we only get valid data points.
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
      // We want to clear the selected earthquake when we refresh the data.
      setSelectedEarthquake(null);
    } catch (error) {
      console.error("Oops! Ran into an error fetching earthquake data:", error);
    } finally {
      setIsRefreshing(false);
    }
  };

  // This hook runs every time the time filter changes, so the data is always fresh.
  useEffect(() => {
    fetchEarthquakeData();
    // eslint-disable-next-line
  }, [filters.time]);

  // A simple handler to update our filter state. It also clears the selected earthquake
  // to avoid any visual weirdness.
  const handleFilterChange = (key, value) => {
    setFilters((prev) => ({ ...prev, [key]: value }));
    setSelectedEarthquake(null);
  };

  // This function is for our manual refresh button in the header.
  const handleRefresh = () => {
    fetchEarthquakeData();
  };
  
  // We'll create a filtered list of earthquakes here so that both the sidebar and the map
  // are always showing the same data.
  const filteredEarthquakes = earthquakes.filter(
    (eq) => eq.magnitude >= filters.minMag
  );

  return (
    // This is the main container for our app. It's set up to take up the whole screen.
    <div className="flex flex-col min-h-screen">
      {/* Our top bar with the app name and refresh button. */}
      <Header
        onRefresh={handleRefresh}
        isRefreshing={isRefreshing}
        onToggleSidebar={toggleSidebar}
      />
      
      {/* This section holds the sidebar and the map view side-by-side. */}
      <div className="flex flex-1 relative">
        {/* We've added a new flex container for the Sidebar and Map. */}
        {/* The Sidebar container now has `relative` positioning on md screens. */}
        <div
          className={`
            fixed inset-y-0 left-0 z-50 w-3/4  h-full md:w-80 bg-white shadow-xl 
            transform transition-transform duration-300 ease-in-out 
            ${isSidebarOpen ? "translate-x-0" : "-translate-x-full"}
            md:translate-x-0 md:relative md:h-[calc(100vh-10px)]
          `}
        >
          <SideBar
            // We pass down our filtered data and state to the sidebar.
            earthquakes={filteredEarthquakes}
            filters={filters}
            onFilterChange={handleFilterChange}
            onSelectEq={setSelectedEarthquake}
            selectedEq={selectedEarthquake}
            isRefreshing={isRefreshing}
            isOpen={isSidebarOpen}
            onToggleSidebar={toggleSidebar}
          />
        </div>

        {/* This is our map! It takes up the rest of the screen. */}
        <div className="flex-1">
          <MapView
            // We'll give the map the same filtered data as the sidebar.
            earthquakes={filteredEarthquakes}
            selectedEq={selectedEarthquake}
            setSelectedEq={setSelectedEarthquake}
          />
        </div>
      </div>

      {/* The footer at the bottom of the page. */}
      <Footer
        lastRefreshed={
          lastRefreshed ? lastRefreshed.toLocaleString() : "Not refreshed yet"
        }
      />
    </div>
  );
}

export default App;
