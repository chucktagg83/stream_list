import { useState, useEffect } from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import { handleSignOut, onAuthStateChangedListener } from "./firebase";
import Navbar from "./components/Navbar";
import StreamList from "./components/StreamList";
import Movies from "./components/Movies";
import Cart from "./components/Cart";
import Subscription from "./components/Subscription";
import Product from "./components/Products";
import { CartProvider } from "./CartContext";
import "./App.css";
import "./styles.css";
import Register from "./components/Register";
import Login from "./components/Login"; // Import the Login component
import GoogleLogin from "./components/GoogleLogin"; // Import the GoogleLogin component
import GithubLogin from "./components/GithubLogin"; // Import the GithubLogin component
import ProtectedRoute from "./components/ProtectedRoutes"; // Import the ProtectedRoute component 

function App() {
  // Load user from localStorage, if available
  const [user, setUser] = useState(() => {
    return JSON.parse(localStorage.getItem("user")) || null; // Load user from localStorage
  });

  // Manage dark mode state and persistence in localStorage
  const [darkMode, setDarkMode] = useState(() => {
    return localStorage.getItem("darkMode") === "true"; // Load dark mode preference from localStorage
  });

  // Effect to toggle dark mode based on the state
  useEffect(() => {
    console.log("User State:", user); // Log user state to see its value
    if (darkMode) {
      document.body.classList.add("dark");
      localStorage.setItem("darkMode", "true"); // Save dark mode state to localStorage
    } else {
      document.body.classList.remove("dark");
      localStorage.setItem("darkMode", "false"); // Save dark mode state to localStorage
    }
  }, [darkMode, user]); // Only depend on darkMode and user for this effect

  // Effect to listen for changes in authentication state and update the user
  useEffect(() => {
    const unsubscribe = onAuthStateChangedListener((currentUser) => {
      console.log("Auth state changed:", currentUser); // Log auth state changes
      setUser(currentUser);
      if (currentUser) {
        localStorage.setItem("user", JSON.stringify(currentUser)); // Save user session
      } else {
        localStorage.removeItem("user"); // Clear storage on logout
      }
    });

    return () => unsubscribe();
  }, []);

  return (
    <CartProvider>
      <Router>
        <Navbar
          user={user}
          handleSignOut={() => {
            handleSignOut();
            setUser(null);
            localStorage.removeItem("user");
          }}
          darkMode={darkMode}
          setDarkMode={setDarkMode}
        />
        <Routes>
          {/* Route for Login page, only if the user is not logged in */}
          {!user ? (
            <>
              <Route path="/" element={<Login setUser={setUser} />} />
              <Route path="/register" element={<Register />} />
              {/* Add routes for Google and GitHub Login */}
              <Route path="/google-login" element={<GoogleLogin setUser={setUser} />} />
              <Route path="/github-login" element={<GithubLogin setUser={setUser} />} />
            </>
          ) : (
            <>
              {/* Redirect logged-in users from login */}
              <Route path="/login" element={<Navigate to="/" />} />
              <Route
                path="/"
                element={
                  <ProtectedRoute user={user}>
                    <StreamList />
                  </ProtectedRoute>
                }
              />
              {/* Protected routes */}
              <Route
                path="/movies"
                element={
                  <ProtectedRoute user={user}>
                    <Movies />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/cart"
                element={
                  <ProtectedRoute user={user}>
                    <Cart />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/subscriptions"
                element={
                  <ProtectedRoute user={user}>
                    <Subscription />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/products"
                element={
                  <ProtectedRoute user={user}>
                    <Product />
                  </ProtectedRoute>
                }
              />
              <Route path="/about" element={<h2>About Page (Coming Soon)</h2>} />
            </>
          )}
        </Routes>
      </Router>
    </CartProvider>
  );
}

export default App;
