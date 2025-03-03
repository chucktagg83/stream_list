import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from './AuthContext';
import { useCart } from './CartContext';
import { FaHome, FaFilm, FaInfoCircle, FaShoppingCart, FaCog, FaUser, FaSignOutAlt, FaBars, FaTimes } from 'react-icons/fa';
import './Navbar.css';

const Navbar = () => {
  const { user, logout } = useAuth();
  const cart = useCart();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  
  // Safely access itemCount with a fallback to 0
  const itemCount = cart?.itemCount || 0;

  const toggleMobileMenu = () => {
    setMobileMenuOpen(!mobileMenuOpen);
  };

  return (
    <nav className="navbar">
      <div className="navbar-brand">
        <Link to="/">EZTECH</Link>
        <button className="mobile-menu-toggle" onClick={toggleMobileMenu}>
          {mobileMenuOpen ? <FaTimes /> : <FaBars />}
        </button>
      </div>
      
      <div className={`navbar-menu ${mobileMenuOpen ? 'is-active' : ''}`}>
        <Link to="/" className="navbar-item" onClick={() => setMobileMenuOpen(false)}>
          <FaHome className="nav-icon" /> Home
        </Link>
        <Link to="/movies" className="navbar-item" onClick={() => setMobileMenuOpen(false)}>
          <FaFilm className="nav-icon" /> Movies
        </Link>
        <Link to="/about" className="navbar-item" onClick={() => setMobileMenuOpen(false)}>
          <FaInfoCircle className="nav-icon" /> About
        </Link>
      </div>
      
      <div className={`navbar-end ${mobileMenuOpen ? 'is-active' : ''}`}>
        <Link to="/cart" className="cart-button" onClick={() => setMobileMenuOpen(false)}>
          <FaShoppingCart className="cart-icon" /> 
          <span>Cart</span>
          {itemCount > 0 && <span className="cart-badge">{itemCount}</span>}
        </Link>
        
        <div className="user-menu">
          {user?.photoURL ? (
            <img src={user.photoURL} alt={user.name} className="user-avatar" />
          ) : (
            <div className="user-avatar-placeholder">
              {user?.name?.charAt(0) || 'U'}
            </div>
          )}
          <span className="user-name">{user?.name}</span>
          
          <div className="dropdown-menu">
            <Link to="/profile" className="dropdown-item" onClick={() => setMobileMenuOpen(false)}>
              <FaUser className="dropdown-icon" /> Profile
            </Link>
            <Link to="/settings" className="dropdown-item" onClick={() => setMobileMenuOpen(false)}>
              <FaCog className="dropdown-icon" /> Settings
            </Link>
            <button 
              onClick={() => {
                logout();
                setMobileMenuOpen(false);
              }} 
              className="logout-button"
            >
              <FaSignOutAlt className="dropdown-icon" /> Logout
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
