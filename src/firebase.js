import { initializeApp } from "firebase/app";
import { 
  getAuth, 
  GithubAuthProvider, 
  GoogleAuthProvider, 
  signInWithPopup, 
  signOut, 
  onAuthStateChanged 
} from "firebase/auth";

// Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyCvPe-jBDOtUz6rESSgJE6BfvFOLJO-mB0",
  authDomain: "streamlist-71822.firebaseapp.com",
  projectId: "streamlist-71822",
  storageBucket: "streamlist-71822.firebasestorage.app",
  messagingSenderId: "444163202583",
  appId: "1:444163202583:web:a6f3749acd0b4b73290652",
  measurementId: "G-DCCSQ4M10H"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);

// Define Providers
const githubProvider = new GithubAuthProvider();
const googleProvider = new GoogleAuthProvider();

export { auth, githubProvider, googleProvider, signInWithPopup, signOut, onAuthStateChanged };
