// src/Services/Firebase.js
import { initializeApp } from 'firebase/app';
import { 
  getAuth, 
  signInWithPopup, 
  GoogleAuthProvider,
  GithubAuthProvider,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut as firebaseSignOut,
  updateProfile
} from 'firebase/auth';

// Firebase configuration from environment variables
const firebaseConfig = {
  apiKey: process.env.REACT_APP_FIREBASE_API_KEY,
  authDomain: process.env.REACT_APP_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.REACT_APP_FIREBASE_PROJECT_ID,
  storageBucket: process.env.REACT_APP_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.REACT_APP_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.REACT_APP_FIREBASE_APP_ID
};

// Log configuration status (remove in production)
console.log('Firebase config loaded:', 
  Object.keys(firebaseConfig).filter(key => !!firebaseConfig[key]).length === 6 
    ? 'Complete' 
    : 'Incomplete'
);

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);

// Auth providers
const googleProvider = new GoogleAuthProvider();
const githubProvider = new GithubAuthProvider();

// Sign in with Google
export const signInWithGoogle = async () => {
  try {
    const result = await signInWithPopup(auth, googleProvider);
    return result;
  } catch (error) {
    console.error("Google sign-in error:", error);
    throw error;
  }
};

// Sign in with GitHub
export const signInWithGithub = async () => {
  try {
    const result = await signInWithPopup(auth, githubProvider);
    return result;
  } catch (error) {
    console.error("GitHub sign-in error:", error);
    throw error;
  }
};

// Sign up with email/password
export const signUpWithEmail = async (email, password, displayName = '') => {
  try {
    const result = await createUserWithEmailAndPassword(auth, email, password);
    
    // Update the user profile with display name if provided
    if (displayName) {
      await updateProfile(result.user, { displayName });
    }
    
    return result;
  } catch (error) {
    console.error("Email sign-up error:", error);
    throw error;
  }
};

// Sign in with email/password
export const signInWithEmail = async (email, password) => {
  try {
    const result = await signInWithEmailAndPassword(auth, email, password);
    return result;
  } catch (error) {
    console.error("Email sign-in error:", error);
    throw error;
  }
};

// Sign out
export const signOut = async () => {
  try {
    await firebaseSignOut(auth);
    return true;
  } catch (error) {
    console.error("Sign-out error:", error);
    throw error;
  }
};

// Export auth instance
export { auth };
