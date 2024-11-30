import React, { useState, useEffect, useContext } from 'react';
import { Elements, useStripe, useElements, PaymentElement } from '@stripe/react-stripe-js';
import { loadStripe } from '@stripe/stripe-js';
import AuthContext from '../context/AuthContext';
import { fetchFromAPI } from './api';

// Initialize Stripe with your publishable key
const stripePromise = loadStripe('your-publishable-key-here');

const CheckoutForm = ({ creditCounts, totalCredits, totalCost }) => {
  const stripe = useStripe();
  const elements = useElements();
  const { user } = useContext(AuthContext); // Access user context
  const [errorMessage, setErrorMessage] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsProcessing(true);

    if (!stripe || !elements) {
      setErrorMessage('Stripe.js has not loaded yet.');
      setIsProcessing(false);
      return;
    }

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
            userId: user?.id, // Use the user ID from context
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
      <p>Total Cost: ${totalCost.toFixed(2)}</p>

      <PaymentElement />
      {errorMessage && <div className="error-message">{errorMessage}</div>}

      <button type="submit" disabled={!stripe || isProcessing}>
        {isProcessing ? 'Processing...' : 'Pay Now'}
      </button>
    </form>
  );
};

const CheckoutPage = ({ totalCredits, totalCost }) => {
  const [clientSecret, setClientSecret] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchClientSecret = async () => {
      try {
        const response = await fetchFromAPI('/purchase-credits', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ creditCounts: creditCounts, credits: totalCredits, amount: totalCost }),
        });

        if (!response.ok) {
          throw new Error('Failed to fetch client secret');
        }

        const data = await response.json();
        setClientSecret(data.clientSecret);
      } catch (error) {
        console.error('Error fetching client secret:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchClientSecret();
  }, [totalCredits, totalCost]);

  const stripeOptions = clientSecret ? { clientSecret } : null;

  return (
    <div className="checkout-page">
      <h1>Checkout</h1>
      {loading ? (
        <p>Loading payment details...</p>
      ) : clientSecret ? (
        <Elements stripe={stripePromise} options={stripeOptions}>
          <CheckoutForm totalCredits={totalCredits} totalCost={totalCost} />
        </Elements>
      ) : (
        <p>Error: Unable to initialize payment. Please try again later.</p>
      )}
    </div>
  );
};

export default CheckoutPage;
