import React, { useState } from 'react';
import { Elements, useStripe, useElements, BankElement } from '@stripe/react-stripe-js';
import { loadStripe } from '@stripe/stripe-js';

const stripePromise = loadStripe('your-publishable-key-here');

const BankDetailsForm = () => {
  const stripe = useStripe();
  const elements = useElements();
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

    try {
      const result = await stripe.createToken(elements.getElement(BankElement));
      if (result.error) {
        setErrorMessage(result.error.message);
      } else {
        // Send the token to your backend for further processing
        console.log('Bank account token:', result.token);
        const response = await fetch('/api/save-bank-details', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ token: result.token.id }),
        });

        if (!response.ok) {
          throw new Error('Failed to save bank details');
        }

        alert('Bank details saved successfully!');
      }
    } catch (error) {
      setErrorMessage(error.message);
    }

    setIsProcessing(false);
  };

  return (
    <form onSubmit={handleSubmit}>
      <h2>Enter Your Bank Details</h2>
      <BankElement
        options={{
          style: {
            base: {
              fontSize: '16px',
              color: '#424770',
              '::placeholder': { color: '#aab7c4' },
            },
            invalid: { color: '#9e2146' },
          },
        }}
      />
      {errorMessage && <div className="error">{errorMessage}</div>}
      <button type="submit" disabled={!stripe || isProcessing}>
        {isProcessing ? 'Processing...' : 'Save Bank Details'}
      </button>
    </form>
  );
};

const BankDetailsPage = () => {
  return (
    <Elements stripe={stripePromise}>
      <BankDetailsForm />
    </Elements>
  );
};

export default BankDetailsPage;
