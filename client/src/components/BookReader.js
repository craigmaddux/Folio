import React, { useEffect, useState, useContext, useCallback, useRef } from 'react';
import { useParams } from 'react-router-dom';
import AuthContext from '../context/AuthContext';
import './BookReader.css';

const BookReader = () => {
  const { bookId } = useParams();
  const { user } = useContext(AuthContext);
  const [content, setContent] = useState('');
  const [currentPosition, setCurrentPosition] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [fontSize, setFontSize] = useState(18);
  const [charactersPerPage, setCharactersPerPage] = useState(1000);

  const bookReaderRef = useRef();

  const CHUNK_SIZE = 10000;

  const fetchProgress = useCallback(async () => {
    if (!user) {
      setError('User is not logged in.');
      return 0;
    }

    try {
      const response = await fetch(
        `/api/books/${bookId}/progress?userId=${user.id}`
      );
      if (!response.ok) {
        throw new Error('Failed to fetch reading progress');
      }
      const data = await response.json();
      return data.lastReadPosition || 0;
    } catch (err) {
      console.error('Error fetching progress:', err.message);
      setError('Failed to fetch progress.');
      return 0;
    }
  }, [bookId, user]);

  const fetchContent = useCallback(async (position) => {
    try {
      const response = await fetch(
        `/api/books/${bookId}/content?start=${position}&length=${CHUNK_SIZE}`
      );
      if (!response.ok) {
        throw new Error('Failed to fetch book content');
      }
      const data = await response.json();
      setContent(data.content);
      setCurrentPosition(position);
    } catch (err) {
      console.error('Error fetching content:', err.message);
      setError('Failed to fetch book content.');
    } finally {
      setLoading(false);
    }
  }, [bookId]);

  useEffect(() => {
    const initializeReader = async () => {
      setLoading(true);
      const lastReadPosition = await fetchProgress();
      await fetchContent(lastReadPosition);
    };

    initializeReader();
  }, [fetchContent, fetchProgress]);

  useEffect(() => {
    if (bookReaderRef.current) {
      const page = bookReaderRef.current;
      const pageHeight = page.offsetHeight;
      const lineHeight = parseFloat(getComputedStyle(page).lineHeight);
      const linesPerPage = Math.floor(pageHeight / lineHeight);
      const averageCharsPerLine = Math.floor(page.offsetWidth / 10);
      const newCharactersPerPage = linesPerPage * averageCharsPerLine;

      setCharactersPerPage(newCharactersPerPage);
    }
  }, [fontSize, content]);

  if (loading) return <p>Loading...</p>;
  if (error) return <p>{error}</p>;

  const startIdx = currentPosition * charactersPerPage;
  const visibleContent = content.slice(startIdx, startIdx + charactersPerPage * 2);
  const leftPage = visibleContent.slice(0, charactersPerPage);
  const rightPage = visibleContent.slice(charactersPerPage);

  const handleNextPage = () => {
    const maxPages = Math.ceil(content.length / charactersPerPage / 2);
    if (currentPosition < maxPages - 1) {
      setCurrentPosition((prev) => prev + 1);
    }
  };

  const handlePreviousPage = () => {
    if (currentPosition > 0) {
      setCurrentPosition((prev) => prev - 1);
    }
  };

  const increaseFontSize = () => setFontSize((prev) => Math.min(prev + 2, 36));
  const decreaseFontSize = () => setFontSize((prev) => Math.max(prev - 2, 12));

  return (
    <div className="book-reader">
      <div className="book-reader__controls">
        <button onClick={decreaseFontSize}>A-</button>
        <span className="book-reader__label">Font Size</span>
        <button onClick={increaseFontSize}>A+</button>
      </div>
      <div className="book-reader__pages">
        <div
          ref={bookReaderRef}
          className="book-reader__page book-reader__page--left"
          style={{ fontSize: `${fontSize}px` }}
        >
          {leftPage}
        </div>
        <div
          className="book-reader__page book-reader__page--right"
          style={{ fontSize: `${fontSize}px` }}
        >
          {rightPage}
        </div>
        <div
          className="book-reader__prev"
          onClick={handlePreviousPage}
          aria-label="Previous Page"
        ></div>
        <div
          className="book-reader__next"
          onClick={handleNextPage}
          aria-label="Next Page"
        ></div>
      </div>
    </div>
  );
};

export default BookReader;
