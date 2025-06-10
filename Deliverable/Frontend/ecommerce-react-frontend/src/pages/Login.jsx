import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  // Handler for login form submission.
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch(
        `${process.env.REACT_APP_BACKEND_URL}/auth/login`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email, password }),
        }
      );

      const data = await res.json();
      if (res.ok) {
        // Save token in localStorage.
        localStorage.setItem("token", data.token);
        // Immediately fetch the user info based on the token.
        fetch(`${process.env.REACT_APP_BACKEND_URL}/auth/userInfo`, {
          headers: { Authorization: `Bearer ${data.token}` },
        })
          .then((response) => response.json())
          .then((userData) => {
            if (userData.user) {
              // Optionally store the user ID in localStorage if needed elsewhere.
              localStorage.setItem("userId", userData.user.id);
              localStorage.setItem("isAdmin", userData.user.isAdmin);
              alert("Login successful!");
              navigate("/");
            } else {
              alert("Login succeeded but failed to retrieve user details.");
            }
          })
          .catch((err) => {
            console.error("Error fetching user info:", err);
            alert("Login succeeded but failed to retrieve user details.");
          });
      } else {
        alert(data.error || "Invalid credentials");
      }
    } catch (error) {
      console.error("Login error:", error);
      alert("Login error. Please try again.");
    }
  };

  return (
    <div className="form-container">
      <h2>Sign In</h2>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
        <button type="submit" className="button">
          Login
        </button>
      </form>
      <p>
        Don't have an account? <Link to="/register">Register here</Link>
      </p>
    </div>
  );
}

export default Login;
