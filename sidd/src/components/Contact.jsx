import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import '../styles/Contact.css';

const Contact = ({ isAuthenticated, onSignOut }) => {
    const [isSubmitted, setIsSubmitted] = useState(false);

    const handleSubmit = (e) => {
        e.preventDefault();
        setIsSubmitted(true);
    };

    const handleClose = () => {
        setIsSubmitted(false);
    };

    return (
        <div className="contact-container">
            <nav className="home-nav">
                <div className="nav-logo">
                    <Link to="/">
                        <h1>Prescripto</h1>
                    </Link>
                </div>
                <div className="nav-links">
                    <Link to="/">Home</Link>
                    <Link to="/about">About</Link>
                    <Link to="/services">Services</Link>
                    <Link to="/contact" className="active">Contact us</Link>
                </div>
                <div className="nav-button">
                    {isAuthenticated ? (
                        <button className="sign-out-btn" onClick={onSignOut}>Sign out</button>
                    ) : (
                        <Link to="/auth" className="get-started-btn">Get started</Link>
                    )}
                </div>
            </nav>

            {!isSubmitted ? (
                <div className="contact-main">
                    <h1>Contact Us</h1>
                    <p className="contact-intro">
                        Have questions or feedback? We'd love to hear from you. Fill out the form below and our team will get back to you as soon as possible.
                    </p>

                    <div className="contact-form-container">
                        <form className="contact-form" onSubmit={handleSubmit}>
                            <div className="form-group">
                                <label htmlFor="name">Name</label>
                                <input
                                    type="text"
                                    id="name"
                                    className="form-input"
                                    placeholder="Enter your name"
                                    required
                                />
                            </div>
                            <div className="form-group">
                                <label htmlFor="email">Email</label>
                                <input
                                    type="email"
                                    id="email"
                                    className="form-input"
                                    placeholder="Enter your email address"
                                    required
                                />
                            </div>
                            <div className="form-group">
                                <label htmlFor="message">Message</label>
                                <textarea
                                    id="message"
                                    className="form-input"
                                    rows="4"
                                    placeholder="Enter your message"
                                    required
                                ></textarea>
                            </div>
                            <button type="submit" className="send-message-btn">
                                Send Message
                            </button>
                        </form>
                    </div>
                </div>
            ) : (
                <div className="success-container">
                    <div className="success-modal">
                        <div className="success-icon">
                            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="24" height="24">
                                <path fill="#4666e5" d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41L9 16.17z"></path>
                            </svg>
                        </div>
                        <h2>Thank You for Reaching Out!</h2>
                        <p>
                            Your message has been successfully received. We'll review your inquiry and get back to you as soon as possible.
                        </p>
                        <button className="close-btn" onClick={handleClose}>
                            Close
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Contact; 