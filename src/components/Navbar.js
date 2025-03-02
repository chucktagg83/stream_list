// src/Components/Navbar.js
import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from './AuthContext';
import { useCart } from './CartContext';

const Navbar = () => {
  const { user, logout } = useAuth();
  const cart = useCart();
  
  // Safely access itemCount with a fallback to 0
  const itemCount = cart?.itemCount || 0;

  return (
    <nav className="navbar">
      <div className="navbar-brand">
        <Link to="/">EZTECH</Link>
      </div>
      
      <div className="navbar-menu">
        <Link to="/" className="navbar-item">Home</Link>
        <Link to="/movies" className="navbar-item">Movies</Link>
        <Link to="/about" className="navbar-item">About</Link>
      </div>
      
      <div className="navbar-end">
        <div className="navbar-item">
          <Link to="/cart" className="cart-button">
            Cart ({itemCount})
          </Link>
        </div>
        
        <div className="navbar-item user-menu">
          {user?.photoURL ? (
            <img src={user.photoURL} alt={user.name} className="user-avatar" />
          ) : (
            <div className="user-avatar-placeholder">
              {user?.name?.charAt(0) || 'U'}
            </div>
          )}
          <span className="user-name">{user?.name}</span>
          
          <div className="dropdown-menu">
            <Link to="/profile" className="dropdown-item">Profile</Link>
            <Link to="/settings" className="dropdown-item">Settings</Link>
            <button onClick={logout} className="dropdown-item logout-button">
              Logout
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
