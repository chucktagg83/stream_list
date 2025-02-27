import React from "react";
import { loginWithGoogle } from "../firebase";

const GoogleLogin = ({ setUser }) => {
  const handleGoogleLogin = async () => {
    try {
      const result = await loginWithGoogle();
      setUser(result.user); // Set user state after successful login
    } catch (error) {
      console.error("Error logging in with Google:", error.message);
    }
  };

  return <button onClick={handleGoogleLogin}>Login with Google</button>;
};

export default GoogleLogin;
