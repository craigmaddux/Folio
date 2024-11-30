import React, { useState } from 'react';
import './MyAccount.css';

const MyAccount = () => {
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [message, setMessage] = useState('');

  const handlePasswordChange = (e) => {
    e.preventDefault();
    // TODO: Add API call for updating password
    if (password !== confirmPassword) {
      setMessage('Passwords do not match.');
      return;
    }
    setMessage('Password updated successfully!');
    setPassword('');
    setConfirmPassword('');
  };

  const pastCreditPurchases = [
    { id: 1, date: '2024-11-01', credits: 20, amount: 20 },
    { id: 2, date: '2024-11-15', credits: 40, amount: 40 },
  ]; // TODO: Fetch from API

  const purchasedBooks = [
    { id: 1, title: 'Book One', date: '2024-11-05' },
    { id: 2, title: 'Book Two', date: '2024-11-20' },
  ]; // TODO: Fetch from API

  return (
    <div className="my-account">
      <h1>My Account</h1>

      {/* Change Password Section */}
      <section className="account-section">
        <h2>Change Password</h2>
        {message && <p className="account-message">{message}</p>}
        <form onSubmit={handlePasswordChange} className="password-form">
          <div className="form-group">
            <label>New Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter new password"
              required
            />
          </div>
          <div className="form-group">
            <label>Confirm Password</label>
            <input
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              placeholder="Confirm new password"
              required
            />
          </div>
          <button type="submit" className="account-button">
            Update Password
          </button>
        </form>
      </section>

      {/* Credit Purchases Section */}
      <section className="account-section">
        <h2>Past Credit Purchases</h2>
        <table className="account-table">
          <thead>
            <tr>
              <th>Date</th>
              <th>Credits</th>
              <th>Amount ($)</th>
            </tr>
          </thead>
          <tbody>
            {pastCreditPurchases.map((purchase) => (
              <tr key={purchase.id}>
                <td>{purchase.date}</td>
                <td>{purchase.credits}</td>
                <td>{purchase.amount}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </section>

      {/* Purchased Books Section */}
      <section className="account-section">
        <h2>Books Purchased</h2>
        <ul className="books-list">
          {purchasedBooks.map((book) => (
            <li key={book.id}>
              <strong>{book.title}</strong> - Purchased on {book.date}
            </li>
          ))}
        </ul>
      </section>
    </div>
  );
};

export default MyAccount;
