import React from "react";
import { loginWithGitHub } from "../firebase";

const GithubLogin = ({ setUser }) => {
  const handleGithubLogin = async () => {
    try {
      const result = await loginWithGitHub();
      setUser(result.user); // Set user state after successful login
    } catch (error) {
      console.error("Error logging in with GitHub:", error.message);
    }
  };

  return <button onClick={handleGithubLogin}>Login with GitHub</button>;
};

export default GithubLogin;
