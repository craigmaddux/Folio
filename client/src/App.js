// src/App.js
import React from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import './App.css';
import Home from './components/Home';
import Header from './components/Header';
import BookReader from './components/BookReader';
import BookProduct from './components/BookProduct';
import Login from './components/Login';
import SignupForm from './components/SignupForm';
import { AuthProvider } from './context/AuthContext';
import Library from './components/Library';
import ProtectedRoute from './components/ProtectedRoute';
import Footer from './components/Footer';  
import AuthorDashboard from './components/AuthorDashboard';


function AppContent() {
  const location = useLocation();

  const isBookReaderPage = location.pathname.startsWith('/reader/'); // Adjusted for /reader/

  return (
    <>
      <Header /> {/* Header is displayed on all pages */}
      <div className="main-content">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route
            path="/reader/:bookId"
            element={
              <ProtectedRoute>
                <BookReader />
              </ProtectedRoute>
            }
          />
          <Route
            path="/author-dashboard"
            element={
              <ProtectedRoute>
                <AuthorDashboard />
              </ProtectedRoute>
            }
          />
          <Route path="/books/:bookId" element={<BookProduct />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<SignupForm />} />
          <Route path="/author-signup" element={<SignupForm isAuthor={true} />} />
          <Route
            path="/library"
            element={
              <ProtectedRoute>
                <Library />
              </ProtectedRoute>
            }
          />
        </Routes>
      </div>
      {!isBookReaderPage && <Footer />} {/* Footer is conditionally rendered */}
    </>
  );
}

function App() {
  return (
    <Router>
      <AuthProvider>
          <AppContent />
      </AuthProvider>
    </Router>
  );
}


export default App;