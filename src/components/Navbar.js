import { Link } from "react-router-dom";
import { FaMoon, FaSun } from "react-icons/fa";

const Navbar = ({ darkMode, setDarkMode }) => {
  // Function to toggle dark mode
  const toggleDarkMode = () => {
    setDarkMode((prev) => !prev); // Toggle the state
  };

  return (
    <nav className="navbar">
      <ul>
        <li><Link to="/">StreamList</Link></li>
        <li><Link to="/movies">Movies</Link></li>
        <li><Link to="/cart">Cart</Link></li>
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
