// src/components/Library.js
import React, { useContext, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import AuthContext from '../context/AuthContext';
import BookTile from './BookTile';
import './Library.css';

const Library = () => {
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();
  const [books, setBooks] = useState([]);

  useEffect(() => {
    if (!user) {
      navigate('/login'); // Redirect to login if the user is not logged in
    } else {
      fetch(`/api/library/${user.username}`)
        .then((response) => response.json())
        .then((data) => {
          console.log('Fetched library data:', data); // Debugging
          setBooks(data);
        })
        .catch((error) => {
          console.error('Error fetching library:', error);
          setBooks([]); // Fallback to an empty array
        });
    }
  }, [user, navigate]);

  return (
    <div className="library">
      <h2>Your Library</h2>
      <div className="library-books">
        {books.map((book) => (
          <BookTile key={book.id} book={book} hidePrice={true} onClick={() => navigate(`/reader/${book.id}`)} />
        ))}
      </div>
    </div>
  );
};

export default Library;
