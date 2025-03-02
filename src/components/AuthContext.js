// src/Components/AuthContext.js
import React, { createContext, useState, useContext, useEffect } from 'react';
import { auth, signOut } from '../Services/Firebase';
import { onAuthStateChanged } from 'firebase/auth';

// Create context
export const AuthContext = createContext();

// Custom hook to use the auth context
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

// Auth provider component
export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    console.log("AuthProvider initialized");
    
    // Check for stored user in localStorage
    try {
      const storedUser = localStorage.getItem('user');
      if (storedUser) {
        console.log("Found stored user");
        setUser(JSON.parse(storedUser));
      }
    } catch (e) {
      console.error('Error parsing stored user:', e);
      localStorage.removeItem('user');
    }
    
    // Set up Firebase auth state listener
    let unsubscribe;
    try {
      console.log("Setting up auth state listener");
      unsubscribe = onAuthStateChanged(auth, (firebaseUser) => {
        console.log("Auth state changed:", firebaseUser ? "User logged in" : "No user");
        
        if (firebaseUser) {
          const userData = {
            uid: firebaseUser.uid,
            email: firebaseUser.email,
            name: firebaseUser.displayName || firebaseUser.email.split('@')[0],
            photoURL: firebaseUser.photoURL,
          };
          setUser(userData);
          localStorage.setItem('user', JSON.stringify(userData));
        } else {
          setUser(null);
          localStorage.removeItem('user');
        }
        setLoading(false);
      }, (err) => {
        console.error("Auth state error:", err);
        setError(err);
        setLoading(false);
      });
    } catch (err) {
      console.error("Error setting up auth listener:", err);
      setError(err);
      setLoading(false);
    }

    // Clean up subscription
    return () => {
      if (unsubscribe) unsubscribe();
    };
  }, []);

  // Login function
  const login = (userData) => {
    console.log("Login called with:", userData);
    setUser(userData);
    localStorage.setItem('user', JSON.stringify(userData));
  };

  // Logout function
  const logout = async () => {
    console.log("Logout called");
    try {
      await signOut(auth);
      setUser(null);
      localStorage.removeItem('user');
    } catch (error) {
      console.error('Logout error:', error);
      setError(error);
    }
  };

  // Context value
  const value = {
    user,
    loading,
    error,
    login,
    logout,
    isAuthenticated: !!user
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};
