import React, { useState, useContext } from 'react';
import { useStripe, useElements, PaymentElement } from '@stripe/react-stripe-js';
import AuthContext from '../context/AuthContext';
import { fetchFromAPI } from './api';

const CheckoutForm = ({ totalCredits, totalCost }) => {
  const stripe = useStripe();
  const elements = useElements();
  const { user } = useContext(AuthContext); // Access user context
  const [errorMessage, setErrorMessage] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsProcessing(true);

    const { error, paymentIntent } = await stripe.confirmPayment({
      elements,
      confirmParams: {
        return_url: `${window.location.origin}/payment-success`, // Redirect here on success
      },
    });

    if (error) {
      setErrorMessage(error.message);
      setIsProcessing(false);
      return;
    }

    // Notify the backend after payment success
    if (paymentIntent?.status === 'succeeded') {
      try {
        console.log('Notifying back end of purchase.');
        const response = await fetchFromAPI('/confirm-purchase', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            userId: user.id, // Use the user ID from context
            credits: totalCredits,
            amount: totalCost,
          }),
        });

        if (!response.ok) {
          throw new Error('Failed to confirm purchase');
        }

        console.log('Credits successfully recorded!');
      } catch (error) {
        console.error('Error confirming purchase:', error.message);
      }
    }

    setIsProcessing(false);
  };

  return (
    <form onSubmit={handleSubmit}>
      <h2>Summary</h2>
      <p>Total Credits: {totalCredits}</p>
      <p>Total Cost: ${totalCost}</p>

      <PaymentElement />
      {errorMessage && <div className="error-message">{errorMessage}</div>}

      <button type="submit" disabled={!stripe || isProcessing}>
        {isProcessing ? 'Processing...' : 'Pay Now'}
      </button>
    </form>
  );
};

export default CheckoutForm;
