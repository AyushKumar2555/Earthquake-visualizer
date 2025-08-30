// src/api/earthquakeApi.js

export async function fetchEarthquakes() {
  try {
    const url =
      "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_day.geojson";
    const response = await fetch(url);

    if (!response.ok) {
      throw new Error("Failed to fetch earthquake data");
    }

    const data = await response.json();

    // Map USGS GeoJSON data to simplified format
    return data.features.map((feature) => ({
      id: feature.id,
      place: feature.properties?.place || "Unknown location",
      magnitude: feature.properties?.mag || 0,
      time: feature.properties?.time || Date.now(),
      depth: feature.geometry?.coordinates[2] || 0,
      coordinates: [
        feature.geometry?.coordinates[0] || 0,
        feature.geometry?.coordinates[1] || 0,
      ], // [lon, lat]
    }));
  } catch (error) {
    console.error("Error fetching earthquakes:", error);
    return []; // return empty array on error
  }
}
