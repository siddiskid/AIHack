import React, { useState } from "react";
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

    const handleGoogleSignIn = async () => {
        setIsLoading(true);
        setError("");

        try {
            const result = await signInWithPopup(auth, googleProvider);
            const user = result.user;
            console.log("User signed in with Google:", user.email);
            onAuthenticated(true);
        } catch (error) {
            console.error("Google sign-in error:", error);
            setError("Failed to sign in with Google. Please try again.");
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
                        {isLogin ? "Create an account" : "Sign in instead!"}
                    </button>
                </p>

                <button
                    className="google-sign-in-button"
                    onClick={handleGoogleSignIn}
                    disabled={isLoading}
                >
                    Sign {isLogin ? "in" : "up"} with Google
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