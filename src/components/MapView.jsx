// src/components/MapView.jsx
import {
  MapContainer,
  TileLayer,
  Marker,
  Popup,
  Tooltip,
  useMap,
  LayersControl,
  ScaleControl
} from "react-leaflet";
import { useEffect } from "react";
import "leaflet/dist/leaflet.css";
import L from "leaflet";
import { formatDistanceToNow } from "date-fns";

// Fix for default markers in react-leaflet
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

// Enhanced marker styling
const getMarkerColor = (magnitude) => {
  if (magnitude < 2) return "#4ade80";  // green
  if (magnitude < 4) return "#fbbf24";  // amber
  if (magnitude < 6) return "#f97316";  // orange
  return "#ef4444";                     // red
};

const getMarkerSize = (magnitude) => {
  if (magnitude < 2) return 16;
  if (magnitude < 4) return 22;
  if (magnitude < 6) return 28;
  return 34;
};

const createCustomIcon = (magnitude, isSelected = false) => {
  const color = getMarkerColor(magnitude);
  const size = getMarkerSize(magnitude);
  const selectedSize = size * 1.3;

  return L.divIcon({
    className: "custom-earthquake-marker",
    iconSize: [isSelected ? selectedSize : size, isSelected ? selectedSize : size],
    iconAnchor: [
      (isSelected ? selectedSize : size) / 2,
      (isSelected ? selectedSize : size) / 2,
    ],
    popupAnchor: [0, -(isSelected ? selectedSize : size) / 2],
    html: `
      <div style="
        background: ${color};
        width: 100%;
        height: 100%;
        border-radius: 50%;
        border: 2px solid ${isSelected ? "#06b6d4" : "white"};
        box-shadow: ${isSelected ? `0 0 12px 4px ${color}` : `0 0 6px ${color}`};
        display: flex;
        align-items: center;
        justify-content: center;
        color: white;
        font-weight: bold;
        font-size: ${Math.max(8, size / 3)}px;
        transition: all 0.3s ease;
      ">${magnitude.toFixed(1)}</div>
    `,
    zIndexOffset: isSelected ? 1000 : 0,
  });
};

// Custom hook to handle map view changes
function MapController({ selected, earthquakes }) {
  const map = useMap();

  useEffect(() => {
    if (selected && selected.coordinates) {
      const [lon, lat] = selected.coordinates;
      map.setView([lat, lon], 7, { animate: true, duration: 1 });
    } else if (earthquakes && earthquakes.length > 0) {
      // Fit map to show all earthquakes with some padding
      const bounds = earthquakes
        .filter(eq => eq.coordinates && eq.coordinates.length === 2)
        .map(eq => {
          const [lon, lat] = eq.coordinates;
          return [lat, lon];
        });
      
      if (bounds.length > 0) {
        map.fitBounds(bounds, { padding: [20, 20] });
      }
    }
  }, [selected, earthquakes, map]);

  return null;
}

// Legend component for the map
const MapLegend = () => {
  return (
    <div className="leaflet-bottom leaflet-left">
      <div className="leaflet-control leaflet-bar bg-white p-2 md:p-3 rounded shadow-md">
        <h4 className="font-bold text-xs md:text-sm mb-1 md:mb-2">Magnitude</h4>
        <div className="space-y-1">
          <div className="flex items-center">
            <div className="w-3 h-3 md:w-4 md:h-4 rounded-full bg-green-400 mr-1 md:mr-2"></div>
            <span className="text-xs">&lt; 2.0</span>
          </div>
          <div className="flex items-center">
            <div className="w-4 h-4 md:w-5 md:h-5 rounded-full bg-yellow-400 mr-1 md:mr-2"></div>
            <span className="text-xs">2.0 - 3.9</span>
          </div>
          <div className="flex items-center">
            <div className="w-5 h-5 md:w-6 md:h-6 rounded-full bg-orange-500 mr-1 md:mr-2"></div>
            <span className="text-xs">4.0 - 5.9</span>
          </div>
          <div className="flex items-center">
            <div className="w-6 h-6 md:w-7 md:h-7 rounded-full bg-red-600 mr-1 md:mr-2"></div>
            <span className="text-xs">6.0+</span>
          </div>
        </div>
      </div>
    </div>
  );
};

function MapView({ earthquakes = [], selectedEq, setSelectedEq }) {
  // Function to get the correct Tailwind CSS color class based on magnitude
  function getMagnitudeColor(mag) {
    if (mag >= 6) return "text-red-600 font-bold";
    if (mag >= 4) return "text-orange-500 font-semibold";
    if (mag >= 2) return "text-yellow-500";
    return "text-green-600";
  }

  return (
    <div className="h-full w-full relative">
      <MapContainer 
        center={[20, 0]} 
        zoom={2} 
        className="h-full w-full z-0"
        zoomControl={true}
      >
        <LayersControl position="topright">
          <LayersControl.BaseLayer checked name="Standard">
            <TileLayer
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
              attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            />
          </LayersControl.BaseLayer>
          <LayersControl.BaseLayer name="Satellite">
            <TileLayer
              url="https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}"
              attribution="Tiles &copy; Esri &mdash; Source: Esri, i-cubed, USDA, USGS, AEX, GeoEye, Getmapping, Aerogrid, IGN, IGP, UPR-EGP, and the GIS User Community"
            />
          </LayersControl.BaseLayer>
          <LayersControl.BaseLayer name="Dark">
            <TileLayer
              url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
              attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>'
            />
          </LayersControl.BaseLayer>
        </LayersControl>

        <ScaleControl position="bottomleft" imperial={false} />
        <MapController selected={selectedEq} earthquakes={earthquakes} />
        
        {/* Render earthquake markers */}
        {(earthquakes || []).map((eq) => {
          if (!eq.coordinates || eq.coordinates.length !== 2) return null;

          const [lon, lat] = eq.coordinates;

          return (
            <Marker
              key={eq.id}
              position={[lat, lon]}
              icon={createCustomIcon(eq.magnitude, selectedEq?.id === eq.id)}
              eventHandlers={{
                click: () => setSelectedEq(eq),
              }}
            >
              <Popup className="custom-popup">
                <div className="p-2 min-w-[200px] md:min-w-[250px]">
                  <h3 className="font-bold text-base md:text-lg mb-1 md:mb-2 text-gray-800 border-b pb-1">
                    {eq.place || "Unknown Location"}
                  </h3>
                  <div className="space-y-1 md:space-y-2">
                    <div className="flex justify-between">
                      <span className="text-gray-600 text-sm md:text-base">Magnitude:</span>
                      <span className={`font-semibold text-sm md:text-base ${getMagnitudeColor(eq.magnitude)}`}>
                        {eq.magnitude.toFixed(1)}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600 text-sm md:text-base">Depth:</span>
                      <span className="font-medium text-sm md:text-base">{eq.depth} km</span>
                    </div>
                    {eq.time && (
                      <div className="flex justify-between">
                        <span className="text-gray-600 text-sm md:text-base">Time:</span>
                        <span className="text-xs md:text-sm">
                          {formatDistanceToNow(new Date(eq.time), { addSuffix: true })}
                        </span>
                      </div>
                    )}
                    {eq.id && (
                      <div className="mt-2 md:mt-3 pt-1 md:pt-2 border-t">
                        <a
                          href={`https://earthquake.usgs.gov/earthquakes/eventpage/${eq.id}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center text-blue-600 hover:text-blue-800 text-xs md:text-sm font-medium"
                        >
                          <svg className="w-3 h-3 md:w-4 md:h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"></path>
                          </svg>
                          View details on USGS
                        </a>
                      </div>
                    )}
                  </div>
                </div>
              </Popup>

              <Tooltip direction="top" offset={[0, -8]} opacity={0.95} permanent={false}>
                <div className="font-medium text-xs md:text-sm">
                  M{eq.magnitude.toFixed(1)} · {eq.depth} km
                </div>
              </Tooltip>
            </Marker>
          );
        })}
        
        <MapLegend />
      </MapContainer>
    </div>
  );
};

export default MapView;