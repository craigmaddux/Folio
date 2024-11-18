import React, { useEffect, useState, useContext } from 'react';
import BookSlider from './BookSlider';
import AuthContext from '../context/AuthContext';
import './Home.css';

const Home = () => {
  const { user } = useContext(AuthContext); // Access logged-in user
  const [generalBooks, setGeneralBooks] = useState([]);
  const [purchasedBooks, setPurchasedBooks] = useState([]);
  const [error, setError] = useState(null);

  useEffect(() => {
    // Fetch general books
    const fetchGeneralBooks = async () => {
      try {
        const response = await fetch('/api/books?limit=4');
        const data = await response.json();
        setGeneralBooks(data);
      } catch (err) {
        console.error('Error fetching general books:', err);
        setError('Failed to fetch general books.');
      }
    };

    // Fetch user-purchased books if logged in
    const fetchPurchasedBooks = async () => {
      if (!user) return;
      try {
        const response = await fetch(`/api/books?limit=4&username=${user.username}`);
        const data = await response.json();
        setPurchasedBooks(data);
      } catch (err) {
        console.error('Error fetching purchased books:', err);
        setError('Failed to fetch purchased books.');
      }
    };

    fetchGeneralBooks();
    fetchPurchasedBooks();
  }, [user]);

  return (
    <div className="home">
      {error && <p className="error-message">{error}</p>}
      <div className="sliders">
        <section>
          <h2>Popular Books</h2>
          <BookSlider books={generalBooks} />
        </section>
        {user && purchasedBooks.length > 0 && (
          <section>
            <h2>Your Purchased Books</h2>
            <BookSlider books={purchasedBooks} hidePrice={true} booksOwned={true} />
          </section>
        )}
      </div>
    </div>
  );
};

export default Home;