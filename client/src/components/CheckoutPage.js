import React, { useState, useEffect, useContext } from 'react';
import { Elements, useStripe, useElements, PaymentElement } from '@stripe/react-stripe-js';
import { loadStripe } from '@stripe/stripe-js';
import { fetchFromAPI } from './api';
import AuthContext from '../context/AuthContext';

// Initialize Stripe with your publishable key
const stripePromise = loadStripe('pk_test_51QNbQFB3kskbD2Vepm6Ja7rmwzG6p1lfR1Bk6us7ilbavJcnmhgAOVlI5nJ3SX6gX4dX9rH8iAI3EXpZab4QdeOE001p7rGs8I');

const CheckoutForm = () => {
  const stripe = useStripe();
  const elements = useElements();
  const { totalPurchaseCredits, totalCost, user } = useContext(AuthContext); // Access user context
  const [errorMessage, setErrorMessage] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  console.log('Rendering PaymentElement with stripe:', stripe, 'and elements:', elements);

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
            credits: totalPurchaseCredits,
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
      <p>Total Credits: {totalPurchaseCredits}</p>
      <p>Total Cost: ${totalCost.toFixed(2)}</p>

      <PaymentElement />
      {errorMessage && <div className="error-message">{errorMessage}</div>}

      <button type="submit" disabled={!stripe || isProcessing}>
        {isProcessing ? 'Processing...' : 'Pay Now'}
      </button>
    </form>
  );
};

const CheckoutPage = () => {
  const [clientSecret, setClientSecret] = useState('');
  const { totalPurchaseCredits, totalCost } = useContext(AuthContext);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    console.log('totalPurchaseCredits:', totalPurchaseCredits, 'totalCost:', totalCost);

    const fetchClientSecret = async () => {
      try {
        const response = await fetchFromAPI('/purchase-credits', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ credits: totalPurchaseCredits, amount: totalCost }),
        });
        console.log('Response from /purchase-credits:', response);
        if (!response.ok) {
          throw new Error('Failed to fetch client secret');
        }

        const data = await response.json();
        console.log('Data from /purchase-credits:', data);
        setClientSecret(data.clientSecret);
      } catch (error) {
        console.error('Error fetching client secret:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchClientSecret();
  }, [totalPurchaseCredits, totalCost]); // Add dependencies to avoid infinite re-renders

  if (loading) {
    return <p>Loading payment details...</p>;
  }

  if (!clientSecret) {
    return <p>Error: Unable to initialize payment. Please try again later.</p>;
  }

  const stripeOptions = { clientSecret };
  
  return (
    <div className="checkout-page">
      <h1>Checkout</h1>
      <Elements stripe={stripePromise} options={stripeOptions}>
        <CheckoutForm />
      </Elements>
    </div>
  );
};

export default CheckoutPage;
