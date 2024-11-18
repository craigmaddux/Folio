import React, { useState } from 'react';
import './UploadBook.css';

const UploadBook = () => {
  const [title, setTitle] = useState('');
  const [price, setPrice] = useState('');
  const [genre, setGenre] = useState('');
  const [cover, setCover] = useState(null); // File upload for book cover
  const [content, setContent] = useState(null); // File upload for book content
  const [message, setMessage] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!title || !price || !genre || !cover || !content) {
      setMessage('Please fill out all fields.');
      return;
    }

    const formData = new FormData();
    formData.append('title', title);
    formData.append('price', price);
    formData.append('genre', genre);
    formData.append('cover', cover);
    formData.append('content', content);

    try {
      const response = await fetch('/api/books/upload', {
        method: 'POST',
        body: formData,
      });

      if (response.ok) {
        setMessage('Book uploaded successfully!');
        setTitle('');
        setPrice('');
        setGenre('');
        setCover(null);
        setContent(null);
      } else {
        setMessage('Failed to upload book. Please try again.');
      }
    } catch (error) {
      setMessage('An error occurred while uploading the book.');
    }
  };

  return (
    <div className="upload-book">
      <h2>Upload a New Book</h2>
      {message && <p className="upload-message">{message}</p>}
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label>Book Title</label>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Enter book title"
            required
          />
        </div>
        <div className="form-group">
          <label>Price</label>
          <input
            type="number"
            value={price}
            onChange={(e) => setPrice(e.target.value)}
            placeholder="Enter price"
            step="0.01"
            required
          />
        </div>
        <div className="form-group">
          <label>Genre</label>
          <input
            type="text"
            value={genre}
            onChange={(e) => setGenre(e.target.value)}
            placeholder="Enter genre"
            required
          />
        </div>
        <div className="form-group">
          <label>Cover Image</label>
          <input
            type="file"
            accept="image/*"
            onChange={(e) => setCover(e.target.files[0])}
            required
          />
        </div>
        <div className="form-group">
          <label>Book Content</label>
          <input
            type="file"
            accept=".txt,.pdf"
            onChange={(e) => setContent(e.target.files[0])}
            required
          />
        </div>
        <button type="submit" className="upload-button">
          Upload Book
        </button>
      </form>
    </div>
  );
};

export default UploadBook;
