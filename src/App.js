import { useState, useEffect } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";
import StreamList from "./components/StreamList";
import "./App.css";
import "./styles.css";

const App = () => {
  const [darkMode, setDarkMode] = useState(
    localStorage.getItem("darkMode") === "true"
  );

  useEffect(() => {
    document.body.classList.toggle("dark-mode", darkMode);
    document.body.classList.toggle("light-mode", !darkMode);
    localStorage.setItem("darkMode", darkMode);
  }, [darkMode]);

  return (
    <Router>
      <div className="app-container">
        <Navbar darkMode={darkMode} setDarkMode={setDarkMode} />
        <Routes>
          <Route path="/" element={<StreamList />} />
          <Route path="/movies" element={<h2>Movies Page (Coming Soon)</h2>} />
          <Route path="/cart" element={<h2>Cart Page (Coming Soon)</h2>} />
          <Route path="/about" element={<h2>About Page (Coming Soon)</h2>} />
        </Routes>
      </div>
    </Router>
  );
};

export default App;
