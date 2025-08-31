// src/api/fetchEarthquakes.js

const USGS_BASE = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/";

/**
 * Fetches earthquake data from the USGS API based on a specified time period.
 *
 * @param {string} timePeriod The time period to filter by (e.g., 'day', 'week', 'month').
 * @returns {Promise<Array>} A promise that resolves to an array of earthquake objects.
 */
export async function fetchEarthquakes(timePeriod = "day") {
  // We'll figure out which API endpoint to hit based on the time period.
  let url;
  switch (timePeriod) {
    case "week":
      url = `${USGS_BASE}all_week.geojson`;
      break;
    case "month":
      url = `${USGS_BASE}all_month.geojson`;
      break;
    default:
      url = `${USGS_BASE}all_day.geojson`;
      break;
  }

  try {
    const response = await fetch(url);

    // It's a good idea to check if the response was successful before trying to parse it.
    if (!response.ok) {
      throw new Error(`Failed to fetch earthquake data. Status: ${response.status}`);
    }

    const data = await response.json();

    // Now we'll process the raw GeoJSON data into a simpler format we can use in our app.
    // We're also making sure to handle cases where some data might be missing.
    return (data.features || [])
      .filter((feature) => feature.properties?.mag !== null) // Filter out features with no magnitude
      .map((feature) => ({
        id: feature.id,
        place: feature.properties?.place || "Unknown location",
        magnitude: feature.properties?.mag ?? 0,
        time: feature.properties?.time ?? Date.now(),
        depth: feature.geometry?.coordinates[2] ?? 0,
        coordinates: [
          feature.geometry?.coordinates[0] ?? 0,
          feature.geometry?.coordinates[1] ?? 0,
        ],
      }));
  } catch (error) {
    // If anything goes wrong, we'll log the error and return an empty array to prevent the app from crashing.
    console.error("Error fetching earthquakes:", error);
    return [];
  }
}