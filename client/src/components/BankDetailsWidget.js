import React, { useState } from 'react';
import { Elements, useStripe, useElements, IbanElement } from '@stripe/react-stripe-js';
import { loadStripe } from '@stripe/stripe-js';

// Initialize Stripe with your publishable key
const stripePromise = loadStripe('pk_test_51QNbQFB3kskbD2Vepm6Ja7rmwzG6p1lfR1Bk6us7ilbavJcnmhgAOVlI5nJ3SX6gX4dX9rH8iAI3EXpZab4QdeOE001p7rGs8I');

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
      // Use IbanElement to create a token
      const result = await stripe.createToken(elements.getElement(IbanElement));
      if (result.error) {
        setErrorMessage(result.error.message);
      } else {
        console.log('Bank account token:', result.token);

        // Send the token to your backend
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
      <IbanElement
        options={{
          supportedCountries: ['SEPA'], // Specify supported countries
          placeholderCountry: 'DE', // Default placeholder country
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
