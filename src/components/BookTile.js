// src/components/BookTile.js
import React from 'react';
import './BookTile.css';

const BookTile = ({ book = {}, hidePrice = false, onClick = () => {} }) => {
  const { id, name, author, cover_image_url, cover_image_alt, price } = book;
  //console.log('Rendering BookTile with:', book); // Log book data

  return (
    <div className="book-tile" key={id} onClick={onClick}>
      <img src={cover_image_url || '/default-cover.jpg'} alt={cover_image_alt || 'Book cover'} className="book-tile-image" />
      <div className="book-tile-info">
        <h3>{name}</h3>
        <p>{author}</p>
        {!hidePrice && price !== undefined && !isNaN(price) ? (
          <p className="book-price">${parseFloat(price).toFixed(2)}</p>
        ) : null}
      </div>
    </div>
  );
};

export default BookTile;
