import React, { createContext, useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isAuthor, setIsAuthor] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    // Check if user is already logged in
    const loggedInUser = localStorage.getItem('user');
    const authorStatus = localStorage.getItem('isAuthor') === 'true';
    if (loggedInUser) {
      setUser(JSON.parse(loggedInUser));
      setIsAuthor(authorStatus);
    }
  }, []);

  const login = (userData, authorStatus) => {
    setUser(userData);
    setIsAuthor(authorStatus);
    localStorage.setItem('user', JSON.stringify(userData));
    localStorage.setItem('isAuthor', authorStatus);
    navigate('/dashboard');
  };

  const logout = () => {
    setUser(null);
    setIsAuthor(false);
    localStorage.removeItem('user');
    localStorage.removeItem('isAuthor');
    navigate('/login');
  };

  return (
    <AuthContext.Provider value={{ user, isAuthor, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthContext;