// src/components/PurchaseCreditsPage.js
import React, { useState, useEffect, useCallback } from 'react';
import { loadStripe } from '@stripe/stripe-js';
import { Elements, useStripe, useElements, PaymentElement } from '@stripe/react-stripe-js';

// Initialize Stripe with your publishable key
const stripePromise = loadStripe('your-publishable-key-here');

const PurchaseCreditsForm = ({ credits, amount }) => {
  const stripe = useStripe();
  const elements = useElements();
  const [isProcessing, setIsProcessing] = useState(false);

  const handlePurchase = async (e) => {
    e.preventDefault();
    setIsProcessing(true);

    try {
      const { error } = await stripe.confirmPayment({
        elements,
        confirmParams: {
          return_url: `${window.location.origin}/payment-success`,
        },
      });

      if (error) {
        console.error('Payment Error:', error.message);
        alert('Payment failed. Please try again.');
      } else {
        console.log('Payment successful!');
      }
    } catch (err) {
      console.error('Unexpected error during payment:', err.message);
      alert('An unexpected error occurred. Please try again later.');
    }

    setIsProcessing(false);
  };

  return (
    <form onSubmit={handlePurchase}>
      <PaymentElement />
      <button disabled={!stripe || isProcessing} type="submit">
        {isProcessing ? 'Processing...' : `Buy ${credits} Credits for $${amount}`}
      </button>
    </form>
  );
};

const PurchaseCreditsPage = () => {
  const [clientSecret, setClientSecret] = useState('');
  const [selectedOption, setSelectedOption] = useState({ credits: 20, amount: 20 });

  // Fetch Payment Intent API
  const fetchPaymentIntent = useCallback(async () => {
    try {
      const response = await fetch('/api/purchase-credits', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userId: 'user-id-placeholder', // Replace with actual user ID
          credits: selectedOption.credits,
          amount: selectedOption.amount,
        }),
      });

      if (!response.ok) {
        throw new Error(`Failed to fetch payment intent: ${response.statusText}`);
      }

      const data = await response.json();
      setClientSecret(data.clientSecret);
    } catch (error) {
      console.error('Error fetching payment intent:', error.message);
      alert('Failed to initialize payment. Please try again later.');
    }
  }, [selectedOption]);

  // Re-fetch payment intent when the selected option changes
  useEffect(() => {
    fetchPaymentIntent();
  }, [fetchPaymentIntent]);

  const options = clientSecret ? { clientSecret } : null;

  return (
    <div>
      <h1>Purchase Credits</h1>
      <div>
        <label htmlFor="credits-select">Choose your credit package:</label>
        <select
          id="credits-select"
          onChange={(e) => {
            const value = e.target.value;
            setSelectedOption(
              value === '40'
                ? { credits: 40, amount: 40 }
                : { credits: 20, amount: 20 }
            );
          }}
        >
          <option value="20">20 Credits for $20</option>
          <option value="40">40 Credits for $40</option>
        </select>
      </div>

      {clientSecret && (
        <Elements stripe={stripePromise} options={options}>
          <PurchaseCreditsForm
            credits={selectedOption.credits}
            amount={selectedOption.amount}
          />
        </Elements>
      )}
    </div>
  );
};

export default PurchaseCreditsPage;
