import React, { useState, useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import AuthContext from '../context/AuthContext';
import './Header.css';

const Header = () => {
  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();
  const [dropdownOpen, setDropdownOpen] = useState(false);

  const handleMouseEnter = () => setDropdownOpen(true);

  const handleMouseLeave = () => {
    // Close the menu after 1 second if the mouse is outside
    setTimeout(() => setDropdownOpen(false), 1000);
  };

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <header className="header">
      <div className="header-content">
        <Link to="/" className="header-logo">
          <h1>Folio</h1>
        </Link>
        <nav className="header-nav">
          {user ? (
            <div
              className="dropdown"
              onMouseEnter={handleMouseEnter}
              onMouseLeave={handleMouseLeave}
            >
              <button className="dropdown-button">
                Welcome, {user.username}!
              </button>
              {dropdownOpen && (
                <div className="dropdown-menu">
                  <Link to="/my-account" className="dropdown-item">
                    My Account
                  </Link>
                  <Link to="/library" className="dropdown-item">
                    Library
                  </Link>
                  <button className="dropdown-item" onClick={handleLogout}>
                    Logout
                  </button>
                </div>
              )}
            </div>
          ) : (
            <div className="header-actions">
              <Link to="/signup" className="header-button">
                Sign Up
              </Link>
              <Link to="/login" className="header-button">
                Login
              </Link>
            </div>
          )}
        </nav>
      </div>
    </header>
  );
};

export default Header;
