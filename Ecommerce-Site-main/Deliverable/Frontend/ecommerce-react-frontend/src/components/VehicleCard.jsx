import React from 'react';
import { Link } from 'react-router-dom';

const VehicleCard = ({ vehicle }) => {
  return (
    <div className="vehicle-card">
      {vehicle.isHotDeal && <span className="hot-deal">Hot Deal</span>}
      <h3>{vehicle.name}</h3>
      <p><strong>Brand:</strong> {vehicle.brand}</p>
      <p><strong>Model:</strong> {vehicle.model} ({vehicle.modelYear})</p>
      <p><strong>Price:</strong> ${vehicle.price.toLocaleString()}</p>
      <div className="card-actions">
        <Link to={`/vehicle/${vehicle.vid}`}>
          <button>View Details</button>
        </Link>
        <button onClick={() => alert(`${vehicle.name} added to cart!`)}>
          Add to Cart
        </button>
      </div>
    </div>
  );
};

export default VehicleCard;
