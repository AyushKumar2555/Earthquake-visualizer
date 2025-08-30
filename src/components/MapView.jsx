import { MapContainer, TileLayer, Marker, Popup, Tooltip, useMap } from "react-leaflet";
import { useEffect } from "react";
import "leaflet/dist/leaflet.css";
import L from "leaflet";
import { formatDistanceToNow } from "date-fns";

// Marker utilities
const getMarkerColor = (magnitude) =>
  magnitude < 3 ? "green" : magnitude < 5 ? "orange" : "red";

const getMarkerSize = (magnitude) =>
  magnitude < 3 ? 25 : magnitude < 5 ? 35 : 45;

const createCustomIcon = (magnitude, isSelected = false) => {
  const color = getMarkerColor(magnitude);
  const size = getMarkerSize(magnitude) + (isSelected ? 10 : 0);

  return L.divIcon({
    className: "custom-marker",
    html: `
      <div style="
        background: ${color};
        width: ${size}px;
        height: ${size}px;
        border-radius: 50%;
        border: 2px solid white;
        box-shadow: ${isSelected ? `0 0 10px ${color}` : `0 0 6px ${color}`};
      "></div>
    `,
  });
};

// Auto-zoom when selected
function ZoomToSelected({ selected }) {
  const map = useMap();

  useEffect(() => {
    if (selected && selected.coordinates) {
      const [lon, lat] = selected.coordinates;
      map.setView([lat, lon], 6); // Zoom level when selected
    }
  }, [selected, map]);

  return null;
}

function MapView({ earthquakes = [], selectedEq }) {
  function getMagnitudeColor(mag) {
    if (mag >= 5.5) return "text-red-600 font-bold";
    if (mag >= 4.1) return "text-orange-500";
    return "text-green-600";
  }

  return (
    <div style={{ height: "100vh", width: "100%" }}>
      <MapContainer
        center={[20, 0]}
        zoom={2}
        style={{ height: "100%", width: "100%" }}
      >
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution="&copy; OpenStreetMap contributors"
        />

        {/* Auto zoom to the selected earthquake */}
        <ZoomToSelected selected={selectedEq} />

        {(earthquakes || []).map((eq) => {
          // Skip earthquake if coordinates are missing
          if (!eq.coordinates || eq.coordinates.length !== 2) return null;

          const [lon, lat] = eq.coordinates;

          return (
            <Marker
              key={eq.id}
              position={[lat, lon]}
              icon={createCustomIcon(eq.magnitude, selectedEq?.id === eq.id)}
            >
              <Popup>
                <div className="text-sm">
                  <p>
                    <strong>Location:</strong> {eq.place || "Unknown"}
                  </p>
                  <p className={getMagnitudeColor(eq.magnitude)}>
                    Magnitude: {eq.magnitude !== undefined ? eq.magnitude : "N/A"}
                  </p>
                  <p>Depth: {eq.depth !== undefined ? eq.depth : "N/A"} km</p>
                  {eq.time && (
                    <p>
                      {formatDistanceToNow(new Date(eq.time), { addSuffix: true })}
                    </p>
                  )}
                  {eq.id && (
                    <a
                      href={`https://earthquake.usgs.gov/earthquakes/eventpage/${eq.id}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-600 underline"
                    >
                      More Info
                    </a>
                  )}
                </div>
              </Popup>

              <Tooltip direction="top" offset={[0, -5]} opacity={0.9}>
                <span>
                  Mag: {eq.magnitude !== undefined ? eq.magnitude : "N/A"} | Depth: {eq.depth !== undefined ? eq.depth : "N/A"} km
                </span>
              </Tooltip>
            </Marker>
          );
        })}
      </MapContainer>
    </div>
  );
}

export default MapView;
