// src/components/MapView.jsx
import {
  MapContainer,
  TileLayer,
  Marker,
  Popup,
  Tooltip,
  useMap,
} from "react-leaflet";
import { useEffect } from "react";
import "leaflet/dist/leaflet.css";
import L from "leaflet";
import { formatDistanceToNow } from "date-fns";

// Helper functions for marker styling. We're using a simple color-coding system
// and sizing to visually represent the magnitude of each earthquake.
const getMarkerColor = (magnitude) =>
  magnitude < 3 ? "green" : magnitude < 5 ? "orange" : "red";

const getMarkerSize = (magnitude) =>
  magnitude < 3 ? 25 : magnitude < 5 ? 35 : 45;

const createCustomIcon = (magnitude, isSelected = false) => {
  const color = getMarkerColor(magnitude);
  const size = getMarkerSize(magnitude);
  const selectedSize = size * 1.5; // Making the selected marker bigger to stand out.

  return L.divIcon({
    className: "custom-marker",
    iconSize: [
      isSelected ? selectedSize : size,
      isSelected ? selectedSize : size,
    ],
    // This anchors the icon right in the center, so it doesn't jump when it gets bigger.
    iconAnchor: [
      (isSelected ? selectedSize : size) / 2,
      (isSelected ? selectedSize : size) / 2,
    ],
    popupAnchor: [0, -(isSelected ? selectedSize : size) / 2],
    // The HTML string defines the visual look of our marker, including the glow and border.
    html: `
      <div style="
        background: ${color};
        width: 100%;
        height: 100%;
        border-radius: 50%;
        border: 3px solid ${isSelected ? "cyan" : "white"};
        box-shadow: ${isSelected ? `0 0 15px 5px ${color}` : `0 0 6px ${color}`};
      "></div>
    `,
    // This high Z-index value ensures the selected marker is always on top of the others.
    zIndexOffset: isSelected ? 1000 : 0,
  });
};

// This component is a neat trick to control the map's view. It's a custom hook
// that automatically zooms to the selected earthquake's location.
function ZoomToSelected({ selected }) {
  const map = useMap();

  useEffect(() => {
    if (selected && selected.coordinates) {
      const [lon, lat] = selected.coordinates;
      map.setView([lat, lon], 6); // We'll zoom in a bit to get a good look.
    }
  }, [selected, map]);

  return null; // This component doesn't render anything, it just does a side effect.
}

function MapView({ earthquakes = [], selectedEq, setSelectedEq }) {
  // A simple function to get the correct Tailwind CSS color class based on magnitude.
  function getMagnitudeColor(mag) {
    if (mag >= 5.5) return "text-red-600 font-bold";
    if (mag >= 4.1) return "text-orange-500";
    return "text-green-600";
  }

  return (
    // This container makes sure our map takes up the full space.
    <div className="h-full w-full">
      {/* This is our map! We'll start it centered and zoomed out to show the whole world. */}
      <MapContainer center={[20, 0]} zoom={2} className="h-full w-full z-0">
        {/* We're using OpenStreetMap for our base map layer. */}
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution="&copy; OpenStreetMap contributors"
        />

        {/* We'll use our custom component to handle the zooming part. */}
        <ZoomToSelected selected={selectedEq} />

        {/* Now we'll loop through all the earthquakes and create a marker for each one. */}
        {(earthquakes || []).map((eq) => {
          // A quick check to make sure we only try to render valid earthquake data.
          if (!eq.coordinates || eq.coordinates.length !== 2) return null;

          const [lon, lat] = eq.coordinates;

          return (
            <Marker
              key={eq.id}
              position={[lat, lon]}
              // We'll pass our custom icon, making sure to highlight the selected one.
              icon={createCustomIcon(eq.magnitude, selectedEq?.id === eq.id)}
              eventHandlers={{
                // When you click a marker, it sets the selected earthquake state.
                click: () => setSelectedEq(eq),
              }}
            >
              {/* This is the little pop-up that appears when you click a marker. */}
              <Popup>
                <div className="text-sm">
                  <p>
                    <strong>Location:</strong> {eq.place || "Unknown"}
                  </p>
                  <p className={getMagnitudeColor(eq.magnitude)}>
                    Magnitude:{" "}
                    {eq.magnitude !== undefined ? eq.magnitude : "N/A"}
                  </p>
                  <p>Depth: {eq.depth !== undefined ? eq.depth : "N/A"} km</p>
                  {eq.time && (
                    <p>
                      {formatDistanceToNow(new Date(eq.time), {
                        addSuffix: true,
                      })}
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

              {/* This is the tooltip that shows up when you hover over a marker. */}
              <Tooltip direction="top" offset={[0, -5]} opacity={0.9}>
                <span>
                  Mag: {eq.magnitude !== undefined ? eq.magnitude : "N/A"} |
                  Depth: {eq.depth !== undefined ? eq.depth : "N/A"} km
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