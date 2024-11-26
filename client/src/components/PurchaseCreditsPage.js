// src/components/PurchaseCreditsPage.js
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './PurchaseCreditsPage.css';

const PurchaseCreditsPage = () => {
  const navigate = useNavigate();

  // State to track the number of credits selected
  const [creditCounts, setCreditCounts] = useState({
    5: 0,
    20: 0,
    40: 0,
  });

  // Calculate total credits and total cost
  const totalCredits = Object.entries(creditCounts).reduce(
    (sum, [key, value]) => sum + parseInt(key) * value,
    0
  );

  const totalCost = Object.entries(creditCounts).reduce(
    (sum, [key, value]) => sum + value * parseInt(key),
    0
  );

  const handleCreditChange = (type, value) => {
    setCreditCounts((prev) => ({
      ...prev,
      [type]: value,
    }));
  };

  const handleCheckout = () => {
    navigate('/checkout', { state: { creditCounts, totalCredits, totalCost } });
  };

  return (
    <div className="purchase-credits-container">
      <h1>Purchase Credits</h1>
      <table className="credits-table">
        <thead>
          <tr>
            <th>Credit Package</th>
            <th>Price per Package</th>
            <th>Quantity</th>
          </tr>
        </thead>
        <tbody>
          {[5, 20, 40].map((type) => (
            <tr key={type}>
              <td>{type} Credits</td>
              <td>${type}</td>
              <td>
                <select
                  value={creditCounts[type]}
                  onChange={(e) => handleCreditChange(type, parseInt(e.target.value, 10))}
                >
                  <option value={0}>0</option>
                  {[...Array(10)].map((_, i) => (
                    <option key={i + 1} value={i + 1}>
                      {i + 1}
                    </option>
                  ))}
                </select>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      <div className="summary-section">
        <h2>Summary</h2>
        <p>Total Credits: {totalCredits}</p>
        <p>Total Cost: ${totalCost.toFixed(2)}</p>
        <button onClick={handleCheckout} disabled={totalCredits === 0}>
          Checkout
        </button>
      </div>
    </div>
  );
};

export default PurchaseCreditsPage;
