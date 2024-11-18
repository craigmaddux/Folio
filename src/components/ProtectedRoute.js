import React from 'react';
import { Navigate } from 'react-router-dom';
import { useContext } from 'react';
import AuthContext from '../context/AuthContext';

const ProtectedRoute = ({ children }) => {
  const { user, isAuthor } = useContext(AuthContext);

  if (!user) {
    return <Navigate to="/login" />;
  }

  // If the route requires author access, ensure isAuthor is true
  const isAuthorPage = window.location.pathname.startsWith('/author-dashboard');
  if (isAuthorPage && !isAuthor) {
    return <Navigate to="/" />;
  }

  return children;
};

export default ProtectedRoute;
