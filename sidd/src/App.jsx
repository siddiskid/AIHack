import { useState } from "react";
import "./App.css";
import { initializeApp } from "firebase/app";
import {
  getAuth,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
} from "firebase/auth";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import VoiceTranscription from "./components/VoiceTranscription";

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
  const [error, setError] = useState("");
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

  const handleSignUp = async () => {
    try {
      const email = prompt("Enter your email");
      const emailError = validateEmail(email);
      if (emailError) {
        alert(emailError);
        return;
      }

      const password = prompt("Enter your password (minimum 6 characters)");
      const passwordError = validatePassword(password);
      if (passwordError) {
        alert(passwordError);
        return;
      }

      const userCredential = await createUserWithEmailAndPassword(
        auth,
        email,
        password
      );
      const user = userCredential.user;
      console.log("User signed up:", user.email);
      setIsAuthenticated(true);
      setError("");
    } catch (error) {
      console.error("Sign up error:", error);
      let errorMessage = "An error occurred during sign up";

      switch (error.code) {
        case "auth/email-already-in-use":
          errorMessage =
            "This email is already registered. Please sign in instead.";
          break;
        case "auth/invalid-email":
          errorMessage = "Please enter a valid email address.";
          break;
        case "auth/operation-not-allowed":
          errorMessage =
            "Email/password accounts are not enabled. Please contact support.";
          break;
        case "auth/weak-password":
          errorMessage = "Please choose a stronger password.";
          break;
        default:
          errorMessage = error.message;
      }

      setError(errorMessage);
      alert(errorMessage);
    }
  };

  const handleSignIn = async () => {
    try {
      const email = prompt("Enter your email");
      const emailError = validateEmail(email);
      if (emailError) {
        alert(emailError);
        return;
      }

      const password = prompt("Enter your password");
      const passwordError = validatePassword(password);
      if (passwordError) {
        alert(passwordError);
        return;
      }

      const userCredential = await signInWithEmailAndPassword(
        auth,
        email,
        password
      );
      const user = userCredential.user;
      console.log("User signed in:", user.email);
      setIsAuthenticated(true);
      setError("");
    } catch (error) {
      console.error("Sign in error:", error);
      let errorMessage = "An error occurred during sign in";

      switch (error.code) {
        case "auth/invalid-email":
          errorMessage = "Please enter a valid email address.";
          break;
        case "auth/user-disabled":
          errorMessage =
            "This account has been disabled. Please contact support.";
          break;
        case "auth/user-not-found":
          errorMessage =
            "No account found with this email. Please sign up first.";
          break;
        case "auth/wrong-password":
          errorMessage = "Incorrect password. Please try again.";
          break;
        default:
          errorMessage = error.message;
      }

      setError(errorMessage);
      alert(errorMessage);
    }
  };

  const handleSignOut = () => {
    auth.signOut().then(() => {
      setIsAuthenticated(false);
      setError("");
      console.log("User signed out");
    });
  };

  return (
    <Router>
      <div className="app-container">
        <header>
          <h1>Voice Transcription App</h1>
          <div className="auth-buttons">
            {!isAuthenticated ? (
              <>
                <button onClick={handleSignUp}>Sign up</button>
                <button onClick={handleSignIn}>Sign in</button>
              </>
            ) : (
              <>
                <p>Welcome! You are signed in.</p>
                <button onClick={handleSignOut}>Sign out</button>
              </>
            )}
          </div>
          {error && <div className="error-message">{error}</div>}
        </header>

        <Routes>
          <Route
            path="/"
            element={
              isAuthenticated ? (
                <VoiceTranscription />
              ) : (
                <div className="auth-message">
                  <p>Please sign in to use the voice transcription feature.</p>
                </div>
              )
            }
          />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
