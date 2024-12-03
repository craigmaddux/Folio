// src/App.js
import React from 'react';
import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom';
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
import AuthorProfile from './components/AuthorProfile';
import PurchaseCreditsPage from './components/PurchaseCreditsPage';
import Yay from './components/Yay';
import Checkout from './components/CheckoutPage';
import PaymentSuccessPage from './components/PaymentSuccessPage'; 
import MyAccount from './components/MyAccount';
import RouteLogger from './components/RouteLogger';
import BankDetailsPage from './components/BankDetailsWidget';
import CheckYourEmail from './components/CheckYourEmail';
import VerificationPage from './components/VerificationPage'


function AppContent() {
  const location = useLocation();

  const isBookReaderPage = location.pathname.startsWith('/reader/'); // Adjusted for /reader/

  return (
    <>
      <Header /> {/* Header is displayed on all pages */}
      <div className="main-content">
        <Routes>
          <Route path="/check-your-email" element={<CheckYourEmail />} />
          <Route path="/verify-email" element={<VerificationPage />} />
          <Route path="/" element={<Home />} />
          console.log(BankDetailsPage);
          <Route path="/author-bank-details" element={<BankDetailsPage />} />
          <Route path="/payment-success" element={<PaymentSuccessPage />} />
          <Route path="/purchase-credits" element={<PurchaseCreditsPage />} />
          <Route
            path="/reader/:bookId"
            element={
              <ProtectedRoute>
                <BookReader />
              </ProtectedRoute>
            }
          />
           <Route
            path="/my-account"
            element={
              <ProtectedRoute>
                <MyAccount />
              </ProtectedRoute>
            }
          />
           <Route
            path="/checkout"
            element={
              <ProtectedRoute>
                <Checkout />
              </ProtectedRoute>
            }
          />
          <Route
            path="/profile"
            element={
              <ProtectedRoute>
                <AuthorProfile />
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
    <BrowserRouter>
      <AuthProvider>
        <RouteLogger />
          <AppContent />
      </AuthProvider>
    </BrowserRouter>
  );
}


export default App;
