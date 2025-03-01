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

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const app = initializeApp(firebaseConfig);
  const auth = getAuth(app);

  const handleSignUp = async () => {
    const email = prompt("Enter your email");
    const password = prompt("Enter your password");
    createUserWithEmailAndPassword(auth, email, password)
      .then((userCredential) => {
        const user = userCredential.user;
        console.log(user);
        setIsAuthenticated(true);
      })
      .catch((error) => {
        const errorCode = error.code;
        const errorMessage = error.message;
        console.log(errorCode, errorMessage);
      });
  };

  const handleSignIn = async () => {
    const email = prompt("Enter your email");
    const password = prompt("Enter your password");
    signInWithEmailAndPassword(auth, email, password)
      .then((userCredential) => {
        const user = userCredential.user;
        console.log(user);
        setIsAuthenticated(true);
      })
      .catch((error) => {
        const errorCode = error.code;
        const errorMessage = error.message;
        console.log(errorCode, errorMessage);
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
              <p>Welcome! You are signed in.</p>
            )}
          </div>
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
