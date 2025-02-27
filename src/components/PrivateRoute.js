import React from 'react';
import { Navigate } from 'react-router-dom';

// This component protects the routes from non-authenticated users
const PrivateRoute = ({ children, user }) => {
  if (!user) {
    // If the user is not logged in, redirect to the login page
    return <Navigate to="/" />;
  }

  return children; // Render children (protected components) if the user is logged in
};

export default PrivateRoute;
