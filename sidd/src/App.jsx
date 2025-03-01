import { useState } from "react";
import reactLogo from "./assets/react.svg";
import viteLogo from "/vite.svg";
import "./App.css";
import { initializeApp } from "firebase/app";
import {
  getAuth,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
} from "firebase/auth";

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
  const [count, setCount] = useState(0);

  // Initialize Firebase
  const app = initializeApp(firebaseConfig);
  const auth = getAuth(app);

  const handleSignUp = async () => {
    const email = prompt("Enter your email");
    const password = prompt("Enter your password");
    createUserWithEmailAndPassword(auth, email, password)
      .then((userCredential) => {
        const user = userCredential.user;
        console.log(user);
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
      })
      .catch((error) => {
        const errorCode = error.code;
        const errorMessage = error.message;
        console.log(errorCode, errorMessage);
      });
  };

  return (
    <>
      <div>
        <a href="https://vitejs.dev" target="_blank">
          <img src={viteLogo} className="logo" alt="Vite logo" />
        </a>
        <a href="https://react.dev" target="_blank">
          <img src={reactLogo} className="logo react" alt="React logo" />
        </a>
      </div>
      <h1>Vite + React</h1>
      <div className="card">
        <button onClick={() => setCount((count) => count + 1)}>
          count is {count}
        </button>
        <button onClick={() => handleSignUp()}>Sign up</button>
        <button onClick={() => handleSignIn()}>Sign in</button>
        <p>
          Edit <code>src/App.jsx</code> and save to test HMR
        </p>
      </div>
      <p className="read-the-docs">
        Click on the Vite and React logos to learn more
      </p>
    </>
  );
}

export default App;
