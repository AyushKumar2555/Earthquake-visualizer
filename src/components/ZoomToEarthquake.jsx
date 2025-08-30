// ZoomToEarthquake.jsx
import { useMap } from "react-leaflet";
import { useEffect } from "react";

function ZoomToEarthquake({ selected }) {
  const map = useMap();

  useEffect(() => {
    if (selected) {
      const [lon, lat] = selected.coordinates;
      map.setView([lat, lon], 6, { animate: true });
    }
  }, [selected, map]);

  return null;
}

export default ZoomToEarthquake;
