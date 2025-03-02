import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import "./styles.css";
<link rel="manifest" href="/manifest.json" />


const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
// The index.js file is the entry point of the application. It renders the App component inside a React root using ReactDOM.createRoot. The App component is wrapped in React.StrictMode to enable additional checks and warnings for potential issues in the application. The styles.css file is also imported to apply global styles to the application. The rendered content is inserted into the root element with the id "root" in the HTML document.
if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
      navigator.serviceWorker.register('/service-worker.js').then((registration) => {
          console.log('Service Worker registered with scope:', registration.scope);
      }).catch((error) => {
          console.log('Service Worker registration failed:', error);
      });
  });
}
// The code snippet registers a service worker for the application if the browser supports service workers. The service worker file is located at /service-worker.js and is registered with the navigator.serviceWorker.register method. The registration process logs the success or failure messages to the console.