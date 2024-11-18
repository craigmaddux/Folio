// src/components/BookSlider.js
import React from 'react';
import BookTile from './BookTile';
import './BookSlider.css';
import { useNavigate } from 'react-router-dom';

const BookSlider = ({ books, hidePrice = false, booksOwned = false }) => {
  const navigate = useNavigate();
  const handleTileClick = (book) => {
    if (booksOwned) {
      navigate(`/reader/${book.id}`); // Navigate without reloading
    } else {
      navigate(`/books/${book.id}`); // Navigate to product detail page
    }
  };


  return (
    <div className="book-slider">
      {books && books.length > 0 ? (
        books.map((book) => (
          <BookTile
            key={book.id}
            book={book}
            hidePrice={hidePrice}      // Show price on homepage
            onClick={() => handleTileClick(book)}  // Navigate to book product page
          />
        ))
      ) : (
        <p>No books available</p>
      )}
    </div>
  );
};

export default BookSlider;
