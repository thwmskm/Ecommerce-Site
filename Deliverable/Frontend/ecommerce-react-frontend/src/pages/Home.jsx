import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import Chatbot from "../components/Chatbot";

function Home() {
  const [vehicles, setVehicles] = useState([]);
  const [filters, setFilters] = useState({
    brand: "",
    shape: "",
    year: "",
    accidents: "",
    hotDeals: "",
    sortBy: "",
    sortOrder: "",
  });
  const [metadata, setMetadata] = useState({
    brands: [],
    shapes: [],
    years: [],
  });

  // State to store the list of vehicle IDs selected for comparison.
  const [comparisonList, setComparisonList] = useState(() => {
    const stored = localStorage.getItem("vehicles_to_compare");
    return stored ? JSON.parse(stored) : [];
  });

  // Fetch vehicles and metadata on component mount
  useEffect(() => {
    fetchVehicles();
    fetchMetadata();
  }, []);

  // Function to fetch vehicles from the backend
  const fetchVehicles = async (filtersObj = {}) => {
    console.log(process.env.REACT_APP_BACKEND_URL);
    let url = `${process.env.REACT_APP_BACKEND_URL}/api/catalog/vehicles`;
    const queryParams = { ...filtersObj };
    const params = new URLSearchParams(queryParams);
    if (params.toString()) {
      url = `/api/catalog/filter?${params.toString()}`;
    }
    try {
      const response = await fetch(url);
      const data = await response.json();
      setVehicles(data);
    } catch (error) {
      console.error("Error fetching vehicles:", error);
    }
  };

  // Function to fetch metadata (brands, shapes, years)
  const fetchMetadata = async () => {
    try {
      const response = await fetch(
        `${process.env.REACT_APP_BACKEND_URL}/api/catalog/metadata`
      );
      const data = await response.json();
      setMetadata(data);
    } catch (error) {
      console.error("Error fetching metadata:", error);
    }
  };

  // Update filter values on change
  const handleFilterChange = (e) => {
    setFilters({
      ...filters,
      [e.target.name]: e.target.value,
    });
  };

  // Apply filters => fetch vehicles using the current filters
  const applyFilters = () => {
    fetchVehicles(filters);
  };

  // Toggle a vehicle's selection for comparison
  const toggleComparison = (vehicleId) => {
    let updated = [];
    if (comparisonList.includes(vehicleId)) {
      // Remove vehicle from selection
      updated = comparisonList.filter((id) => id !== vehicleId);
    } else {
      // Add vehicle to selected list. (You might enforce a maximum if needed.)
      updated = [...comparisonList, vehicleId];
    }
    setComparisonList(updated);
    localStorage.setItem("vehicles_to_compare", JSON.stringify(updated));
  };

  return (
    <div>
      <h2>Available Electric Vehicles</h2>
      {/* Catalog Container containing the left-side filter panel and right-side vehicle list */}
      <div className="catalog-container">
        {/* Left Filter Panel */}
        <div className="filter-panel">
          <h3>Filter Options</h3>
          {/* Grid container for filter groups */}
          <div className="filter-options-grid">
            <div className="filter-group">
              <label htmlFor="brand">Brand</label>
              <select name="brand" id="brand" onChange={handleFilterChange}>
                <option value="">All Brands</option>
                {metadata.brands.map((b, idx) => (
                  <option key={idx} value={b}>
                    {b}
                  </option>
                ))}
              </select>
            </div>

            <div className="filter-group">
              <label htmlFor="shape">Shape</label>
              <select name="shape" id="shape" onChange={handleFilterChange}>
                <option value="">All Shapes</option>
                {metadata.shapes.map((s, idx) => (
                  <option key={idx} value={s}>
                    {s}
                  </option>
                ))}
              </select>
            </div>

            <div className="filter-group">
              <label htmlFor="year">Year</label>
              <select name="year" id="year" onChange={handleFilterChange}>
                <option value="">All Years</option>
                {metadata.years.map((y, idx) => (
                  <option key={idx} value={y}>
                    {y}
                  </option>
                ))}
              </select>
            </div>

            <div className="filter-group">
              <label htmlFor="accidents">History</label>
              <select
                name="accidents"
                id="accidents"
                onChange={handleFilterChange}
              >
                <option value="">All History</option>
                <option value="yes">With Accidents</option>
                <option value="no">Without Accidents</option>
              </select>
            </div>

            <div className="filter-group">
              <label htmlFor="hotDeals">Hot Deals</label>
              <select
                name="hotDeals"
                id="hotDeals"
                onChange={handleFilterChange}
              >
                <option value="">All Deals</option>
                <option value="yes">Hot Deals</option>
              </select>
            </div>

            <div className="filter-group">
              <label htmlFor="sortBy">Sort By</label>
              <select name="sortBy" id="sortBy" onChange={handleFilterChange}>
                <option value="">Default</option>
                <option value="price">Price</option>
                <option value="mileage">Mileage</option>
              </select>
            </div>

            <div className="filter-group">
              <label htmlFor="sortOrder">Order</label>
              <select
                name="sortOrder"
                id="sortOrder"
                onChange={handleFilterChange}
              >
                <option value="">Default</option>
                <option value="asc">Ascending</option>
                <option value="desc">Descending</option>
              </select>
            </div>
          </div>
          <button className="filter-apply-btn" onClick={applyFilters}>
            Apply Filters
          </button>
        </div>
        {/* Right Panel: Vehicle List */}
        <div className="vehicle-list">
          {vehicles.length > 0 ? (
            vehicles.map((vehicle) => {
              const isCompared = comparisonList.includes(vehicle.vid);
              return (
                <div key={vehicle.vid} className="vehicle-card">
                  <div className="vehicle-image">
                    <img
                      src={vehicle.imageUrl}
                      alt={vehicle.name}
                      className="vehicle-card-img"
                    />
                  </div>
                  {vehicle.isHotDeal && (
                    <div className="hot-deal-banner">Hot Deal</div>
                  )}
                  <h3 className="vehicle-name">{vehicle.name}</h3>
                  <div className="vehicle-details-info">
                    <div className="info-column">
                      <p>
                        <strong>Brand:</strong> {vehicle.brand}
                      </p>
                      <p>
                        <strong>Model Year:</strong> {vehicle.modelYear}
                      </p>
                      <p>
                        <strong>Shape:</strong> {vehicle.shape}
                      </p>
                    </div>
                    <div className="info-column">
                      <p>
                        <strong>Accidents:</strong>{" "}
                        {vehicle.hasAccidents ? "Yes" : "No"}
                      </p>
                      <p>
                        <strong>Mileage:</strong>{" "}
                        {vehicle.mileage.toLocaleString()} km
                      </p>
                      <p>
                        <strong>Price:</strong> $
                        {vehicle.price.toLocaleString()}
                      </p>
                    </div>
                  </div>

                  <div className="card-buttons">
                    <Link
                      className="card-button"
                      to={`/vehicle/${vehicle.vid}`}
                    >
                      View Details
                    </Link>
                    <button
                      className="card-button"
                      onClick={() => {
                        toggleComparison(vehicle.vid);
                        window.dispatchEvent(new Event("compareUpdated"));
                      }}
                    >
                      {comparisonList.includes(vehicle.vid)
                        ? "Remove from Compare"
                        : "Add to Compare"}
                    </button>
                  </div>
                </div>
              );
            })
          ) : (
            <p>No vehicles match your criteria. Try adjusting your filters.</p>
          )}
        </div>
      </div>

      {/* ChatBot Side Panel */}
      <Chatbot />
    </div>
  );
}

export default Home;
