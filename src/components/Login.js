import React, { useState } from "react";
import { loginWithEmail, loginWithGoogle, loginWithGitHub } from "../firebase";
import { useNavigate } from "react-router-dom";
import "./Login.css"; // Import the CSS file

const Login = ({ setUser }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      await loginWithEmail(email, password);
      navigate("/");
    } catch (error) {
      setError("Login failed: " + error.message);
    }
  };

  const handleGoogleLogin = async () => {
    try {
      await loginWithGoogle();
      navigate("/");
    } catch (error) {
      setError("Google login failed: " + error.message);
    }
  };

  const handleGitHubLogin = async () => {
    try {
      await loginWithGitHub();
      navigate("/");
    } catch (error) {
      setError("GitHub login failed: " + error.message);
    }
  };

  return (
    <div className="login-container">
      <h2 className="login-title">Login</h2>
      {error && <p className="error-message">{error}</p>}
      
      <form className="login-form" onSubmit={handleLogin}>
        <div className="form-group">
          <input
            className="input-field"
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>
        <div className="form-group">
          <input
            className="input-field"
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>
        <button className="primary-button" type="submit">Login</button>
      </form>
      
      <div className="divider">Or</div>
      
      <button className="social-button google-button" onClick={handleGoogleLogin}>
        Login with Google
      </button>
      <button className="social-button github-button" onClick={handleGitHubLogin}>
        Login with GitHub
      </button>
      
      <p className="register-link">
        Don't have an account? <a href="/register">Register</a>
      </p>
    </div>
  );
};

export default Login;
