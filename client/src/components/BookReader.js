import React, { useEffect, useRef, useState } from 'react';
import { useParams } from 'react-router-dom';
import ePub from 'epubjs';
import './BookReader.css';

const BookReader = () => {
  const { bookId } = useParams(); // Get the book ID from the URL
  const viewerRef = useRef(null);
  const renditionRef = useRef(null);
  const [fontSize, setFontSize] = useState(16);

  useEffect(() => {
    if (!bookId) {
      console.error('Book ID is required');
      return;
    }

    const viewerElement = viewerRef.current;

    const book = ePub(`/api/read/${bookId}.epub`);

    const rendition = book.renderTo(viewerElement, {
      width: '100%',
      height: '100%',
      manager: 'continuous',
      flow: 'paginated', // Ensures proper pagination behavior
    });

    renditionRef.current = rendition;

    rendition.themes.fontSize(`${fontSize}px`);
    rendition.display();

    return () => {
      rendition.destroy();
      book.destroy();
    };
  }, [bookId, fontSize]);

  const handleNext = () => renditionRef.current?.next();
  const handlePrevious = () => renditionRef.current?.prev();

  const increaseFontSize = () => {
    setFontSize((prev) => {
      const newSize = Math.min(prev + 2, 36);
      renditionRef.current?.themes.fontSize(`${newSize}px`);
      return newSize;
    });
  };

  const decreaseFontSize = () => {
    setFontSize((prev) => {
      const newSize = Math.max(prev - 2, 12);
      renditionRef.current?.themes.fontSize(`${newSize}px`);
      return newSize;
    });
  };

  return (
    <div className="book-reader">
      <div className="book-reader__controls">
        <button onClick={decreaseFontSize}>A-</button>
        <span className="book-reader__label">Font Size</span>
        <button onClick={increaseFontSize}>A+</button>
      </div>
      <div
        className="book-reader__nav book-reader__nav--left"
        onClick={handlePrevious}
        aria-label="Previous Page"
      >
        <span className="book-reader__arrow"></span>
      </div>
      <div id="viewer" ref={viewerRef} className="book-reader__viewer"></div>
      <div
        className="book-reader__nav book-reader__nav--right"
        onClick={handleNext}
        aria-label="Next Page"
      >
        <span className="book-reader__arrow"></span>
      </div>
    </div>
  );
};

export default BookReader;
