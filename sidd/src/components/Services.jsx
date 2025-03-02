import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import '../styles/Services.css';

const Services = ({ isAuthenticated, onSignOut }) => {
    const navigate = useNavigate();

    const handleStartTranscribing = () => {
        navigate('/app');
    };

    const handleFindPharmacy = () => {
        navigate('/pharmacy');
    };

    return (
        <div className="services-container">
            <nav className="home-nav">
                <div className="nav-logo">
                    <Link to="/" className="logo-link">Prescripto</Link>
                </div>
                <div className="nav-links">
                    <Link to="/">Home</Link>
                    <Link to="/about">About</Link>
                    <Link to="/services" className="active">Services</Link>
                    <Link to="/contact">Contact us</Link>
                </div>
                <div className="nav-button">
                    {isAuthenticated ? (
                        <button onClick={onSignOut} className="sign-out-btn">Sign out</button>
                    ) : (
                        <Link to="/auth" className="get-started-btn">Get started</Link>
                    )}
                </div>
            </nav>

            <main className="services-main">
                <h1 className="services-title">Our Services</h1>

                <div className="services-grid">
                    <div className="service-card">
                        <h2>Find a Pharmacy</h2>
                        <p className="service-description">
                            Locate nearby pharmacies quickly and easily. Get instant access
                            to pharmacy hours, ratings, and distances. Find the most
                            convenient option for picking up your prescriptions with our
                            intelligent location-based search system.
                        </p>

                        <div className="service-features">
                            <div className="feature">
                                <div className="feature-icon">
                                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                                    </svg>
                                </div>
                                <span>Location Tracking</span>
                            </div>

                            <div className="feature">
                                <div className="feature-icon">
                                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
                                    </svg>
                                </div>
                                <span>Rating System</span>
                            </div>

                            <div className="feature">
                                <div className="feature-icon">
                                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                                    </svg>
                                </div>
                                <span>Real-time Hours</span>
                            </div>

                            <div className="feature">
                                <div className="feature-icon">
                                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7" />
                                    </svg>
                                </div>
                                <span>Distance Tracking</span>
                            </div>
                        </div>

                        <button className="service-button" onClick={handleFindPharmacy}>
                            Find a Pharmacy
                        </button>
                    </div>

                    <div className="service-card">
                        <h2>Live Medical Transcription</h2>
                        <p className="service-description">
                            AI-powered tool that live transcribes and summarizes doctor-patient
                            conversations in real time. Reduce manual documentation with our
                            advanced system that provides clear, actionable summaries to enhance
                            medical documentation.
                        </p>

                        <div className="service-features">
                            <div className="feature">
                                <div className="feature-icon">
                                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z" />
                                    </svg>
                                </div>
                                <span>Real-time Speech</span>
                            </div>

                            <div className="feature">
                                <div className="feature-icon">
                                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                                    </svg>
                                </div>
                                <span>AI Summaries</span>
                            </div>

                            <div className="feature">
                                <div className="feature-icon">
                                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5h12M9 3v2m1.048 9.5A18.022 18.022 0 016.412 9m6.088 9h7M11 21l5-10 5 10M12.751 5C11.783 10.77 8.07 15.61 3 18.129" />
                                    </svg>
                                </div>
                                <span>Live Translation</span>
                            </div>

                            <div className="feature">
                                <div className="feature-icon">
                                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                                    </svg>
                                </div>
                                <span>HIPAA Secure</span>
                            </div>
                        </div>

                        <button className="service-button" onClick={handleStartTranscribing}>
                            Start Transcribing
                        </button>
                    </div>
                </div>
            </main>
        </div>
    );
};

export default Services; 