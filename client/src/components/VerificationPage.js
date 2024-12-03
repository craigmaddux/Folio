import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { fetchFromAPI } from './api'; // Import your API wrapper
import './VerificationPage.css';

const VerificationPage = () => {
  const [status, setStatus] = useState('loading'); // loading, success, or error
  const [message, setMessage] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const verifyEmail = async () => {
      const params = new URLSearchParams(window.location.search);
      const token = params.get('token');

      if (!token) {
        setStatus('error');
        setMessage('Verification token is missing.');
        return;
      }

      try {
        const response = await fetchFromAPI(`/verify-email?token=${token}`, {
          method: 'GET',
          headers: { 'Content-Type': 'application/json' },
        });

        if (response.ok) {
          const data = await response.json();
          setStatus('success');
          setMessage(data.message);

          // Simulate login (update this with your real login logic)
          setTimeout(() => {
            navigate('/dashboard'); // Redirect to dashboard or main app page
          }, 2000);
        } else {
          const errorData = await response.json();
          setStatus('error');
          setMessage(errorData.message || 'Failed to verify email. Please try again.');
        }
      } catch (error) {
        setStatus('error');
        setMessage('An unexpected error occurred. Please try again.');
        console.error('Error verifying email:', error);
      }
    };

    verifyEmail();
  }, [navigate]);

  return (
    <div className="verification-container">
    {status === 'loading' && <p className="loading-text">Verifying your email...</p>}
    {status === 'success' && (
      <div>
        <h2>Email Verified Successfully!</h2>
        <p className="success-message">{message}</p>
        <p>You will be redirected shortly...</p>
      </div>
    )}
    {status === 'error' && (
      <div>
        <h2>Email Verification Failed</h2>
        <p className="error-message">{message}</p>
      </div>
    )}
  </div>
  );
};

export default VerificationPage;
