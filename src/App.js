import { useState, useEffect } from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import { auth, signOut, onAuthStateChanged } from "./firebase";
import Navbar from "./components/Navbar";
import StreamList from "./components/StreamList";
import Login from "./Login";
import Movies from "./components/Movies";
import Cart from "./components/Cart";
import Subscription from "./components/Subscription";
import Product from "./components/Products";
import { CartProvider } from "./CartContext"; // Import CartProvider
import "./App.css";
import "./styles.css";

function App() {
  const [user, setUser] = useState(null);
  const [darkMode, setDarkMode] = useState(false); // Track dark mode state

  // Toggle dark mode and apply it globally
  useEffect(() => {
    if (darkMode) {
      document.body.classList.add('dark');
    } else {
      document.body.classList.remove('dark');
    }
  }, [darkMode]);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
    });

    return () => unsubscribe();
  }, []);

  const handleSignOut = async () => {
    try {
      await signOut(auth);
    } catch (error) {
      console.error("Sign out error:", error);
    }
  };

  return (
    <CartProvider> {/* Wrap everything inside CartProvider */}
      <Router>
        <div className="app-container">
          {/* If user is logged in, show Navbar, otherwise show only login */}
          {user ? (
            <>
              <Navbar
                user={user}
                handleSignOut={handleSignOut}
                darkMode={darkMode}
                setDarkMode={setDarkMode}
              />
              <Routes>
                {/* Protected Routes */}
                <Route path="/" element={<StreamList />} />
                <Route path="/movies" element={<Movies />} />
                <Route path="/cart" element={<Cart />} />
                <Route path="/subscriptions" element={<Subscription />} />
                <Route path="/products" element={<Product />} />
                <Route path="/about" element={<h2>About Page (Coming Soon)</h2>} />
                {/* Redirect to login if not logged in */}
                <Route path="/login" element={<Navigate to="/" />} />
              </Routes>
            </>
          ) : (
            // If not logged in, only show the login route
            <Routes>
              <Route path="/login" element={<Login setUser={setUser} />} />
              <Route path="*" element={<Navigate to="/login" />} />
            </Routes>
          )}
        </div>
      </Router>
    </CartProvider>
  );
}

export default App;
