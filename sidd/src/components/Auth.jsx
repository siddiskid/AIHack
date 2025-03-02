import React, { useState, useEffect } from "react";
import { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword, GoogleAuthProvider, signInWithPopup } from "firebase/auth";
import "../styles/Auth.css";

const EMAIL_REGEX = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

const Auth = ({ onAuthenticated }) => {
    const [isLogin, setIsLogin] = useState(false);
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const [agreeToTerms, setAgreeToTerms] = useState(false);
    const [isLoading, setIsLoading] = useState(false);

    const auth = getAuth();
    const googleProvider = new GoogleAuthProvider();

    // Clear any errors when switching between login and signup
    useEffect(() => {
        setError("");
    }, [isLogin]);

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

    const handleSignUp = async (e) => {
        e.preventDefault();
        setIsLoading(true);
        setError("");

        // Validate inputs
        const emailError = validateEmail(email);
        if (emailError) {
            setError(emailError);
            setIsLoading(false);
            return;
        }

        const passwordError = validatePassword(password);
        if (passwordError) {
            setError(passwordError);
            setIsLoading(false);
            return;
        }

        if (!agreeToTerms) {
            setError("You must agree to the Terms of Service and Privacy Policy");
            setIsLoading(false);
            return;
        }

        try {
            const userCredential = await createUserWithEmailAndPassword(
                auth,
                email,
                password
            );
            const user = userCredential.user;
            console.log("User signed up:", user.email);
            onAuthenticated(true);
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
        } finally {
            setIsLoading(false);
        }
    };

    const handleSignIn = async (e) => {
        e.preventDefault();
        setIsLoading(true);
        setError("");

        // Validate inputs
        const emailError = validateEmail(email);
        if (emailError) {
            setError(emailError);
            setIsLoading(false);
            return;
        }

        const passwordError = validatePassword(password);
        if (passwordError) {
            setError(passwordError);
            setIsLoading(false);
            return;
        }

        try {
            const userCredential = await signInWithEmailAndPassword(
                auth,
                email,
                password
            );
            const user = userCredential.user;
            console.log("User signed in:", user.email);
            onAuthenticated(true);
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
        } finally {
            setIsLoading(false);
        }
    };

    const handleGoogleSignIn = async (e) => {
        e.preventDefault(); // Prevent default form submission behavior
        console.log("Google Sign In button clicked");
        setIsLoading(true);
        setError("");

        try {
            googleProvider.setCustomParameters({
                prompt: 'select_account'
            });

            console.log("Attempting to sign in with Google...");
            const result = await signInWithPopup(auth, googleProvider);
            const user = result.user;
            console.log("User signed in with Google successfully:", user.email);
            onAuthenticated(true);
        } catch (error) {
            console.error("Google sign-in error details:", error.code, error.message);
            let errorMessage = "Failed to sign in with Google. ";

            switch (error.code) {
                case 'auth/popup-closed-by-user':
                    errorMessage += "The sign-in popup was closed before completing the sign-in.";
                    break;
                case 'auth/popup-blocked':
                    errorMessage += "The sign-in popup was blocked by your browser. Please allow popups for this site.";
                    break;
                case 'auth/cancelled-popup-request':
                    errorMessage += "The sign-in was cancelled.";
                    break;
                case 'auth/network-request-failed':
                    errorMessage += "A network error occurred. Please check your internet connection.";
                    break;
                default:
                    errorMessage += error.message || "Please try again.";
            }

            setError(errorMessage);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="auth-container">
            <div className="auth-form-container">
                <h1>{isLogin ? "Sign in to your account" : "Create your account"}</h1>
                <p className="auth-switch-text">
                    {isLogin ? "New to the platform? " : "Already have an account? "}
                    <button
                        className="text-link"
                        onClick={() => setIsLogin(!isLogin)}
                    >
                        {isLogin ? "Create an account" : "Sign in instead"}
                    </button>
                </p>

                <button
                    className="google-sign-in-button"
                    onClick={handleGoogleSignIn}
                    disabled={isLoading}
                    type="button"
                >
                    <div className="google-btn-content">
                        <svg className="google-icon" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 48 48">
                            <path fill="#FFC107" d="M43.611,20.083H42V20H24v8h11.303c-1.649,4.657-6.08,8-11.303,8c-6.627,0-12-5.373-12-12c0-6.627,5.373-12,12-12c3.059,0,5.842,1.154,7.961,3.039l5.657-5.657C34.046,6.053,29.268,4,24,4C12.955,4,4,12.955,4,24c0,11.045,8.955,20,20,20c11.045,0,20-8.955,20-20C44,22.659,43.862,21.35,43.611,20.083z" />
                            <path fill="#FF3D00" d="M6.306,14.691l6.571,4.819C14.655,15.108,18.961,12,24,12c3.059,0,5.842,1.154,7.961,3.039l5.657-5.657C34.046,6.053,29.268,4,24,4C16.318,4,9.656,8.337,6.306,14.691z" />
                            <path fill="#4CAF50" d="M24,44c5.166,0,9.86-1.977,13.409-5.192l-6.19-5.238C29.211,35.091,26.715,36,24,36c-5.202,0-9.619-3.317-11.283-7.946l-6.522,5.025C9.505,39.556,16.227,44,24,44z" />
                            <path fill="#1976D2" d="M43.611,20.083H42V20H24v8h11.303c-0.792,2.237-2.231,4.166-4.087,5.571c0.001-0.001,0.002-0.001,0.003-0.002l6.19,5.238C36.971,39.205,44,34,44,24C44,22.659,43.862,21.35,43.611,20.083z" />
                        </svg>
                        <span>Sign {isLogin ? "in" : "up"} with Google</span>
                    </div>
                </button>

                <div className="divider">
                    <span className="divider-line"></span>
                    <span className="divider-text">OR</span>
                    <span className="divider-line"></span>
                </div>

                <p className="form-header">
                    Enter your email below to {isLogin ? "sign in to" : "create"} your account
                </p>

                {error && <div className="error-message">{error}</div>}

                <form onSubmit={isLogin ? handleSignIn : handleSignUp}>
                    <div className="form-group">
                        <input
                            type="email"
                            placeholder="name@example.com"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                        />
                    </div>

                    <div className="form-group">
                        <input
                            type="password"
                            placeholder="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                        />
                    </div>

                    {!isLogin && (
                        <div className="form-group checkbox-group">
                            <input
                                type="checkbox"
                                id="terms"
                                checked={agreeToTerms}
                                onChange={(e) => setAgreeToTerms(e.target.checked)}
                                required
                            />
                            <label htmlFor="terms">
                                Agree to our <a href="/terms" className="policy-link">Terms of Service</a> and{" "}
                                <a href="/privacy" className="policy-link">Privacy Policy</a>
                            </label>
                        </div>
                    )}

                    <button
                        type="submit"
                        className="auth-submit-button"
                        disabled={isLoading}
                    >
                        {isLoading ? "Loading..." : isLogin ? "Sign in" : "Sign up"}
                    </button>
                </form>
            </div>
        </div>
    );
};

export default Auth; 