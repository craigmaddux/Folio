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

  const [accountHolderName, setAccountHolderName] = useState('');
  const [country, setCountry] = useState('DE'); // Default to Germany for SEPA testing
  const [accountType] = useState('checking');
  const [routingNumber, setRoutingNumber] = useState('');
  const [accountNumber, setAccountNumber] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsProcessing(true);

    if (!stripe || !elements) {
      setErrorMessage('Stripe.js has not loaded yet.');
      setIsProcessing(false);
      return;
    }

    try {
      let result;

      if (country === 'US') {
        // Use manual fields for US bank details
        result = await stripe.createToken('bank_account', {
          country,
          currency: 'usd',
          routing_number: routingNumber,
          account_number: accountNumber,
          account_holder_name: accountHolderName,
          account_holder_type: accountType,
        });
      } else {
        // Use IbanElement for SEPA countries
        result = await stripe.createToken(elements.getElement(IbanElement), {
          account_holder_name: accountHolderName,
          account_holder_type: accountType,
        });
      }

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
      <div className="form-group">
        <label>Account Holder Name</label>
        <input
          type="text"
          value={accountHolderName}
          onChange={(e) => setAccountHolderName(e.target.value)}
          placeholder="John Doe"
          required
        />
      </div>
      <div className="form-group">
        <label>Country</label>
        <select
          value={country}
          onChange={(e) => setCountry(e.target.value)}
          required
        >
          <option value="DE">Germany</option>
          <option value="FR">France</option>
          <option value="ES">Spain</option>
          <option value="US">United States</option>
          {/* Add more countries as needed */}
        </select>
      </div>
      {country === 'US' ? (
        <>
          <div className="form-group">
            <label>Routing Number</label>
            <input
              type="text"
              value={routingNumber}
              onChange={(e) => setRoutingNumber(e.target.value)}
              placeholder="123456789"
              required
            />
          </div>
          <div className="form-group">
            <label>Account Number</label>
            <input
              type="text"
              value={accountNumber}
              onChange={(e) => setAccountNumber(e.target.value)}
              placeholder="123456789123"
              required
            />
          </div>
        </>
      ) : (
        <div className="form-group">
          <label>IBAN</label>
          <IbanElement
            options={{
              supportedCountries: ['SEPA'],
              placeholderCountry: country,
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
        </div>
      )}
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
