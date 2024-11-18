import React from 'react';
import UploadBook from './UploadBook';
import './AuthorDashboard.css';

const AuthorDashboard = () => {
  return (
    <div className="author-dashboard"> 
      <h1>Author Dashboard</h1>
      <UploadBook />
    </div>
  );
};

export default AuthorDashboard;
