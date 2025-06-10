import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

const Authentication = () => {
  const [loginData, setLoginData] = useState({ email: "", password: "" });
  const [registerData, setRegisterData] = useState({
    fName: "",
    lName: "",
    email: "",
    password: "",
    address: "",
    city: "",
    prov: "",
    country: "",
    postalCode: "",
    num: "",
  });
  const [activeTab, setActiveTab] = useState("login");

  const navigate = useNavigate();

  const handleLoginChange = (e) => {
    const { name, value } = e.target;
    setLoginData({ ...loginData, [name]: value });
  };

  const handleRegisterChange = (e) => {
    const { name, value } = e.target;
    setRegisterData({ ...registerData, [name]: value });
  };

  const handleSubmitLogin = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch(
        `${process.env.REACT_APP_BACKEND_URL}/checkout/login`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(loginData),
        }
      );

      const data = await response.json();
      if (response.ok) {
        localStorage.setItem("token", data.token);
        alert("Login successful!");
        navigate("/Checkout");
      } else {
        alert(data.error);
      }
    } catch (error) {
      console.error("Login error:", error);
    }
  };

  const handleSubmitRegister = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch(
        `${process.env.REACT_APP_BACKEND_URL}/checkout/register`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(registerData),
        }
      );

      const data = await response.json();
      if (response.ok) {
        localStorage.setItem("token", data.token);
        alert("Registration successful!");
        navigate("/Checkout");
      } else {
        alert("Error: " + data.error);
      }
    } catch (error) {
      console.error("Registration error:", error);
    }
  };

  return (
    <>
      <h2 style={{ textAlign: "center" }}>Do you have an account with us?</h2>
      <div className="tabs">
        <div
          className={`login-tab ${activeTab === "login" ? "active" : ""}`}
          onClick={() => setActiveTab("login")}
        >
          Login
        </div>
        <div
          className={`register-tab ${activeTab === "register" ? "active" : ""}`}
          onClick={() => setActiveTab("register")}
        >
          Register
        </div>
      </div>

      {activeTab === "login" ? (
        <div className="form-container">
          <h2>Login</h2>
          <form onSubmit={handleSubmitLogin}>
            <label>Email:</label>
            <input
              type="text"
              name="email"
              value={loginData.email}
              onChange={handleLoginChange}
              required
            />
            <br />
            <br />
            <label>Password:</label>
            <input
              type="password"
              name="password"
              value={loginData.password}
              onChange={handleLoginChange}
              required
            />
            <br />
            <br />
            <button type="submit" className="button">
              Login
            </button>
          </form>
        </div>
      ) : (
        <div className="form-container">
          <form onSubmit={handleSubmitRegister}>
            <h2>Register</h2>
            <label>First Name:</label>
            <input
              type="text"
              name="fName"
              value={registerData.fName}
              onChange={handleRegisterChange}
              required
            />
            <br />
            <br />
            <label>Last Name:</label>
            <input
              type="text"
              name="lName"
              value={registerData.lName}
              onChange={handleRegisterChange}
              required
            />
            <br />
            <br />
            <label>Email:</label>
            <input
              type="text"
              name="email"
              value={registerData.email}
              onChange={handleRegisterChange}
              required
            />
            <br />
            <br />
            <label>Password:</label>
            <input
              type="password"
              name="password"
              value={registerData.password}
              onChange={handleRegisterChange}
              required
            />
            <br />
            <br />
            <h3>Default Shipping Information</h3>
            <br />
            <label>Address:</label>
            <input
              type="text"
              name="address"
              value={registerData.address}
              onChange={handleRegisterChange}
              required
            />
            <br />
            <br />
            <label>City:</label>
            <input
              type="text"
              name="city"
              value={registerData.city}
              onChange={handleRegisterChange}
              required
            />
            <br />
            <br />
            <label>Province:</label>
            <input
              type="text"
              name="prov"
              value={registerData.prov}
              onChange={handleRegisterChange}
              required
            />
            <br />
            <br />
            <label>Country:</label>
            <input
              type="text"
              name="country"
              value={registerData.country}
              onChange={handleRegisterChange}
              required
            />
            <br />
            <br />
            <label>Postal Code:</label>
            <input
              type="text"
              name="postalCode"
              value={registerData.postalCode}
              onChange={handleRegisterChange}
              required
            />
            <br />
            <br />
            <label>Phone Number:</label>
            <input
              type="text"
              name="num"
              value={registerData.num}
              onChange={handleRegisterChange}
            />
            <br />
            <br />
            <button type="submit" className="button">
              Register
            </button>
          </form>
        </div>
      )}

      <a href="/Checkout" className="guest-link">
        Continue as guest
      </a>
    </>
  );
};

export default Authentication;
