import React, { useState, useEffect, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import AuthContext from '../context/AuthContext';
import './AuthorDashboard.css';
import { fetchFromAPI } from './api';

const AuthorDashboard = () => {
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();
  const [hasProfile, setHasProfile] = useState(null);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    price: '',
    content: '',
  });
  const [coverImage, setCoverImage] = useState(null);
  const [message, setMessage] = useState('');

  // Check if author profile exists
  useEffect(() => {
    const checkProfile = async () => {
      try {
        const response = await fetchFromAPI(`/authors/${user.id}/exists`);
        const data = await response.json();
        setHasProfile(data.hasProfile);
      } catch (error) {
        console.error('Error checking profile:', error);
      }
    };
    checkProfile();
  }, [user.id]);

  // Handle form inputs
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleFileChange = (e) => {
    setCoverImage(e.target.files[0]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const data = new FormData();
    data.append('title', formData.title);
    data.append('description', formData.description);
    data.append('price', formData.price);
    data.append('content', formData.content);
    data.append('coverImage', coverImage);

    try {
      const response = await fetchFromAPI('/books/upload', {
        method: 'POST',
        body: data,
      });

      const result = await response.json();
      if (response.ok) {
        setMessage('Book uploaded successfully!');
      } else {
        setMessage(result.message || 'Failed to upload book.');
      }
    } catch (error) {
      console.error('Error uploading book:', error);
      setMessage('An error occurred. Please try again.');
    }
  };

  if (hasProfile === null) {
    return <p>Loading...</p>; // Show a loading message until the check completes
  }

  return (
    <div className="author-dashboard">
      {!hasProfile && (
        <div className="warning-box">
          <p>
            <strong>Warning:</strong> You need to complete your author profile before you can manage your books.
          </p>
          <button onClick={() => navigate('/profile')} className="profile-link">
            Go to Profile Page
          </button>
        </div>
      )}
      {hasProfile && (
        <>
          <h2>Author Dashboard</h2>
          <form onSubmit={handleSubmit} className="upload-form">
            <label>
              Title:
              <input
                type="text"
                name="title"
                value={formData.title}
                onChange={handleInputChange}
                required
              />
            </label>

            <label>
              Description:
              <textarea
                name="description"
                value={formData.description}
                onChange={handleInputChange}
                required
              />
            </label>

            <label>
              Price:
              <input
                type="number"
                name="price"
                value={formData.price}
                onChange={handleInputChange}
                step="0.01"
                min="0"
                required
              />
            </label>

            <label>
              Content:
              <textarea
                name="content"
                value={formData.content}
                onChange={handleInputChange}
                required
              />
            </label>

            <label>
              Cover Image:
              <input type="file" accept="image/*" onChange={handleFileChange} required />
            </label>

            <button type="submit">Upload Book</button>
          </form>

          {message && <p className="message">{message}</p>}
        </>
      )}
    </div>
  );
};

export default AuthorDashboard;
