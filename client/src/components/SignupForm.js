import React, { useState } from 'react';
import './SignupForm.css';
import { fetchFromAPI } from './api';

const SignupForm = ({ isAuthor = false }) => {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [passwordValidations, setPasswordValidations] = useState({
    length: false,
    number: false,
    specialChar: false,
  });
  const [isFormValid, setIsFormValid] = useState(false);
  

  const validatePassword = (value) => {
    const hasNumber = /\d/.test(value);
    const hasSpecialChar = /[!@#$%^&*(),.?":{}|<>]/.test(value);
    const isValidLength = value.length >= 8;

    setPasswordValidations({
      length: isValidLength,
      number: hasNumber,
      specialChar: hasSpecialChar,
    });

    const isPasswordValid = isValidLength && hasNumber && hasSpecialChar;
    setPassword(value);

    setIsFormValid(
      username &&
        /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email) && // Valid email format
        isPasswordValid &&
        value === confirmPassword
    );
  };

  const validateConfirmPassword = (value) => {
    setConfirmPassword(value);
    setIsFormValid(
      username &&
        /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email) &&
        passwordValidations.length &&
        passwordValidations.number &&
        passwordValidations.specialChar &&
        password === value
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

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!isFormValid) {
      alert('Please ensure all fields are valid before submitting!');
      return;
    }

    const endpoint =  '/signup';
    const response = await fetchFromAPI(endpoint, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username, email, password }),
    });

    if (response.ok) {
      alert(
        isAuthorChecked
          ? 'Author signed up successfully!'
          : 'User signed up successfully!'
      );
    } else {
      alert('Signup failed. Please try again.');
    }
  };

  return (
    <form className="signup-form" onSubmit={handleSubmit}>
      <h2>{isAuthorChecked ? 'Author Sign Up' : 'Sign Up'}</h2>
      <input
        type="text"
        placeholder="Username"
        value={username}
        onChange={(e) => setUsername(e.target.value)}
        required
      />
      <input
        type="email"
        placeholder="Email"
        value={email}
        onChange={(e) => validateEmail(e.target.value)}
        required
      />
      <input
        type="password"
        placeholder="Password"
        value={password}
        onChange={(e) => validatePassword(e.target.value)}
        required
      />
      <input
        type="password"
        placeholder="Confirm Password"
        value={confirmPassword}
        onChange={(e) => validateConfirmPassword(e.target.value)}
        required
      />
      <div className="password-validations">
        <p>Password must:</p>
        <ul>
          <li className={passwordValidations.length ? 'valid' : 'invalid'}>
            Be at least 8 characters
          </li>
          <li className={passwordValidations.number ? 'valid' : 'invalid'}>
            Include a number
          </li>
          <li
            className={passwordValidations.specialChar ? 'valid' : 'invalid'}
          >
            Include a special character
          </li>
        </ul>
      </div>
      <label>
       
      </label>
      <button type="submit" disabled={!isFormValid}>
        {isAuthorChecked ? 'Sign Up as Author' : 'Sign Up'}
      </button>
    </form>
  );
};

export default SignupForm;
