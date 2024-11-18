import React, { createContext, useState, useEffect } from 'react';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);

  // Restore user from localStorage on app load
  
  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      try {
        const parsedUser = JSON.parse(storedUser); // Safely parse stored user
        setUser(parsedUser);
      } catch (error) {
        console.error('Error parsing user data from localStorage:', error.message);
        localStorage.removeItem('user'); // Clean up corrupted data
      }
    }
  }, []);
  

  // Save user to localStorage on login
  const login = (userData) => {
    setUser(userData);
    console.log(userData);
    localStorage.setItem('user', JSON.stringify(userData));
  };

  // Remove user from localStorage on logout
  const logout = () => {
    setUser(null);
    localStorage.removeItem('user');
  };

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthContext;
