import React, { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import AuthContext from '../context/AuthContext';
import './Login.css';
import { fetchFromAPI } from './api';

const Login = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState(null);
  const { login } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleLogin = async (event) => {
    event.preventDefault();
    console.log("Loging in...");
    try {
      const response = await fetchFromAPI('/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password }),
      });
      console.log("Parsing results....");
      const data = await response.json();
      if (response.ok) {
        
        login({ id: data.id, username: data.username }); // Save user data
        navigate('/'); // Redirect to the homepage
      } else {
        console.log("Response not ok.");
        setError(data.message);
      }
    } catch (error) {
      console.error('Login error:', error.message);
      setError('An unexpected error occurred. Please try again.');
    }
  };

  return (
    <div className="login-container">
      <form onSubmit={handleLogin} className="login-form">
        <h2>Login</h2>
        {error && <p className="error-message">{error}</p>}
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
          <label htmlFor="password">Password</label>
          <input
            id="password"
            type="password"
            placeholder="Enter your password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>
        <button type="submit" className="login-button">
          Login
        </button>
        <p className="signup-link">
          Don’t have an account? <a href="/signup">Sign up here</a>.
        </p>
      </form>
    </div>
  );
};

export default Login;
