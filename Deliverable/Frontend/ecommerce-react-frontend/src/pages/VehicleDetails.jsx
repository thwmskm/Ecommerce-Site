// File: src/pages/VehicleDetails.jsx
import React, { useEffect, useState, useRef } from "react";
import { useParams } from "react-router-dom";
require("dotenv").config();

function VehicleDetails() {
  const { id } = useParams();
  const [vehicle, setVehicle] = useState(null);
  const [reviews, setReviews] = useState([]);
  const [customOptions, setCustomOptions] = useState({});
  const [selectedCustoms, setSelectedCustoms] = useState({});
  const [finalPrice, setFinalPrice] = useState(null);
  const [reviewData, setReviewData] = useState({ rating: "5", comment: "" });
  const hasLoggedRef = useRef(false);

  // Retrieve current user id from localStorage, if any.
  const currentUserId = localStorage.getItem("userId");
  // Log view event
  async function logVisitEvent(eventtype = "VIEW") {
    try {
      const ipRes = await fetch("https://api.ipify.org?format=json");
      const ipData = await ipRes.json();
      const userIp = ipData.ip;

      let route = "";
      if (eventtype === "VIEW") {
        route = "view-details";
      } else if (eventtype === "CART") {
        route = "add-to-cart";
      } else if (eventtype === "PURCHASE") {
        route = "purchase";
      }

      await fetch(`${process.env.BACKEND_URL}/events/${route}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ipaddress: userIp,
          day: getTodayDate(),
          vid: id,
        }),
      });
    } catch (err) {
      console.error(`❌ Failed to log ${eventtype} event:`, err);
    }
  }

  // Utility to format today's date as MMDDYYYY
  function getTodayDate() {
    const today = new Date();
    return `${String(today.getMonth() + 1).padStart(2, "0")}${String(
      today.getDate()
    ).padStart(2, "0")}${today.getFullYear()}`;
  }

  // Fetch vehicle details, custom options, and reviews.
  useEffect(() => {
    async function fetchVehicle() {
      try {
        const res = await fetch(
          `${process.env.BACKEND_URL}/api/catalog/vehicles/${id}`
        );
        const data = await res.json();
        setVehicle(data);
        setFinalPrice(data.price);
      } catch (err) {
        console.error("Error fetching vehicle details:", err);
      }
    }

    async function fetchCustomOptions() {
      try {
        const res = await fetch(
          `${process.env.BACKEND_URL}/api/catalog/vehicles/${id}/customizations`
        );
        const data = await res.json();
        // Assume data is grouped by category.
        setCustomOptions(data);
      } catch (err) {
        console.error("Error fetching customization options:", err);
      }
    }

    async function fetchReviews() {
      try {
        const res = await fetch(
          `${process.env.BACKEND_URL}/api/catalog/vehicles/${id}/reviews`
        );
        const data = await res.json();
        setReviews(data);
      } catch (err) {
        console.error("Error fetching reviews:", err);
      }
    }

    let hasLogged = false;

    fetchVehicle();
    fetchCustomOptions();
    fetchReviews();

    if (!hasLoggedRef.current) {
      logVisitEvent();
      hasLoggedRef.current = true;
    }
  }, [id]);

  // Toggle a customization option: deselect if already selected.
  const handleCustomizationClick = (category, optionId) => {
    setSelectedCustoms((prev) => {
      if (prev[category] === optionId) {
        const updated = { ...prev };
        delete updated[category];
        return updated;
      } else {
        return { ...prev, [category]: optionId };
      }
    });
  };

  // Apply customizations.
  const applyCustomizations = async () => {
    const customizationIds = Object.values(selectedCustoms);
    try {
      const res = await fetch(
        `${process.env.BACKEND_URL}/api/catalog/vehicles/apply-customization`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ vehicleId: id, customizationIds }),
        }
      );
      const data = await res.json();
      setFinalPrice(data.finalPrice);
      alert("Customizations applied! Final price updated.");
    } catch (err) {
      console.error("Error applying customizations:", err);
      alert("There was an error applying your customizations.");
    }
  };

  // Handle changes in the review form.
  const handleReviewChange = (e) => {
    const { name, value } = e.target;
    setReviewData((prev) => ({ ...prev, [name]: value }));
  };

  // Check if the current user already reviewed the vehicle.
  const hasUserReviewed = currentUserId
    ? reviews.some((review) => String(review.userId) === String(currentUserId))
    : false;

  // Submit a new review.
  const handleReviewSubmit = async (e) => {
    e.preventDefault();
    if (!currentUserId) {
      alert("Please log in to leave a review.");
      return;
    }
    if (hasUserReviewed) {
      alert("You have already reviewed this vehicle.");
      return;
    }
    try {
      const res = await fetch(
        `${process.env.BACKEND_URL}/api/catalog/vehicles/reviews`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            vehicleId: id,
            userId: currentUserId,
            rating: Number(reviewData.rating),
            comment: reviewData.comment,
          }),
        }
      );
      if (res.ok) {
        const newReviewsRes = await fetch(
          `${process.env.BACKEND_URL}/api/catalog/vehicles/${id}/reviews`
        );
        const newReviews = await newReviewsRes.json();
        setReviews(newReviews);
        setReviewData({ rating: "5", comment: "" });
        alert("Review submitted successfully.");
      } else {
        const errorData = await res.json();
        alert(errorData.error || "Failed to submit review.");
      }
    } catch (err) {
      console.error("Error submitting review:", err);
      alert("Error submitting review.");
    }
  };

  // Add to Cart functionality using your working old code's logic.
  const addToCart = () => {
    if (!vehicle) return;
    const payload = {
      vehicleId: vehicle.vid,
      name: vehicle.name,
      price: finalPrice,
      quantity: 1,
      customizations: selectedCustoms,
    };

    fetch(`${process.env.BACKEND_URL}/api/cart/add`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    })
      .then((res) => res.json())
      .then(() => {
        logVisitEvent("CART"); // ✅ Log the event
        alert("Vehicle added to cart!");
        window.dispatchEvent(new Event("cartUpdated"));
      })
      .catch((err) => console.error("Error adding to cart:", err));
  };

  if (!vehicle) return <p>Loading vehicle details...</p>;

  return (
    <div className="vehicle-details-container">
      {/* Top Section: Vehicle Image and Details */}
      <div className="vehicle-details-top">
        <div className="vehicle-image-section">
          <img
            src={vehicle.imageUrl}
            alt={vehicle.name}
            className="vehicle-detail-image"
          />
        </div>
        <div className="vehicle-info-section">
          <h1>{vehicle.name}</h1>
          {vehicle.isNew && <span className="vehicle-tag">New Arrival</span>}
          <p className="vehicle-price">
            $
            {finalPrice
              ? parseFloat(finalPrice).toLocaleString()
              : vehicle.price.toLocaleString()}
          </p>
          <p className="vehicle-description">{vehicle.description}</p>

          {/* Customization Options (Toggleable Buttons) */}
          {Object.keys(customOptions).length > 0 && (
            <div className="customization-section">
              <h3>Customization Options</h3>
              {Object.entries(customOptions).map(([category, options]) => (
                <div key={category} className="customization-category">
                  <label>{category}</label>
                  <div className="customization-options">
                    {options.map((option) => (
                      <button
                        key={option.id}
                        type="button"
                        className={`custom-option-button ${
                          selectedCustoms[category] === option.id
                            ? "selected"
                            : ""
                        }`}
                        onClick={() =>
                          handleCustomizationClick(category, option.id)
                        }
                      >
                        {option.name}
                        {option.priceAdjustment > 0 &&
                          ` (+$${option.priceAdjustment})`}
                      </button>
                    ))}
                  </div>
                </div>
              ))}
              <button className="button" onClick={applyCustomizations}>
                Apply Customizations
              </button>
            </div>
          )}

          {/* Add to Cart Button */}
          <button
            className="button"
            style={{ marginTop: "16px" }}
            onClick={addToCart}
          >
            Add to Cart
          </button>
        </div>
      </div>

      {/* Reviews Section */}
      <div className="reviews-section">
        <h2>Latest Reviews</h2>
        {reviews.length > 0 ? (
          <div className="reviews-container">
            {reviews.map((review) => (
              <div key={review.id} className="review-card">
                <div className="star-rating">
                  {"★".repeat(review.rating)}
                  {"☆".repeat(5 - review.rating)}
                </div>
                <h4 className="review-title">
                  {review.comment.substring(0, 40)}
                </h4>
                <p className="review-body">{review.comment}</p>
                <p className="review-author">
                  {review.user?.fName} {review.user?.lName} –{" "}
                  {new Date(review.createdAt).toLocaleDateString()}
                </p>
              </div>
            ))}
          </div>
        ) : (
          <p>No reviews yet. Be the first to review this vehicle.</p>
        )}

        {/* Leave a Review */}
        {currentUserId ? (
          hasUserReviewed ? (
            <p>You have already reviewed this vehicle.</p>
          ) : (
            <div className="leave-review">
              <h2>Leave a Review</h2>
              <form onSubmit={handleReviewSubmit}>
                <label>Rating:</label>
                <select
                  name="rating"
                  value={reviewData.rating}
                  onChange={handleReviewChange}
                >
                  <option value="1">1 Star</option>
                  <option value="2">2 Stars</option>
                  <option value="3">3 Stars</option>
                  <option value="4">4 Stars</option>
                  <option value="5">5 Stars</option>
                </select>
                <label>Comment:</label>
                <textarea
                  name="comment"
                  value={reviewData.comment}
                  onChange={handleReviewChange}
                  required
                ></textarea>
                <button type="submit" className="button">
                  Submit Review
                </button>
              </form>
            </div>
          )
        ) : (
          <p>
            Please <em>log in</em> to leave a review.
          </p>
        )}
      </div>

      {/* Additional Information Section */}
      <div className="additional-info">
        <h2>Additional Information</h2>
        <div className="info-grid">
          <div className="info-item">
            <h4>Brand</h4>
            <p>{vehicle.brand}</p>
          </div>
          <div className="info-item">
            <h4>Model Year</h4>
            <p>{vehicle.modelYear}</p>
          </div>
          <div className="info-item">
            <h4>Mileage</h4>
            <p>{vehicle.mileage.toLocaleString()} km</p>
          </div>
          <div className="info-item">
            <h4>Had Accidents</h4>
            <p>{vehicle.hasAccidents ? "Yes" : "No"}</p>
          </div>
          {vehicle.hasAccidents && vehicle.historyReport && (
            <div className="info-item">
              <h4>Accident History</h4>
              <p>{vehicle.historyReport}</p>
            </div>
          )}
          <div className="info-item">
            <h4>Exterior Color</h4>
            <p>{vehicle.exColour}</p>
          </div>
          <div className="info-item">
            <h4>Interior Color</h4>
            <p>{vehicle.inColour}</p>
          </div>
          <div className="info-item">
            <h4>Interior Fabric</h4>
            <p>{vehicle.inFabric}</p>
          </div>
          <div className="info-item">
            <h4>Shape</h4>
            <p>{vehicle.shape}</p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default VehicleDetails;
