import React, { useState, useEffect } from "react";

const Shipping = () => {
  const [shipping, setShipping] = useState(null);
  const [formVisible, setFormVisible] = useState(false);
  const [formData, setFormData] = useState({
    address: "",
    city: "",
    prov: "",
    country: "",
    postalCode: "",
  });

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      setFormVisible(true);
      return;
    }

    fetch("/checkout/fetchShippingInfo", {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((response) => response.json())
      .then((data) => {
        if (data.hasShipping) {
          setShipping({
            ...data.shipping,
            address: data.shipping.street || data.shipping.address,
          });
        } else {
          setFormVisible(true);
        }
      })
      .catch((error) => {
        console.error("Error fetching shipping info:", error);
        setFormVisible(true);
      });
  }, []);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  return (
    <div>
      {shipping ? (
        <div>
          <p>Address: {shipping.address || shipping.street}</p>
          <p>City: {shipping.city}</p>
          <p>Province: {shipping.prov || shipping.province}</p>
          <p>Country: {shipping.country}</p>
          <p>Postal Code: {shipping.postalCode || shipping.zip}</p>
          <p>Phone Number: {shipping.num || shipping.phoneNum || "N/A"}</p>
        </div>
      ) : formVisible ? (
        <form>
          <label>
            Address:
            <input
              type="text"
              name="address"
              value={formData.address}
              onChange={handleChange}
            />
          </label>
          <label>
            City:
            <input
              type="text"
              name="city"
              value={formData.city}
              onChange={handleChange}
            />
          </label>
          <label>
            Province:
            <input
              type="text"
              name="prov"
              value={formData.prov}
              onChange={handleChange}
            />
          </label>
          <label>
            Country:
            <input
              type="text"
              name="country"
              value={formData.country}
              onChange={handleChange}
            />
          </label>
          <label>
            Postal Code:
            <input
              type="text"
              name="postalCode"
              value={formData.postalCode}
              onChange={handleChange}
            />
          </label>
        </form>
      ) : (
        <p>Loading shipping information...</p>
      )}
    </div>
  );
};

export default Shipping;
