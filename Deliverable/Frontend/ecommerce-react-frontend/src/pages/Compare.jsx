// Compare.jsx

import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";

function Compare() {
  const [vehicles, setVehicles] = useState([]);
  const [comparisonList, setComparisonList] = useState([]);
  const COMPARE_STORAGE_KEY = "vehicles_to_compare";

  useEffect(() => {
    const stored = localStorage.getItem(COMPARE_STORAGE_KEY);
    if (stored) {
      const ids = JSON.parse(stored);
      setComparisonList(ids);
      if (ids.length === 1) {
        // Duplicate the only ID to satisfy backend's minimum requirement.
        fetchComparison([ids[0], ids[0]]);
      } else if (ids.length >= 2) {
        fetchComparison(ids);
      }
    }
  }, []);

  const fetchComparison = async (idsToFetch) => {
    try {
      const res = await fetch(
        `${
          import.meta.env.VITE_BACKEND_URL
        }/api/catalog/compare?ids=${idsToFetch.join(",")}`,
        {
          credentials: "include",
        }
      );
      const data = await res.json();
      setVehicles(data);
    } catch (error) {
      console.error("Error fetching comparison:", error);
    }
  };

  // Instead of checking for at least 2 items, only check for at least 1.
  if (comparisonList.length < 1) {
    return (
      <div className="compare-container">
        <h2>Comparison</h2>
        <p>Please add at least one vehicle to compare.</p>
        <Link className="button" to="/">
          Back to Catalog
        </Link>
      </div>
    );
  }

  // If only one vehicle was added, remove the duplicated copy for display.
  const vehiclesToDisplay =
    comparisonList.length === 1 && vehicles.length === 2
      ? vehicles.slice(0, 1)
      : vehicles;

  return (
    <div className="compare-container">
      <h2>Vehicle Comparison</h2>
      <div className="table-responsive">
        <table className="compare-table">
          <thead>
            <tr>
              <th>Feature</th>
              {vehiclesToDisplay.map((vehicle) => (
                <th key={vehicle.vid}>
                  <div className="vehicle-header">
                    <span className="vehicle-name">{vehicle.name}</span>
                    <button
                      className="remove-btn"
                      onClick={() => handleRemoveVehicle(vehicle.vid)}
                    >
                      Remove
                    </button>
                  </div>
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>Brand</td>
              {vehiclesToDisplay.map((vehicle) => (
                <td key={vehicle.vid}>{vehicle.brand}</td>
              ))}
            </tr>
            <tr>
              <td>Model</td>
              {vehiclesToDisplay.map((vehicle) => (
                <td key={vehicle.vid}>{vehicle.model}</td>
              ))}
            </tr>
            <tr>
              <td>Year</td>
              {vehiclesToDisplay.map((vehicle) => (
                <td key={vehicle.vid}>{vehicle.modelYear}</td>
              ))}
            </tr>
            <tr>
              <td>Price</td>
              {vehiclesToDisplay.map((vehicle) => (
                <td key={vehicle.vid}>${vehicle.price.toLocaleString()}</td>
              ))}
            </tr>
            <tr>
              <td>Mileage</td>
              {vehiclesToDisplay.map((vehicle) => (
                <td key={vehicle.vid}>{vehicle.mileage.toLocaleString()} km</td>
              ))}
            </tr>
            <tr>
              <td>Shape</td>
              {vehiclesToDisplay.map((vehicle) => (
                <td key={vehicle.vid}>{vehicle.shape}</td>
              ))}
            </tr>
            <tr>
              <td>Hot Deal</td>
              {vehiclesToDisplay.map((vehicle) => (
                <td key={vehicle.vid}>{vehicle.isHotDeal ? "Yes" : "No"}</td>
              ))}
            </tr>
          </tbody>
        </table>
      </div>
      <div className="actions">
        <button className="button" onClick={handleClearComparison}>
          Clear Comparison
        </button>
      </div>
    </div>
  );
}

const handleRemoveVehicle = (vehicleId) => {
  // const stored = JSON.parse(
  //   localStorage.getItem("vehicles_to_compare") || "[]"
  // );
  // const updated = stored.filter((id) => id !== vehicleId);
  // localStorage.setItem("vehicles_to_compare", JSON.stringify(updated));
  // window.dispatchEvent(new Event("compareUpdated"));
  // setVehicles(updated);
  const updated = vehicles.filter((v) => v.id !== vehicleId);
  setVehicles(updated);
  const idsOnly = updated.map((v) => v.id);
  localStorage.setItem("vehicles_to_compare", JSON.stringify(idsOnly));
};

const handleClearComparison = () => {
  // localStorage.removeItem("vehicles_to_compare");
  // window.dispatchEvent(new Event("compareUpdated"));
  // setVehicles([]);
  setVehicles([]);
  localStorage.removeItem("vehicles_to_compare");
  window.dispatchEvent(new Event("compareUpdated"));
};

export default Compare;
