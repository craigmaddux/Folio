import React, { useState } from 'react';
import { fetchFromAPI } from './api'; // Custom API helper
import './BankDetailsWidget.css';

const BankDetailsWidget = () => {
  const [accountHolderName, setAccountHolderName] = useState('');
  const [accountNumber, setAccountNumber] = useState('');
  const [routingNumber, setRoutingNumber] = useState('');
  const [accountType, setAccountType] = useState('checking');
  const [message, setMessage] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validate form inputs
    if (!accountHolderName || !accountNumber || !routingNumber) {
      setMessage('All fields are required.');
      return;
    }

    try {
      // Send bank details to backend
      const response = await fetchFromAPI('/stripe/bank-details', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          accountHolderName,
          accountNumber,
          routingNumber,
          accountType,
        }),
      });

      if (response.ok) {
        setMessage('Bank details saved successfully!');
      } else {
        const { error } = await response.json();
        setMessage(`Error: ${error}`);
      }
    } catch (error) {
      setMessage('An error occurred. Please try again.');
    }
  };

  return (
    <div className="bank-details-widget">
      <h2>Bank Details</h2>
      {message && <p className="message">{message}</p>}
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label>Account Holder Name</label>
          <input
            type="text"
            value={accountHolderName}
            onChange={(e) => setAccountHolderName(e.target.value)}
            required
          />
        </div>
        <div className="form-group">
          <label>Account Number</label>
          <input
            type="text"
            value={accountNumber}
            onChange={(e) => setAccountNumber(e.target.value)}
            required
          />
        </div>
        <div className="form-group">
          <label>Routing Number</label>
          <input
            type="text"
            value={routingNumber}
            onChange={(e) => setRoutingNumber(e.target.value)}
            required
          />
        </div>
        <div className="form-group">
          <label>Account Type</label>
          <select
            value={accountType}
            onChange={(e) => setAccountType(e.target.value)}
            required
          >
            <option value="checking">Checking</option>
            <option value="savings">Savings</option>
          </select>
        </div>
        <button type="submit" className="save-button">
          Save Bank Details
        </button>
      </form>
    </div>
  );
};

export default BankDetailsWidget;
