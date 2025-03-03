// Code to manage user authentication state using Firebase Auth
// This code is based on the Firebase Auth documentation: https://firebase.google.com/docs/auth/web/start
import React, { createContext, useState, useContext, useEffect } from 'react';
import { auth } from '../Services/Firebase';
import { onAuthStateChanged, signOut as firebaseSignOut } from 'firebase/auth';

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

  // Clear any auth errors
  const clearError = () => setError(null);

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
            name: firebaseUser.displayName || firebaseUser.email?.split('@')[0] || 'User',
            photoURL: firebaseUser.photoURL,
            emailVerified: firebaseUser.emailVerified,
          
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

  // Update user data (for when you need to update without a full auth state change)
  const updateUserData = (userData) => {
    console.log("Updating user data:", userData);
    setUser(userData);
    localStorage.setItem('user', JSON.stringify(userData));
  };

  // Logout function
  const logout = async () => {
    console.log("Logout called");
    setLoading(true);
    clearError();
    try {
      await firebaseSignOut(auth);
      setUser(null);
      localStorage.removeItem('user');
    } catch (error) {
      console.error('Logout error:', error);
      setError(error);
    } finally {
      setLoading(false);
    }
  };

  // Context value
  const value = {
    user,
    loading,
    error,
    updateUserData,
    logout,
    clearError,
    isAuthenticated: !!user
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};
