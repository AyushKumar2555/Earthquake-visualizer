// src/context/FiltersContext.jsx

import { createContext, useState } from "react";

// We're creating a new Context here. Think of this as a central hub or a "global state"
// for our filters. Any component in our app can access the values stored here.
export const FiltersContext = createContext();

// This is our Context Provider component. Its job is to "provide" the filter state
// to all the child components wrapped inside it. This lets us avoid passing props
// manually through every single component.
export const FiltersProvider = ({ children }) => {
  // We're using React's useState to manage our filter state.
  // The initial values set here determine the default state of the app when it loads.
  const [filters, setFilters] = useState({
    // This filter controls the minimum earthquake magnitude shown.
    magnitude: "all",
    // This controls the time frame of the data (e.g., past day, week, or month).
    timeRange: "week",
    // This filter is a placeholder for a future feature to select a specific region.
    region: "global",
  });

  return (
    // The `.Provider` component is what makes the state available to our app.
    // We're passing an object with both the current `filters` state and the `setFilters`
    // function so that any consuming component can read the filters and update them.
    <FiltersContext.Provider value={{ filters, setFilters }}>
      {children}
    </FiltersContext.Provider>
  );
};