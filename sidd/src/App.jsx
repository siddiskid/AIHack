import { useState, useEffect } from "react";
import "./App.css";
import { initializeApp } from "firebase/app";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import { BrowserRouter as Router, Routes, Route, Navigate, Link, useLocation } from "react-router-dom";
import VoiceTranscription from "./components/VoiceTranscription";
import Auth from "./components/Auth";
import Home from "./components/Home";
import Services from "./components/Services";
import About from "./components/About";
import Contact from "./components/Contact";

const firebaseConfig = {
  apiKey: "AIzaSyDoStP2q45t8lJ8E6WjwIEangeyrZqd8i0",
  authDomain: "aihack-45bb6.firebaseapp.com",
  projectId: "aihack-45bb6",
  storageBucket: "aihack-45bb6.firebasestorage.app",
  messagingSenderId: "813810350541",
  appId: "1:813810350541:web:28797cf7cc208c77f0ec84",
  measurementId: "G-TK5WV4C76Y",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
// Initialize Firebase Authentication
const auth = getAuth(app);

// Email validation regex
const EMAIL_REGEX = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [authInitialized, setAuthInitialized] = useState(false);

  // Add auth state listener to maintain session on refresh
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setIsAuthenticated(!!user);
      setAuthInitialized(true);
      if (user) {
        console.log("User is signed in:", user.email);
      } else {
        console.log("No user is signed in");
      }
    });

    // Cleanup subscription on unmount
    return () => unsubscribe();
  }, []);

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
        <AppContent
          isAuthenticated={isAuthenticated}
          handleSignOut={handleSignOut}
          handleAuthenticated={handleAuthenticated}
        />
      </div>
    </Router>
  );
}

// Separate component to access the location
function AppContent({ isAuthenticated, handleSignOut, handleAuthenticated }) {
  const location = useLocation();
  const currentPath = location.pathname;

  // Only show the app header on the transcription tool page
  const shouldShowAppHeader = isAuthenticated && currentPath === "/app";

  return (
    <>
      {shouldShowAppHeader && (
        <header>
          <div className="header-logo">
            <Link to="/" className="logo-link">
              <h1>Prescripto</h1>
              <span className="tagline">Medical Transcription & Summaries</span>
            </Link>
          </div>
          <div className="auth-buttons">
            <button onClick={handleSignOut}>Sign out</button>
          </div>
        </header>
      )}

      <Routes>
        <Route
          path="/"
          element={<Home isAuthenticated={isAuthenticated} onSignOut={handleSignOut} />}
        />
        <Route
          path="/about"
          element={<About isAuthenticated={isAuthenticated} onSignOut={handleSignOut} />}
        />
        <Route
          path="/contact"
          element={<Contact isAuthenticated={isAuthenticated} onSignOut={handleSignOut} />}
        />
        <Route
          path="/services"
          element={
            isAuthenticated ? (
              <Services isAuthenticated={isAuthenticated} onSignOut={handleSignOut} />
            ) : (
              <Navigate to="/auth" replace />
            )
          }
        />
        <Route
          path="/auth"
          element={
            isAuthenticated ? (
              <Navigate to="/" replace />
            ) : (
              <Auth onAuthenticated={handleAuthenticated} />
            )
          }
        />
        <Route
          path="/app"
          element={
            isAuthenticated ? (
              <VoiceTranscription hideMainTitle={true} />
            ) : (
              <Navigate to="/auth" replace />
            )
          }
        />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </>
  );
}

export default App;
