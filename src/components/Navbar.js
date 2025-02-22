import { Link } from "react-router-dom";
import { FaMoon, FaSun } from "react-icons/fa";
import { useContext } from "react";
import { CartContext } from "../CartContext";

const Navbar = ({ darkMode, setDarkMode }) => {
  const { cart } = useContext(CartContext); // Accessing cart from context

  // Calculate the total number of items in the cart
  const getTotalItems = () => {
    return cart.reduce((total, item) => total + item.quantity, 0);
  };

  // Calculate the total price of the cart
  const getTotalPrice = () => {
    return cart.reduce((total, item) => total + item.price * item.quantity, 0).toFixed(2);
  };

  // Function to toggle dark mode
  const toggleDarkMode = () => {
    setDarkMode((prev) => !prev); // Toggle the state
  };

  return (
    <nav className="navbar">
      <ul>
        <li><Link to="/">StreamList</Link></li>
        <li><Link to="/movies">Movies</Link></li>
        <li><Link to="/cart">Cart ({getTotalItems()} items - ${getTotalPrice()})</Link></li>
        <li><Link to="/about">About</Link></li>
        <li className="toggle">
          <button className="toggle" onClick={toggleDarkMode}>
            {darkMode ? <FaMoon /> : <FaSun />} {/* Icons for light and dark mode */}
          </button>
        </li>
      </ul>
    </nav>
  );
};

export default Navbar;
