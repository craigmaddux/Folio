import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { fetchFromAPI } from './api';
import './MyAccount.css';

const AccountPage = () => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const response = await fetchFromAPI('/my-account', { method: 'GET' });
        const data = await response.json();
        setUser(data);
      } catch (error) {
        console.error('Error fetching user data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchUserData();
  }, []);

  if (loading) return <p>Loading...</p>;

  const handleNavigation = (path) => {
    navigate(path);
  };

  return (
    <div className="account-page">
      <h2>Welcome!</h2>
      <div className="account-buttons">
        <button onClick={() => handleNavigation('/reset-password')}>Reset Password</button>
        <button onClick={() => handleNavigation('/view-orders')}>View Orders</button>
        <button onClick={() => handleNavigation('/become-an-author')}>Become an Author</button>
        
       
      </div>
    </div>
  );
};

export default AccountPage;
