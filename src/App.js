import { useState, useEffect } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";
import StreamList from "./components/StreamList";
import "./App.css";
import "./styles.css";
import Movies from "./components/Movies";
import { CartProvider } from "./CartContext";
import Cart from "./components/Cart";
import Subscription from "./components/Subscription";
import Product from "./components/Products";

function App() {
  const [darkMode, setDarkMode] = useState(
    localStorage.getItem("darkMode") === "true"
  );

  useEffect(() => {
    document.body.classList.toggle("dark-mode", darkMode);
    document.body.classList.toggle("light-mode", !darkMode);
    localStorage.setItem("darkMode", darkMode);
  }, [darkMode]);

  return (
    <CartProvider>
      <Router>
        <div className="app-container">
          <Navbar darkMode={darkMode} setDarkMode={setDarkMode} />
          <Routes>
            <Route path="/" element={<StreamList />} />
            <Route path="/movies" element={<Movies />} />
            <Route path="/cart" element={<Cart />} />
            <Route path="/subscriptions" element={<Subscription />} />
            <Route path="/products" element={<Product />} />
            <Route path="/about" element={<h2>About Page (Coming Soon)</h2>} />
          </Routes>
        </div>
      </Router>
    </CartProvider>
  );
}

export default App;
