// src/Components/Login.js
import React, { useState } from 'react';
import { FaGithub, FaGoogle, FaEnvelope, FaLock, FaUser } from 'react-icons/fa';
import { 
  signInWithGoogle, 
  signInWithGithub, 
  signInWithEmail, 
  signUpWithEmail 
} from '../Services/Firebase';
import './Login.css';

const Login = ({ onLogin }) => {
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [isLogin, setIsLogin] = useState(true);

  const toggleMode = () => {
    setIsLogin(!isLogin);
    setError('');
  };
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    
    try {
      let userCredential;
      
      if (isLogin) {
        userCredential = await signInWithEmail(email, password);
      } else {
        userCredential = await signUpWithEmail(email, password, name);
      }
      
      const user = {
        uid: userCredential.user.uid,
        email: userCredential.user.email,
        name: userCredential.user.displayName || name || email.split('@')[0],
        photoURL: userCredential.user.photoURL,
      };
      
      // Store user in localStorage for persistence
      localStorage.setItem('user', JSON.stringify(user));
      
      onLogin(user);
    } catch (err) {
      console.error('Authentication error:', err);
      
      // Format Firebase error messages to be more user-friendly
      let errorMessage = 'Authentication failed. Please try again.';
      
      if (err.code === 'auth/user-not-found' || err.code === 'auth/wrong-password') {
        errorMessage = 'Invalid email or password.';
      } else if (err.code === 'auth/email-already-in-use') {
        errorMessage = 'This email is already registered.';
      } else if (err.code === 'auth/weak-password') {
        errorMessage = 'Password should be at least 6 characters.';
      } else if (err.code === 'auth/invalid-email') {
        errorMessage = 'Please enter a valid email address.';
      } else if (err.code === 'auth/popup-closed-by-user') {
        errorMessage = 'Sign-in popup was closed before completing the sign in.';
      }
      
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const handleSocialLogin = async (provider) => {
    setError('');
    setLoading(true);
    
    try {
      let userCredential;
      
      if (provider === 'google') {
        userCredential = await signInWithGoogle();
      } else if (provider === 'github') {
        userCredential = await signInWithGithub();
      }
      
      const user = {
        uid: userCredential.user.uid,
        email: userCredential.user.email,
        name: userCredential.user.displayName || userCredential.user.email.split('@')[0],
        photoURL: userCredential.user.photoURL,
        provider: provider
      };
      
      // Store user in localStorage for persistence
      localStorage.setItem('user', JSON.stringify(user));
      
      onLogin(user);
    } catch (err) {
      console.error('Social authentication error:', err);
      
      // Don't show error if user just closed the popup
      if (err.code !== 'auth/popup-closed-by-user') {
        setError(err.message || 'Authentication failed. Please try again.');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-container">
      <div className="login-card">
        <h2>{isLogin ? 'Login' : 'Sign Up'}</h2>
        
        {error && <div className="error-message">{error}</div>}
        
        <form onSubmit={handleSubmit}>
          {!isLogin && (
            <div className="form-group">
              <label htmlFor="name">
                <FaUser className="input-icon" />
              </label>
              <input
                type="text"
                id="name"
                placeholder="Full Name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required={!isLogin}
              />
            </div>
          )}
          
          <div className="form-group">
            <label htmlFor="email">
              <FaEnvelope className="input-icon" />
            </label>
            <input
              type="email"
              id="email"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          
          <div className="form-group">
            <label htmlFor="password">
              <FaLock className="input-icon" />
            </label>
            <input
              type="password"
              id="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
          
          <button 
            type="submit" 
            className="login-button"
            disabled={loading}
          >
            {loading ? 'Processing...' : isLogin ? 'Login' : 'Sign Up'}
          </button>
        </form>
        
        <div className="social-login">
          <p>Or continue with</p>
          <div className="social-buttons">
            <button 
              onClick={() => handleSocialLogin('google')}
              className="google-button"
              disabled={loading}
            >
              <FaGoogle /> Google
            </button>
            <button 
              onClick={() => handleSocialLogin('github')}
              className="github-button"
              disabled={loading}
            >
              <FaGithub /> GitHub
            </button>
          </div>
        </div>
        
        <div className="toggle-form">
          <p>
            {isLogin ? "Don't have an account? " : "Already have an account? "}
            <button 
              type="button" 
              onClick={toggleMode}
              className="toggle-button"
            >
              {isLogin ? 'Sign Up' : 'Login'}
            </button>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;
