// src/components/PaymentSuccessPage.js
import React from 'react';
import { Link } from 'react-router-dom';


const Yay = () => {
 

  return (
    <div className="payment-success-container">
      <h1>Payment Successful</h1>
      <p>Thank you for your purchase!</p>
     
      <Link to="/library" className="button">
        Go to Your Library
      </Link>
    </div>
  );
};

export default Yay;
