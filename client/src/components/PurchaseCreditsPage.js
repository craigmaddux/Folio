// src/components/PurchaseCreditsPage.js
import React, { useState, useEffect } from 'react';
import { loadStripe } from '@stripe/stripe-js';
import { Elements, useStripe, useElements, PaymentElement } from '@stripe/react-stripe-js';

const stripePromise = loadStripe('your-publishable-key-here');

const PurchaseCreditsForm = ({ credits, amount }) => {
  const stripe = useStripe();
  const elements = useElements();
  const [isProcessing, setIsProcessing] = useState(false);

  const handlePurchase = async (e) => {
    e.preventDefault();
    setIsProcessing(true);

    const { error } = await stripe.confirmPayment({
      elements,
      confirmParams: {
        return_url: `${window.location.origin}/payment-success`,
      },
    });

    if (error) {
      console.error(error.message);
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

  const fetchPaymentIntent = async () => {
    const response = await fetch('/api/purchase-credits', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        userId: 'user-id-placeholder', // Replace with actual user ID
        credits: selectedOption.credits,
        amount: selectedOption.amount,
      }),
    });

    const data = await response.json();
    setClientSecret(data.clientSecret);
  };

  useEffect(() => {
    fetchPaymentIntent();
  }, [selectedOption]);

  const options = { clientSecret };

  return (
    <div>
      <h1>Purchase Credits</h1>
      <select
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

      {clientSecret && (
        <Elements stripe={stripePromise} options={options}>
          <PurchaseCreditsForm credits={selectedOption.credits} amount={selectedOption.amount} />
        </Elements>
      )}
    </div>
  );
};

export default PurchaseCreditsPage;
