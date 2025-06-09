import React, { useState } from "react";
import { Link } from "react-router-dom";

function ContactUs() {
  const [formData, setFormData] = useState({
    email: "",
    message: "",
  });
  const [submitted, setSubmitted] = useState(false);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    // Basic client-side validation
    if (!formData.email.trim() || !formData.message.trim()) {
      alert("Both fields are required.");
      return;
    }

    console.log("Contact form submitted:", formData);

    setSubmitted(true);

    setTimeout(() => {
      setSubmitted(false);
      setFormData({ email: "", message: "" });
    }, 3000);
  };

  return (
    <div className="form-container" style={{ marginTop: "20px" }}>
      <h2>Contact Us</h2>
      {submitted && (
        <p style={{ color: "green" }}>Your message has been sent!</p>
      )}
      <form onSubmit={handleSubmit}>
        <label htmlFor="email">Email:</label>
        <input
          type="email"
          name="email"
          id="email"
          placeholder="Enter your email"
          value={formData.email}
          onChange={handleChange}
          required
        />

        <label htmlFor="message">Message:</label>
        <textarea
          name="message"
          id="message"
          rows="6"
          placeholder="Enter your message"
          value={formData.message}
          onChange={handleChange}
          required
        ></textarea>

        <button type="submit" className="button">
          Send Message
        </button>
      </form>
      <div style={{ marginTop: "30px" }}>
        <Link className="button" style={{ textDecoration: "none" }} to="/">
          Return to Home
        </Link>
      </div>
    </div>
  );
}

export default ContactUs;
