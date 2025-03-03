// src/services/authService.js
import { auth } from '../firebase';
import { 
  signInWithPopup, 
  GithubAuthProvider, 
  GoogleAuthProvider 
} from 'firebase/auth';

// GitHub authentication
export const signInWithGithub = async () => {
  const provider = new GithubAuthProvider();
  provider.setCustomParameters({
    client_id: process.env.REACT_APP_GITHUB_CLIENT_ID,
    // Note: Client secrets should NOT be used in client-side code
    // This should be handled on your backend
  });
  
  try {
    const result = await signInWithPopup(auth, provider);
    return result.user;
  } catch (error) {
    console.error("GitHub auth error:", error);
    throw error;
  }
};

// Google authentication
export const signInWithGoogle = async () => {
  const provider = new GoogleAuthProvider();
  provider.setCustomParameters({
    client_id: process.env.REACT_APP_GOOGLE_CLIENT_ID
  });
  
  try {
    const result = await signInWithPopup(auth, provider);
    return result.user;
  } catch (error) {
    console.error("Google auth error:", error);
    throw error;
  }
};
