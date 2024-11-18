// src/components/BookProduct.js
import React, { useContext, useEffect, useState } from 'react';
import { useLocation, useParams, useNavigate } from 'react-router-dom';
import AuthContext from '../context/AuthContext';
import './BookProduct.css';

const BookProduct = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { user } = useContext(AuthContext);
  const { bookId } = useParams();
  const [book, setBook] = useState(location.state || null);
  
  useEffect(() => {
    if (!book) {
      fetch(`/api/books/${bookId}`)
        .then((response) => response.json())
        .then((data) => setBook(data))
        .catch((error) => console.error('Error fetching book details:', error));
    }
  }, [book, bookId]);

  if (!book) return <p>Loading...</p>;

  const { title, author, description, price, cover_image_url, cover_image_alt } = book;
  const absoluteImageUrl = cover_image_url?.startsWith('/') ? cover_image_url : `/${cover_image_url}`;

  const handlePurchase = async () => {
    if (!user) {
      navigate('/login');
      return;
    }
    console.log('User data:', user); // Log user data to check if id is available
    try {
      const response = await fetch('/api/purchase', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          userId: user.id,
          bookId: book.id,
          purchasePrice: book.price
        }),
      });

      if (response.ok) {
        alert('Purchase successful!');
      } else {
        const data = await response.json();
        alert(`Purchase failed: ${data.message}`);
      }
    } catch (error) {
      console.error('Error during purchase:', error);
      alert('An unexpected error occurred. Please try again.');
    }
  };

  const handleLoginRedirect = () => {
    navigate('/login');
  };

  return (
    <div className="book-product">
      <div className="book-product-image">
        <img src={absoluteImageUrl} alt={cover_image_alt || `${title} cover`} />
      </div>
      <div className="book-product-details">
        <h2>{title}</h2>
        <h3>By {author}</h3>
        <p className="book-description">{description}</p>
        <p className="book-price">
          {price !== undefined && !isNaN(price) ? `$${parseFloat(price).toFixed(2)}` : 'Price not available'}
        </p>

        {user ? (
          <button className="purchase-button" onClick={handlePurchase}>
            Purchase
          </button>
        ) : (
          <button className="login-to-purchase" onClick={handleLoginRedirect}>
            Login to Purchase
          </button>
        )}
      </div>
    </div>
  );
};

export default BookProduct;
