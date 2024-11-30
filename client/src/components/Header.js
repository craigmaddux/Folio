import React, { useContext, useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import AuthContext from '../context/AuthContext';
import './Header.css';

const Header = () => {
  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);

  const toggleMenu = () => setMenuOpen(!menuOpen);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (!event.target.closest('.dropdown-menu') && !event.target.closest('.hamburger-menu')) {
        setMenuOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  return (
    <header className="header">
      <div className="header-content">
        <div className="header-branding">
          <Link to="/" className="header-logo">
            <h1>LeafQuill</h1>
          </Link>
          <p>Discover and read your favorite books and authors online.</p>
        </div>
        {user && (
          <div className="header-actions">
            <div className="hamburger-menu" onClick={toggleMenu}>
              <span className="hamburger-line"></span>
              <span className="hamburger-line"></span>
              <span className="hamburger-line"></span>
            </div>
            <div className={`dropdown-menu ${menuOpen ? 'show' : ''}`}>
              <span className="dropdown-item" onClick={() => navigate('/library')}>
                View Library
              </span>
              <span className="dropdown-item" onClick={() => navigate('/purchase-credits')}>
                Purchase Credits
              </span>
              <span className="dropdown-item" onClick={() => navigate('/my-account')}>
                My Account
              </span>
              <span className="dropdown-item" onClick={logout}>
                Log Out
              </span>
            </div>
          </div>
        )}
        {!user && (
          <div className="header-actions">
            <Link to="/signup" className="header-button">Sign Up</Link>
            <Link to="/login" className="header-button">Login</Link>
          </div>
        )}
      </div>
    </header>
  );
};

export default Header;
