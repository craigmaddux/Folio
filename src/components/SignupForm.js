import React, { useState } from 'react';
import './SignupForm.css';

const Signup = () => {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [passwordValidations, setPasswordValidations] = useState({
    length: false,
    number: false,
    specialChar: false,
  });

  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const [isFormValid, setIsFormValid] = useState(false);

  const validatePassword = (value) => {
    const validations = {
      length: value.length >= 8,
      number: /\d/.test(value),
      specialChar: /[!@#$%^&*(),.?":{}|<>]/.test(value),
    };
    setPasswordValidations(validations);
    setPassword(value);

    // Check overall form validity
    const isPasswordValid =
      validations.length && validations.number && validations.specialChar;
    setIsFormValid(
      username &&
        email &&
        isPasswordValid &&
        value === confirmPassword
    );
  };

  const handleConfirmPassword = (value) => {
    setConfirmPassword(value);

    const isPasswordValid =
      passwordValidations.length &&
      passwordValidations.number &&
      passwordValidations.specialChar;
    setIsFormValid(
      username && email && isPasswordValid && password === value
    );
  };

  const validateEmail = (value) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    setEmail(value);

    const isPasswordValid =
      passwordValidations.length &&
      passwordValidations.number &&
      passwordValidations.specialChar;
    setIsFormValid(
      username &&
        emailRegex.test(value) &&
        isPasswordValid &&
        password === confirmPassword
    );
  };

  const handleSignup = async (e) => {
    e.preventDefault();
    if (!isFormValid) {
      setError('Please ensure all fields are filled correctly.');
      return;
    }

    try {
      const response = await fetch('/api/signup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, email, password }),
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.message || 'Failed to sign up.');
      }

      setSuccess(true);
      setError('');
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div className="signup-container">
      <form className="signup-form" onSubmit={handleSignup}>
        <h2>Sign Up</h2>
        {error && <p className="error-message">{error}</p>}
        {success && <p className="success-message">Signup successful! You can now log in.</p>}
        <div className="form-group">
          <label htmlFor="username">Username</label>
          <input
            id="username"
            type="text"
            placeholder="Enter your username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
          />
        </div>
        <div className="form-group">
          <label htmlFor="email">Email</label>
          <input
            id="email"
            type="email"
            placeholder="Enter your email"
            value={email}
            onChange={(e) => validateEmail(e.target.value)}
            required
          />
        </div>
        <div className="form-group">
          <label htmlFor="password">Password</label>
          <input
            id="password"
            type="password"
            placeholder="Enter your password"
            value={password}
            onChange={(e) => validatePassword(e.target.value)}
            required
          />
          <ul className="password-validations">
            <li
              className={passwordValidations.length ? 'valid' : 'invalid'}
            >
              At least 8 characters
            </li>
            <li
              className={passwordValidations.number ? 'valid' : 'invalid'}
            >
              At least 1 number
            </li>
            <li
              className={passwordValidations.specialChar ? 'valid' : 'invalid'}
            >
              At least 1 special character
            </li>
          </ul>
        </div>
        <div className="form-group">
          <label htmlFor="confirm-password">Confirm Password</label>
          <input
            id="confirm-password"
            type="password"
            placeholder="Re-enter your password"
            value={confirmPassword}
            onChange={(e) => handleConfirmPassword(e.target.value)}
            required
          />
          {confirmPassword && password !== confirmPassword && (
            <p className="error-message">Passwords do not match</p>
          )}
        </div>
        <button
          type="submit"
          className={`signup-button ${isFormValid ? 'enabled' : 'disabled'}`}
          disabled={!isFormValid}
        >
          Sign Up
        </button>
      </form>
    </div>
  );
};

export default Signup;
