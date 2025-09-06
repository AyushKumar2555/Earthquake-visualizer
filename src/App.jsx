import React, { useState, useEffect } from "react";
import SideBar from "./components/SideBar";
import MapView from "./components/MapView";
import Header from "./components/Header";
import Footer from "./components/Footer";
import "./App.css";

const USGS_BASE = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/";

// Custom Notification Component
const Notification = ({ message, type, onClose }) => {
  useEffect(() => {
    const timer = setTimeout(() => {
      onClose();
    }, 3000);

    return () => clearTimeout(timer);
  }, [onClose]);

  const bgColor = type === "success" ? "bg-green-500" : "bg-red-500";
  
  return (
    <div className={`fixed bottom-4 right-4 ${bgColor} text-white px-4 py-2 rounded-lg shadow-lg z-50 transition-opacity duration-300`}>
      <div className="flex items-center">
        <span className="mr-2">
          {type === "success" ? "✓" : "⚠"}
        </span>
        <span>{message}</span>
        <button 
          onClick={onClose}
          className="ml-4 text-white hover:text-gray-200"
        >
          ×
        </button>
      </div>
    </div>
  );
};

function App() {
  const [earthquakes, setEarthquakes] = useState([]);
  const [filters, setFilters] = useState({ minMag: 0, time: "day" });
  const [selectedEarthquake, setSelectedEarthquake] = useState(null);
  const [lastRefreshed, setLastRefreshed] = useState(null);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [stats, setStats] = useState({ total: 0, maxMag: 0, avgDepth: 0 });
  const [notification, setNotification] = useState({ show: false, message: "", type: "" });

  const showNotification = (message, type = "success") => {
    setNotification({ show: true, message, type });
  };

  const hideNotification = () => {
    setNotification({ show: false, message: "", type: "" });
  };

  const toggleSidebar = () => setIsSidebarOpen((prev) => !prev);

  const getApiUrl = () => {
    if (filters.time === "week") return `${USGS_BASE}all_week.geojson`;
    if (filters.time === "month") return `${USGS_BASE}all_month.geojson`;
    return `${USGS_BASE}all_day.geojson`;
  };

  const calculateStats = (data) => {
    if (data.length === 0) return { total: 0, maxMag: 0, avgDepth: 0 };
    
    const maxMag = Math.max(...data.map(eq => eq.magnitude));
    const totalDepth = data.reduce((sum, eq) => sum + eq.depth, 0);
    const avgDepth = totalDepth / data.length;
    
    return { total: data.length, maxMag, avgDepth: Math.round(avgDepth) };
  };

  const fetchEarthquakeData = async () => {
    setIsRefreshing(true);
    try {
      const res = await fetch(getApiUrl());
      if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`);
      
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
          depth: Math.round(eq.geometry.coordinates[2]),
          coordinates: [eq.geometry.coordinates[0], eq.geometry.coordinates[1]],
          url: eq.properties.url,
          significance: eq.properties.sig
        }));

      setEarthquakes(parsed);
      setStats(calculateStats(parsed));
      setLastRefreshed(new Date());
      setSelectedEarthquake(null);
      
      showNotification(`Loaded ${parsed.length} earthquakes`);
    } catch (error) {
      console.error("Error fetching earthquake data:", error);
      showNotification("Failed to fetch earthquake data", "error");
    } finally {
      setIsRefreshing(false);
    }
  };

  useEffect(() => {
    fetchEarthquakeData();
    // Set up auto-refresh every 5 minutes
    const interval = setInterval(fetchEarthquakeData, 5 * 60 * 1000);
    return () => clearInterval(interval);
    // eslint-disable-next-line
  }, [filters.time]);

  const handleFilterChange = (key, value) => {
    setFilters((prev) => ({ ...prev, [key]: value }));
    setSelectedEarthquake(null);
  };

  const filteredEarthquakes = earthquakes.filter(
    (eq) => eq.magnitude >= filters.minMag
  );

  return (
    <div className="flex flex-col h-screen overflow-hidden bg-gray-50">
      {/* Custom Notification */}
      {notification.show && (
        <Notification 
          message={notification.message} 
          type={notification.type} 
          onClose={hideNotification} 
        />
      )}
      
      {/* Header */}
      <Header
        onRefresh={fetchEarthquakeData}
        isRefreshing={isRefreshing}
        onToggleSidebar={toggleSidebar}
        stats={stats}
      />

      {/* Main Content (Sidebar + Map) */}
      <div className="flex flex-1 overflow-hidden relative">
        {/* Sidebar backdrop for mobile - FIXED: Added proper conditional rendering */}
        {isSidebarOpen && (
          <div 
            className="fixed inset-0 bg-black bg-opacity-50 z-40 md:bg-transparent md:pointer-events-none"
            onClick={() => setIsSidebarOpen(false)}
          />
        )}
        
        {/* Sidebar */}
        <div
          className={`
            w-80 bg-white shadow-xl
            transform transition-transform duration-300 ease-in-out
            ${isSidebarOpen ? "translate-x-0" : "-translate-x-full"}
            fixed md:relative z-50 h-full
          `}
        >
          <SideBar
            earthquakes={filteredEarthquakes}
            filters={filters}
            onFilterChange={handleFilterChange}
            onSelectEq={setSelectedEarthquake}
            selectedEq={selectedEarthquake}
            isRefreshing={isRefreshing}
            onToggleSidebar={toggleSidebar}
            stats={stats}
          />
        </div>

        {/* Map */}
        <div className="flex-1 relative h-full">
          <MapView
            earthquakes={filteredEarthquakes}
            selectedEq={selectedEarthquake}
            setSelectedEq={setSelectedEarthquake}
          />
        </div>
      </div>

      {/* Footer */}
      <Footer
        lastRefreshed={
          lastRefreshed ? lastRefreshed.toLocaleString() : "Not refreshed yet"
        }
      />
    </div>
  );
}

export default App;