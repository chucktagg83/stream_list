// src/components/ProtectedRoute.js
import React from 'react';
import { Navigate } from 'react-router-dom';

const ProtectedRoute = ({ user, children }) => {
  if (!user) {
    // Redirect them to the login page if not logged in
    return <Navigate to="/" />;
  }
  
  return children;
};

export default ProtectedRoute;
