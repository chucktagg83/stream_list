import { Link } from "react-router-dom";
import { FaMoon, FaSun } from "react-icons/fa";
import { useContext } from "react";
import { CartContext } from "../CartContext";

const Navbar = ({ darkMode, setDarkMode, user, handleSignOut }) => {
  const { cart } = useContext(CartContext);

  const toggleDarkMode = () => {
    setDarkMode((prev) => !prev); // Toggle the state
  };

  const getTotalItems = () => {
    return cart.reduce((total, item) => total + item.quantity, 0);
  };

  const getTotalPrice = () => {
    return cart.reduce((total, item) => total + item.price * item.quantity, 0).toFixed(2);
  };

  return (
    <nav className={`navbar ${darkMode ? "dark" : "light"}`}>
      <ul>
        <li><Link to="/">StreamList</Link></li>
        <li><Link to="/movies">Movies</Link></li>
        <li><Link to="/cart">Cart ({getTotalItems()} items - ${getTotalPrice()})</Link></li>
        <li><Link to="/about">About</Link></li>

        {/* Dark Mode Toggle */}
        <li className="toggle">
          <button className="toggle" onClick={toggleDarkMode}>
            {darkMode ? <FaMoon /> : <FaSun />}
          </button>
        </li>

        {/* User Info and Sign Out */}
        {user ? (
          <li className="user-info">
          <span>Welcome, {user.displayName || "User"}!</span>
          <button onClick={handleSignOut}>Sign out</button>
        </li>
        ) : (      
          <li><Link to="/login">Login</Link></li>
        )}
      </ul>
    </nav>
  );
};

export default Navbar;
