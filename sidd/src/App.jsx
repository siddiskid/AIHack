import { useState } from "react";
import "./App.css";
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import VoiceTranscription from "./components/VoiceTranscription";
import Auth from "./components/Auth";

const firebaseConfig = {
  apiKey: "AIzaSyDoStP2q45t8lJ8E6WjwIEangeyrZqd8i0",
  authDomain: "aihack-45bb6.firebaseapp.com",
  projectId: "aihack-45bb6",
  storageBucket: "aihack-45bb6.firebasestorage.app",
  messagingSenderId: "813810350541",
  appId: "1:813810350541:web:28797cf7cc208c77f0ec84",
  measurementId: "G-TK5WV4C76Y",
};

// Email validation regex
const EMAIL_REGEX = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const app = initializeApp(firebaseConfig);
  const auth = getAuth(app);

  const validateEmail = (email) => {
    if (!email) return "Email is required";
    if (!EMAIL_REGEX.test(email)) return "Please enter a valid email address";
    return null;
  };

  const validatePassword = (password) => {
    if (!password) return "Password is required";
    if (password.length < 6)
      return "Password must be at least 6 characters long";
    return null;
  };

  const handleSignOut = () => {
    auth.signOut().then(() => {
      setIsAuthenticated(false);
      console.log("User signed out");
    });
  };

  const handleAuthenticated = (value) => {
    setIsAuthenticated(value);
  };

  return (
    <Router>
      <div className="app-container">
        {isAuthenticated && (
          <header>
            <h1>Medical Transcription App</h1>
            <div className="auth-buttons">
              <p>Welcome! You are signed in.</p>
              <button onClick={handleSignOut}>Sign out</button>
            </div>
          </header>
        )}

        <Routes>
          <Route
            path="/"
            element={
              isAuthenticated ? (
                <VoiceTranscription />
              ) : (
                <Auth onAuthenticated={handleAuthenticated} />
              )
            }
          />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
