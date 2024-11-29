// src/components/AuthorProfile.js
import React, { useState, useEffect, useContext } from 'react';
import AuthContext from '../context/AuthContext';
import './AuthorProfile.css';
import { fetchFromAPI } from './api';

const AuthorProfile = () => {
  const { user } = useContext(AuthContext);
  const [authorProfile, setAuthorProfile] = useState({
    firstName: '',
    lastName: '',
    about: '',
    instagramLink: '',
    xLink: '',
    facebookLink: '',
  });
  const [message, setMessage] = useState('');

  useEffect(() => {
    // Fetch existing profile if it exists
    const fetchProfile = async () => {
      const response = await fetchFromAPI(`/authors/${user.id}`);
      if (response.ok) {
        const data = await response.json();
        setAuthorProfile(data);
      }
    };
    fetchProfile();
  }, [user.id]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const response = await fetch(`/api/authors/${user.id}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(authorProfile),
    });

    if (response.ok) {
      setMessage('Profile updated successfully!');
    } else {
      setMessage('Failed to update profile.');
    }
  };

  return (
    <div className="author-profile">
      <div className="info-box">
        <p>
          If you want to publish and sell your own books online, you'll need to fill out your author profile. 
          <strong> First Name</strong>, <strong>Last Name</strong>, and <strong>About</strong> are required.
        </p>
      </div>
      {message && <p className="message">{message}</p>}
      <form onSubmit={handleSubmit}>
        <label>
          First Name <span className="required">*</span>
        </label>
        <input
          type="text"
          value={authorProfile.firstName}
          onChange={(e) => setAuthorProfile({ ...authorProfile, firstName: e.target.value })}
          required
        />

        <label>
          Last Name <span className="required">*</span>
        </label>
        <input
          type="text"
          value={authorProfile.lastName}
          onChange={(e) => setAuthorProfile({ ...authorProfile, lastName: e.target.value })}
          required
        />

        <label>
          About <span className="required">*</span>
        </label>
        <textarea
          value={authorProfile.about}
          onChange={(e) => setAuthorProfile({ ...authorProfile, about: e.target.value })}
          required
        />

        <label>Instagram Link</label>
        <input
          type="url"
          value={authorProfile.instagramLink}
          onChange={(e) => setAuthorProfile({ ...authorProfile, instagramLink: e.target.value })}
        />

        <label>X Link</label>
        <input
          type="url"
          value={authorProfile.xLink}
          onChange={(e) => setAuthorProfile({ ...authorProfile, xLink: e.target.value })}
        />

        <label>Facebook Link</label>
        <input
          type="url"
          value={authorProfile.facebookLink}
          onChange={(e) => setAuthorProfile({ ...authorProfile, facebookLink: e.target.value })}
        />

        <button type="submit">Save Profile</button>
      </form>
    </div>
  );
};

export default AuthorProfile;
