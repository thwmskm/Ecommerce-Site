import React, { useState, useEffect } from "react";

// Cart Component
const Cart = ({ onUpdate }) => {
  const [cart, setCart] = useState([]);
  const [total, setTotal] = useState(0);

  useEffect(() => {
    fetch(`${import.meta.env.VITE_BACKEND_URL}/api/cart`, {
      credentials: "include",
    })
      .then((response) => response.json())
      .then((data) => {
        setCart(data.cart);
        setTotal(data.totalPrice);
      });
  }, []);

  const handleQuantityChange = (vehicleId, newQuantity) => {
    if (newQuantity < 1) return;
    fetch(`${import.meta.env.VITE_BACKEND_URL}/api/cart/update/${vehicleId}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ quantity: newQuantity }),
      credentials: "include",
    }).then(() => onUpdate());
  };

  return (
    <div>
      <h3>Your Cart</h3>
      {cart.length === 0 ? (
        <p>Your cart is empty.</p>
      ) : (
        <table>
          <thead>
            <tr>
              <th>Vehicle</th>
              <th>Price</th>
              <th>Quantity</th>
              <th>Total</th>
            </tr>
          </thead>
          <tbody>
            {cart.map((item) => (
              <tr key={item.vehicleId}>
                <td>{item.name}</td>
                <td>${item.price.toFixed(2)}</td>
                <td>
                  <button
                    onClick={() =>
                      handleQuantityChange(item.vehicleId, item.quantity - 1)
                    }
                  >
                    -
                  </button>
                  {item.quantity}
                  <button
                    onClick={() =>
                      handleQuantityChange(item.vehicleId, item.quantity + 1)
                    }
                  >
                    +
                  </button>
                </td>
                <td>${(item.price * item.quantity).toFixed(2)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default Cart;
