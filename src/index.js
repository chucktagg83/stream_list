import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import "./styles.css";
// Remove the BrowserRouter import and usage

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);

// Service worker code remains the same


// Registering the Service Worker for offline functionality
if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
      navigator.serviceWorker.register('/service-worker.js').then((registration) => {
          console.log('Service Worker registered with scope:', registration.scope);
      }).catch((error) => {
          console.log('Service Worker registration failed:', error);
      });
  });
}

