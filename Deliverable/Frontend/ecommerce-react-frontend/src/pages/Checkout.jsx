import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import LoanCalculator from "../components/LoanCalculator";
require("dotenv").config();

function Checkout() {
  const navigate = useNavigate();
  const [shippingInfo, setShippingInfo] = useState({});
  const [payment, setPayment] = useState({
    cardNum: "",
    cardName: "",
    cardExp: "",
    cvv: "",
  });
  const [orderData, setOrderData] = useState({
    total: 0,
    cartData: [],
  });
  const [showLoanCalc, setShowLoanCalc] = useState(false);
  const [isEditing, setIsEditing] = useState(false);

  useEffect(() => {
    console.log("Fetching shipping info..."); // Check if useEffect is being triggered
    fetchCart();
    fetchShipping();
  }, []);

  const fetchCart = async () => {
    try {
      const res = await fetch(`${process.env.BACKEND_URL}/api/cart`);
      const data = await res.json();
      setOrderData({ total: data.totalPrice, cartData: data.cart });
    } catch (error) {
      console.error("Error fetching cart:", error);
    }
  };

  const fetchShipping = async () => {
    const token = localStorage.getItem("token");
    if (token) {
      try {
        const res = await fetch(
          `${process.env.BACKEND_URL}/checkout/fetchShippingInfo`,
          {
            method: "GET",
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        const data = await res.json();
        console.log("Fetched shipping data:", data.shipping);
        if (data.hasShipping) {
          setShippingInfo(data.shipping);
        }
      } catch (error) {
        console.error("Error fetching shipping info:", error);
      }
    }
  };

  const handlePaymentChange = (e) => {
    setPayment({ ...payment, [e.target.name]: e.target.value });
  };

  const handleShippingChange = (e) => {
    setIsEditing(true);
    setShippingInfo((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const clearCart = async () => {
    try {
      const res = await fetch(`${process.env.BACKEND_URL}/api/cart/clear`, {
        method: "DELETE",
      });
      const data = await res.json();
      console.log("Cart cleared:", data);
      window.dispatchEvent(new Event("cartUpdated"));
    } catch (error) {
      console.error("Error clearing cart:", error);
    }
  };

  const handleSubmitOrder = async (e) => {
    e.preventDefault();
    if (orderData.cartData.length === 0) {
      alert("Your cart is empty.");
      return;
    }
    const token = localStorage.getItem("token");
    const body = {
      total: orderData.total,
      guest: !token,
      address: shippingInfo.street || "",
      city: shippingInfo.city || "",
      prov: shippingInfo.province || "",
      country: shippingInfo.country || "",
      postalCode: shippingInfo.zip || "",
      num: shippingInfo.phoneNum || "",
      cardNum: payment.cardNum,
      cardName: payment.cardName,
      cardExp: payment.cardExp,
      cvv: payment.cvv,
      cartData: orderData.cartData,
    };

    //console.log("Submitting order with data:", body);
    //console.log("Shipping Info:", shippingInfo);
    //console.log("Address being sent:", shippingInfo.address);
    try {
      const res = await fetch(
        `${process.env.BACKEND_URL}/checkout/orderController`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            ...(token && { Authorization: `Bearer ${token}` }),
          },
          body: JSON.stringify(body),
        }
      );
      const data = await res.json();
      if (res.ok) {
        alert("Order Successfully Completed!");
        // Clear the cart after successful order submission
        await clearCart();
        navigate("/");
      } else {
        alert(data.error || "Credit Card Authorization Failed.");
      }
    } catch (error) {
      console.error("Checkout error:", error);
      alert("Checkout error. Please try again.");
    }
  };

  function calculateTotal() {
    const tax = orderData.total * 0.13;
    const totalPrice = orderData.total + tax + 15;
    return totalPrice;
  }

  return (
    <div>
      <div className="total-container">
        <div className="total-section-component">
          <p className="total-section-headings">Sub-total:</p>
          <span className="total-section-span">
            ${orderData.total.toFixed(2)}
          </span>
        </div>

        <div className="total-section-component">
          <p className="total-section-headings">Estimated Shipping:</p>
          <span className="total-section-span">$15.00</span>
        </div>

        <div className="total-section-component">
          <p className="total-section-headings">Estimated Tax:</p>
          <span className="total-section-span">
            ${(orderData.total * 0.13).toFixed(2)}
          </span>
        </div>

        <div className="total-section-component">
          <h3 className="total-section-headings">Grand Total:</h3>
          <h3 className="total-section-span">${calculateTotal().toFixed(2)}</h3>
        </div>
      </div>
      <form className="form-container" onSubmit={handleSubmitOrder}>
        <h3>Shipping Information</h3>
        {isEditing || !shippingInfo.address ? (
          <div>
            <input
              type="text"
              placeholder="Address"
              name="street"
              value={shippingInfo.street || ""}
              onChange={handleShippingChange}
              required
            />
            <input
              type="text"
              placeholder="City"
              name="city"
              value={shippingInfo.city || ""}
              onChange={handleShippingChange}
              required
            />
            <input
              type="text"
              placeholder="Province/Territory"
              name="province"
              value={shippingInfo.province || ""}
              onChange={handleShippingChange}
              required
            />
            <input
              type="text"
              placeholder="Country"
              name="country"
              value={shippingInfo.country || ""}
              onChange={handleShippingChange}
              required
            />
            <input
              type="text"
              placeholder="Postal Code"
              name="zip"
              value={shippingInfo.zip || ""}
              onChange={handleShippingChange}
              required
            />
            <input
              type="text"
              placeholder="Phone Number (Optional)"
              name="phoneNum"
              value={shippingInfo.phoneNum || ""}
              onChange={handleShippingChange}
            />
          </div>
        ) : (
          <div>
            <p>
              <strong>Address:</strong> {shippingInfo.street}
            </p>
            <p>
              <strong>City:</strong> {shippingInfo.city}
            </p>
            <p>
              <strong>Province:</strong> {shippingInfo.province}
            </p>
            <p>
              <strong>Country:</strong> {shippingInfo.country}
            </p>
            <p>
              <strong>Postal Code:</strong> {shippingInfo.zip}
            </p>
            <p>
              <strong>Phone Number:</strong> {shippingInfo.phoneNum || "N/A"}
            </p>
          </div>
        )}

        <h3>Payment Information</h3>
        <input
          type="text"
          placeholder="Card Number"
          name="cardNum"
          value={payment.cardNum}
          onChange={handlePaymentChange}
          required
        />
        <input
          type="text"
          placeholder="Name on Card"
          name="cardName"
          value={payment.cardName}
          onChange={handlePaymentChange}
          required
        />
        <input
          type="text"
          placeholder="Expiry Date (MM/YY)"
          name="cardExp"
          value={payment.cardExp}
          onChange={handlePaymentChange}
          required
        />
        <input
          type="text"
          placeholder="CVV"
          name="cvv"
          value={payment.cvv}
          onChange={handlePaymentChange}
          required
        />
        <button type="submit" className="button">
          Confirm Order
        </button>
      </form>
      <div style={{ marginTop: "20px" }}>
        <button className="button" onClick={() => setShowLoanCalc(true)}>
          Try Loan Calculator
        </button>
      </div>
      {showLoanCalc && (
        <LoanCalculator onClose={() => setShowLoanCalc(false)} />
      )}
    </div>
  );
}

export default Checkout;
