import { useState, useContext, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { FaMoon, FaSun, FaShoppingCart, } from "react-icons/fa";
import { CartContext } from "../CartContext";

const Navbar = ({ darkMode, setDarkMode, user, handleSignOut }) => {
  const { cart } = useContext(CartContext);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const location = useLocation();

  // Close mobile menu when route changes
  useEffect(() => {
    setMobileMenuOpen(false);
  }, [location]);

  const toggleDarkMode = () => {
    setDarkMode((prev) => !prev);
  };

  const getTotalItems = () => {
    return cart.reduce((total, item) => total + item.quantity, 0);
  };

  const getTotalPrice = () => {
    return cart.reduce((total, item) => total + item.price * item.quantity, 0).toFixed(2);
  };

  return (
    <nav className={`navbar ${darkMode ? "dark" : "light"}`}>
      <div className="navbar-logo">
        <Link to="/">StreamList</Link>
      </div>

      <ul className={`navbar-links ${mobileMenuOpen ? "active" : ""}`}>
        <li><Link to="/movies" className={location.pathname === "/movies" ? "active" : ""}>Movies</Link></li>
        <li><Link to="/about" className={location.pathname === "/about" ? "active" : ""}>About</Link></li>
        
        <li className="cart-link">
          <Link to="/cart" className={location.pathname === "/cart" ? "active" : ""}>
            <FaShoppingCart />
            {getTotalItems() > 0 && <span className="cart-badge">{getTotalItems()}</span>}
            <span className="cart-text">Cart (${getTotalPrice()})</span>
          </Link>
        </li>
      </ul>
      
      <div className="navbar-actions">
        <button 
          className="theme-toggle" 
          onClick={toggleDarkMode}
          aria-label={darkMode ? "Switch to light mode" : "Switch to dark mode"}
        >
          {darkMode ? <FaSun /> : <FaMoon />}
        </button>
        
        {user ? (
          <div className="user-menu">
            <span className="user-greeting">Hi, {user.displayName?.split(' ')[0] || "User"}</span>
            <button className="sign-out-btn" onClick={handleSignOut}>Sign out</button>
          </div>
        ) : (      
          <Link to="/login" className="login-btn">Login</Link>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
