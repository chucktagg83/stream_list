// src/firebase.js
import { initializeApp } from "firebase/app";
import { getAuth, signInWithEmailAndPassword, createUserWithEmailAndPassword, signInWithPopup, GoogleAuthProvider, GithubAuthProvider, signOut, onAuthStateChanged } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyANtxX_8szB76lWQ9hmCCsWswPY6lZzyrU",
  authDomain: "streamlist123.firebaseapp.com",
  projectId: "streamlist123",
  storageBucket: "streamlist123.firebasestorage.app",
  messagingSenderId: "171925137286",
  appId: "1:171925137286:web:e2a78a080440e3e751ae07",
  measurementId: "G-CQTLQQXLNT"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);

// Sign-in with Google
const googleProvider = new GoogleAuthProvider();
const githubProvider = new GithubAuthProvider();

export const loginWithEmail = (email, password) => {
  return signInWithEmailAndPassword(auth, email, password);
};

export const registerWithEmail = (email, password) => {
  return createUserWithEmailAndPassword(auth, email, password);
};

export const loginWithGoogle = () => {
  return signInWithPopup(auth, googleProvider);
};

export const loginWithGitHub = () => {
  githubProvider.setCustomParameters({
    // Include the correct redirect URI if needed
    redirect_uri: "https://streamlist123.firebaseapp.com/__/auth/handler", // Example URI
  });
  return signInWithPopup(auth, githubProvider);
};

export const handleSignOut = () => {
  return signOut(auth);
};

// Using the updated onAuthStateChanged listener
export const onAuthStateChangedListener = (callback) => {
  return onAuthStateChanged(auth, callback);
};

// Export auth so it can be used in Register.js
export { auth };
