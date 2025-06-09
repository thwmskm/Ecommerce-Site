import React, { useState } from "react";

function LoanCalculator({ onClose }) {
  const [price, setPrice] = useState("");
  const [downPayment, setDownPayment] = useState("");
  const [interestRate, setInterestRate] = useState("");
  const [duration, setDuration] = useState("");
  const [monthlyPayment, setMonthlyPayment] = useState(null);

  const calculateLoan = (e) => {
    e.preventDefault();
    const loanAmount = parseFloat(price) - parseFloat(downPayment);
    const monthlyInterest = parseFloat(interestRate) / 100 / 12;
    const months = parseFloat(duration);

    if (loanAmount <= 0 || monthlyInterest <= 0 || months <= 0) {
      alert("Please enter valid values.");
      return;
    }
    const payment =
      (loanAmount * monthlyInterest) /
      (1 - Math.pow(1 + monthlyInterest, -months));
    setMonthlyPayment(payment.toFixed(2));
  };

  return (
    <div className="modal">
      <div className="modal-content">
        <button className="close-btn" onClick={onClose}>
          Close
        </button>
        <h2>Loan Calculator</h2>
        <form className="calc-form" onSubmit={calculateLoan}>
          <label>Vehicle Price:</label>
          <input
            className="calc-input"
            type="number"
            value={price}
            onChange={(e) => setPrice(e.target.value)}
            required
          />

          <label>Down Payment:</label>
          <input
            className="calc-input"
            type="number"
            value={downPayment}
            onChange={(e) => setDownPayment(e.target.value)}
            required
          />

          <label>Interest Rate (% per annum):</label>
          <input
            className="calc-input"
            type="number"
            step="0.01"
            value={interestRate}
            onChange={(e) => setInterestRate(e.target.value)}
            required
          />

          <label>Loan Duration (months):</label>
          <input
            className="calc-input"
            type="number"
            value={duration}
            onChange={(e) => setDuration(e.target.value)}
            required
          />

          <button type="submit" className="button calc-input">
            Calculate
          </button>
        </form>
        {monthlyPayment && (
          <p>
            Your estimated monthly payment is:{" "}
            <strong>${monthlyPayment}</strong>
          </p>
        )}
      </div>
    </div>
  );
}

export default LoanCalculator;
