import React, { useEffect, useState } from "react";
import { useNavigate, Link } from "react-router-dom";

function Cart() {
  const [cart, setCart] = useState([]);
  const [totalPrice, setTotalPrice] = useState(0);
  const navigate = useNavigate();

  const fetchCart = async () => {
    try {
      const res = await fetch("/api/cart");
      const data = await res.json();
      setCart(data.cart);
      setTotalPrice(data.totalPrice);
    } catch (error) {
      console.error("Error fetching cart:", error);
    }
  };

  useEffect(() => {
    fetchCart();
  }, []);

  const updateQuantity = async (cartItemId, newQuantity) => {
    try {
      // If newQuantity is less than 1, remove the item instead
      if (newQuantity < 1) {
        removeItem(cartItemId);
        return;
      }

      // Otherwise, send a request to update the quantity
      await fetch(`/api/cart/update/${cartItemId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ quantity: newQuantity }),
      });

      // Fetch the updated cart to refresh the UI
      fetchCart();
    } catch (error) {
      console.error("Error updating quantity:", error);
    }
  };

  const removeItem = async (cartItemId) => {
    try {
      await fetch(`/api/cart/remove/${cartItemId}`, {
        method: "DELETE",
      });
      fetchCart();
    } catch (error) {
      console.error("Error removing item:", error);
    }
  };

  const clearCart = async () => {
    if (window.confirm("Are you sure you want to clear your cart?")) {
      try {
        await fetch(`/api/cart/clear`, {
          method: "DELETE",
        });
        fetchCart();
        window.dispatchEvent(new Event("cartUpdated"));
      } catch (error) {
        console.error("Error clearing cart:", error);
      }
    }
  };

  const checkoutBtn = async () => {
    //get token from local storage
    const token = localStorage.getItem("token");
    //If token is non-existent, send to authentication.html to sign in/register
    if (!token) {
      navigate("/Authentication");
    }
    //if token exists, verify token
    else {
      fetch("/checkout/authenticateCheckout", {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      })
        .then((response) => response.json())
        .then((data) => {
          //checks log in status to determine redirect
          if (data.loginStatus) {
            navigate("/checkout");
          } else {
            navigate("/Authentication");
          }
        })
        .catch((error) => {
          console.error("Error during checkout:", error);
        });
    }
  };

  return (
    <div>
      <h2>Your Shopping Cart</h2>
      {cart.length === 0 ? (
        <div>
          <p>Your cart is empty.</p>
          <Link className="button" to="/">
            Continue Shopping
          </Link>
        </div>
      ) : (
        <div>
          <table style={{ width: "100%", marginBottom: "20px" }}>
            <thead>
              <tr>
                <th>Vehicle</th>
                <th>Price</th>
                <th>Quantity</th>
                <th>Total</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {cart.map((item) => (
                <tr key={item.cartItemId}>
                  <td style={{ textAlign: "center" }}>{item.name}</td>
                  <td style={{ textAlign: "center" }}>
                    ${item.price.toFixed(2)}
                  </td>
                  <td style={{ textAlign: "center" }}>
                    <button
                      onClick={() => {
                        updateQuantity(item.cartItemId, item.quantity - 1);
                        window.dispatchEvent(new Event("cartUpdated"));
                      }}
                    >
                      -
                    </button>
                    <span style={{ margin: "0 10px" }}>{item.quantity}</span>
                    <button
                      onClick={() => {
                        updateQuantity(item.cartItemId, item.quantity + 1);
                        window.dispatchEvent(new Event("cartUpdated"));
                      }}
                    >
                      +
                    </button>
                  </td>
                  <td style={{ textAlign: "center" }}>
                    ${(item.price * item.quantity).toFixed(2)}
                  </td>
                  <td style={{ textAlign: "center" }}>
                    <button
                      onClick={() => {
                        removeItem(item.cartItemId);
                        window.dispatchEvent(new Event("cartUpdated"));
                      }}
                      className="button"
                    >
                      Remove
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          <h3>Total: ${totalPrice.toFixed(2)}</h3>
          <div>
            <button className="button" onClick={clearCart}>
              Clear Cart
            </button>
            <button
              className="button"
              onClick={checkoutBtn}
              style={{ marginLeft: "10px" }}
            >
              Proceed to Checkout
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default Cart;
