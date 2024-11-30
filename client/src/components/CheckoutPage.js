import React, { useState, useEffect } from 'react';
import { Elements } from '@stripe/react-stripe-js';
import { loadStripe } from '@stripe/stripe-js';
import CheckoutForm from './CheckoutForm';
import './CheckoutPage.css';
import { fetchFromAPI } from './api';

// Initialize Stripe with your publishable key
const stripePromise = loadStripe('your-publishable-key-here');

const CheckoutPage = () => {
  const [clientSecret, setClientSecret] = useState('');
  const [totalCredits, setTotalCredits] = useState(20); // Example values
  const [totalCost, setTotalCost] = useState(20); // Example values

  useEffect(() => {
    const fetchClientSecret = async () => {
      try {
        const response = await fetchFromAPI('/purchase-credits', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            credits: totalCredits,
            amount: totalCost,
          }),
        });

        if (!response.ok) {
          throw new Error('Failed to fetch client secret');
        }

        const data = await response.json();
        setClientSecret(data.clientSecret);
      } catch (error) {
        console.error('Error fetching clientSecret:', error);
      }
    };

    fetchClientSecret();
  }, [totalCredits, totalCost]);

  const stripeOptions = clientSecret ? { clientSecret } : null;

  return (
    <div className="checkout-page">
      <h1>Checkout</h1>
      {clientSecret ? (
        <Elements stripe={stripePromise} options={stripeOptions}>
          <CheckoutForm totalCredits={totalCredits} totalCost={totalCost} />
        </Elements>
      ) : (
        <p>Loading payment details...</p>
      )}
    </div>
  );
};

export default CheckoutPage;
