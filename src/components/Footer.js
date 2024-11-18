import React from 'react';
import './Footer.css';

const Footer = () => {
  return (
    <footer className="footer">
      <ul className="footer__links">
        <li><a href="/about" className="footer__link">About Us</a></li>
        <li><a href="/author-signup" className="footer__link">Author Sign Up</a></li>
      </ul>
    </footer>
  );
};

export default Footer;
