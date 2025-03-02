// src/App.js
import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './Components/AuthContext';
import { CartProvider } from './Components/CartContext';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Login from './Components/Login';
import Navbar from './Components/Navbar';
import StreamList from './Components/StreamList';
import Movies from './Components/Movies';
import About from './Components/About';
import Cart from './Components/Cart';
import CreditCardForm from './Components/CreditCardForm';
import OrderConfirmation from './Components/OrderConfirmation'; 
import './App.css';

// Loading component
const LoadingScreen = () => (
  <div style={{ 
    display: 'flex', 
    justifyContent: 'center', 
    alignItems: 'center', 
    height: '100vh',
    flexDirection: 'column'
  }}>
    <div>Loading...</div>
  </div>
);

// Protected route component
const ProtectedRoute = ({ children }) => {
  const { user, loading } = useAuth();
  
  if (loading) {
    return <LoadingScreen />;
  }
  
  if (!user) {
    return <Navigate to="/login" />;
  }
  
  return children;
};

// Main app content with routing
function AppContent() {
  const { user, login, loading } = useAuth();
  
  // Show loading screen while auth state is being determined
  if (loading) {
    return <LoadingScreen />;
  }

  return (
    <Router>
      {user && <Navbar />}
      <Routes>
        <Route path="/login" element={
          user ? <Navigate to="/" /> : <Login onLogin={login} />
        } />
        <Route path="/" element={
          <ProtectedRoute>
            <StreamList />
          </ProtectedRoute>
        } />
        <Route path="/movies" element={
          <ProtectedRoute>
            <Movies />
          </ProtectedRoute>
        } />
        <Route path="/about" element={
          <ProtectedRoute>
            <About />
          </ProtectedRoute>
        } />
        <Route path="/cart" element={
          <ProtectedRoute>
            <Cart />
          </ProtectedRoute>
        } />
        {/* Add the checkout routes */}
        <Route path="/checkout" element={
          <ProtectedRoute>
            <CreditCardForm />
          </ProtectedRoute>
        } />
        <Route path="/order-confirmation" element={
          <ProtectedRoute>
            <OrderConfirmation />
          </ProtectedRoute>
        } />
        {/* Add a catch-all route */}
        <Route path="*" element={user ? <Navigate to="/" /> : <Navigate to="/login" />} />
      </Routes>
      <ToastContainer position="bottom-right" />
    </Router>
  );
}

// Main App component
function App() {
  return (
    <div className="App">
      <AuthProvider>
        <CartProvider>
          <AppContent />
        </CartProvider>
      </AuthProvider>
    </div>
  );
}

export default App;
