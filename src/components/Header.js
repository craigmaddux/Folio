// src/components/Header.js
import React, { useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import AuthContext from '../context/AuthContext';
import './Header.css';

const Header = () => {
  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();

  return (
    <header className="header">
      <div className="header-content">
        <div className="header-branding">
          <Link to="/" className="header-logo">
            <h1>Folio</h1>
          </Link>
          <p>Discover, browse, and read your favorite books online.</p>
        </div>
        <div className="header-actions">
          {user ? (
            <>
              {/* Username is now clickable, links to Library */}
              <span className="header-username" onClick={() => navigate('/library')}>
                Welcome, {user.username}!
              </span>
              <button className="header-button" onClick={logout}>Logout</button>
            </>
          ) : (
            <>
              <Link to="/signup" className="header-button">Sign Up</Link>
              <Link to="/login" className="header-button">Login</Link>
            </>
          )}
        </div>
      </div>
    </header>
  );
};

export default Header;
