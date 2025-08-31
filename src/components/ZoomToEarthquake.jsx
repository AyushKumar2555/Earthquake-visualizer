// src/components/ZoomToEarthquake.jsx
import { useMap } from "react-leaflet";
import { useEffect } from "react";

// This is a special component that doesn't render anything itself.
// Its job is to interact directly with the Leaflet map instance using a hook.
function ZoomToEarthquake({ selected }) {
  // We use the useMap() hook to get access to the map instance from the context.
  // It's a simple way to get a reference to the map without passing it down as a prop.
  const map = useMap();

  // The useEffect hook runs a side effect. In our case, it will run every time
  // a new earthquake is selected.
  useEffect(() => {
    // First, we check if an earthquake is actually selected.
    if (selected) {
      // We get the longitude and latitude from the selected earthquake's coordinates.
      const [lon, lat] = selected.coordinates;
      // Now, we tell the map to move its view to the new coordinates and zoom in.
      // We'll also add a little animation to make the movement smooth.
      map.setView([lat, lon], 6, { animate: true });
    }
  }, [selected, map]); // The effect will re-run whenever 'selected' or 'map' changes.

  // We return null because this component doesn't need to render any HTML.
  return null;
}

export default ZoomToEarthquake