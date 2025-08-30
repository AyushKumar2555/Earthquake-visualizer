const FilterSection = ({ filters, setFilters }) => {
  return (
    <div className="mb-4">
      <h3 className="font-semibold mb-2">Filters</h3>
      
      {/* Magnitude Filter */}
      <label className="block mb-2">
        Magnitude:
        <select
          value={filters.magnitude}
          onChange={(e) => setFilters({ ...filters, magnitude: e.target.value })}
          className="ml-2 border rounded p-1"
        >
          <option value="all">All</option>
          <option value="low">0 - 3</option>
          <option value="medium">3 - 5</option>
          <option value="high">5+</option>
        </select>
      </label>

      {/* Time Filter */}
      <label className="block mb-2">
        Time:
        <select
          value={filters.time}
          onChange={(e) => setFilters({ ...filters, time: e.target.value })}
          className="ml-2 border rounded p-1"
        >
          <option value="all">All</option>
          <option value="day">Last 24h</option>
          <option value="week">Last 7 days</option>
          <option value="month">Last 30 days</option>
        </select>
      </label>
    </div>
  );
};
export default FilterSection