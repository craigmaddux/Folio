// src/components/PaymentSuccessPage.js
import React from 'react';
import { useLocation, Link } from 'react-router-dom';
import './PaymentSuccessPage.css';

const PaymentSuccessPage = () => {
  const location = useLocation();
  const { credits, totalCost } = location.state || {};

  return (
    <div className="payment-success-container">
      <h1>Payment Successful</h1>
      <p>Thank you for your purchase!</p>
      {credits && totalCost && (
        <div className="summary">
          <p>You purchased <strong>{credits}</strong> credits for <strong>${totalCost.toFixed(2)}</strong>.</p>
        </div>
      )}
      <Link to="/library" className="button">
        Go to Your Library
      </Link>
    </div>
  );
};

export default PaymentSuccessPage;
