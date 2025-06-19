import React, { useState, useEffect } from "react";

function FilterPanel({ onApplyFilters }) {
  const [brands, setBrands] = useState([]);
  const [shapes, setShapes] = useState([]);
  const [years, setYears] = useState([]);

  const [filters, setFilters] = useState({
    brand: "",
    shape: "",
    year: "",
    accidents: "",
    hotDeals: "",
  });

  useEffect(() => {
    // Fetch metadata for filters
    fetch(`${import.meta.env.VITE_BACKEND_URL}/api/catalog/metadata`, {
      credentials: "include",
    })
      .then((res) => res.json())
      .then((data) => {
        setBrands(data.brands || []);
        setShapes(data.shapes || []);
        setYears(data.years || []);
      })
      .catch((err) => console.error("Error fetching metadata:", err));
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFilters((prev) => ({ ...prev, [name]: value }));
  };

  const apply = () => onApplyFilters(filters);

  return (
    <aside className="sidebar">
      <h4>Filters</h4>
      <div className="filter-group">
        <label>Brand:</label>
        <select name="brand" value={filters.brand} onChange={handleChange}>
          <option value="">All</option>
          {brands.map((brand, idx) => (
            <option key={idx} value={brand}>
              {brand}
            </option>
          ))}
        </select>
      </div>
      <div className="filter-group">
        <label>Shape:</label>
        <select name="shape" value={filters.shape} onChange={handleChange}>
          <option value="">All</option>
          {shapes.map((shape, idx) => (
            <option key={idx} value={shape}>
              {shape}
            </option>
          ))}
        </select>
      </div>
      <div className="filter-group">
        <label>Year:</label>
        <select name="year" value={filters.year} onChange={handleChange}>
          <option value="">All</option>
          {years.map((year, idx) => (
            <option key={idx} value={year}>
              {year}
            </option>
          ))}
        </select>
      </div>
      <div className="filter-group">
        <label>Accident History:</label>
        <select
          name="accidents"
          value={filters.accidents}
          onChange={handleChange}
        >
          <option value="">All</option>
          <option value="yes">With Accidents</option>
          <option value="no">Clean</option>
        </select>
      </div>
      <div className="filter-group">
        <label>Hot Deals:</label>
        <select
          name="hotDeals"
          value={filters.hotDeals}
          onChange={handleChange}
        >
          <option value="">All</option>
          <option value="yes">Hot Deals</option>
        </select>
      </div>
      <button onClick={apply} className="btn">
        Apply Filters
      </button>
    </aside>
  );
}

export default FilterPanel;
