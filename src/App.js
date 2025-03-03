import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './components/AuthContext';
import { CartProvider } from './components/CartContext';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Login from './components/Login';
import Navbar from './components/Navbar';
import StreamList from './components/StreamList';
import Movies from './components/Movies';
import About from './components/About'; 
import Cart from './components/Cart';
import CreditCardForm from './components/CreditCardForm';
import OrderConfirmation from './components/OrderConfirmation'; 
import './App.css';

// Removed incorrect BrowserRouter usage

// Loading component with a more user-friendly appearance
const LoadingScreen = () => (
  <div className="loading-container">
    <div className="loading-spinner"></div>
    <div className="loading-text">Loading...</div>
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
  
  return (
    <>
      <Navbar /> {/* Always show Navbar on protected routes */}
      {children}
    </>
  );
};

// Main app content with routing
function AppContent() {
  const { user, loading } = useAuth();
  
  // Show loading screen while auth state is being determined
  if (loading) {
    return <LoadingScreen />;
  }

  return (
    <>
      <Routes>
        {/* Updated Login route - no longer passing onLogin prop */}
        <Route path="/login" element={
          user ? <Navigate to="/" /> : <Login />
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
        
        <Route path="*" element={user ? <Navigate to="/" /> : <Navigate to="/login" />} />
      </Routes>
      <ToastContainer position="bottom-right" />
    </>
  );
}

// Main App component
function App() {
  return (
    <div className="App">
      <Router>
        <AuthProvider>
          <CartProvider>
            <AppContent />
          </CartProvider>
        </AuthProvider>
      </Router>
    </div>
  );
}

export default App;
