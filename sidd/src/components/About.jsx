import React from 'react';
import { Link } from 'react-router-dom';
import '../styles/About.css';

const About = ({ isAuthenticated, onSignOut }) => {
    return (
        <div className="about-container">
            <nav className="home-nav">
                <div className="nav-logo">
                    <Link to="/">
                        <h1>Prescripto</h1>
                    </Link>
                </div>
                <div className="nav-links">
                    <Link to="/">Home</Link>
                    <Link to="/about" className="active">About</Link>
                    <Link to="/services">Services</Link>
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

            <main className="about-main">
                <div className="about-content">
                    <div className="about-us-section">
                        <h1>About Us</h1>
                        <p className="about-description">
                            We're revolutionizing healthcare accessibility through
                            innovative digital solutions. Our platform connects
                            patients with healthcare providers seamlessly, making
                            quality care available to everyone, everywhere.
                        </p>

                        <h2>What We Do</h2>
                        <p className="about-description">
                            At Prescripto, we're developing a groundbreaking healthcare platform that brings together advanced AI
                            technology and user-friendly web design to transform the medical consultation experience. Our system
                            provides real-time medical transcription during consultations, generates comprehensive clinical summaries,
                            and includes features like pharmacy location services to enhance patient access to care.
                        </p>
                        <p className="about-description">
                            Our mission is to reduce administrative burden for healthcare providers while improving the
                            accuracy of medical documentation. By leveraging state-of-the-art natural language processing and
                            a seamless user interface, we're creating a solution that makes healthcare more efficient, accessible,
                            and engaging for both providers and patients.
                        </p>
                    </div>

                    <div className="team-section">
                        <h1>Our Team</h1>
                        <div className="team-grid">
                            <div className="team-member">
                                <div className="member-avatar">
                                    <div className="avatar blue"></div>
                                </div>
                                <div className="member-info">
                                    <h3>Swapnil Dubey</h3>
                                    <p>AI and Web Dev</p>
                                </div>
                            </div>

                            <div className="team-member">
                                <div className="member-avatar">
                                    <div className="avatar pink"></div>
                                </div>
                                <div className="member-info">
                                    <h3>Siddarth Chilukuri</h3>
                                    <p>Web Dev and Design</p>
                                </div>
                            </div>

                            <div className="team-member">
                                <div className="member-avatar">
                                    <div className="avatar pink"></div>
                                </div>
                                <div className="member-info">
                                    <h3>Jennifer Lang</h3>
                                    <p>AI and Web Dev</p>
                                </div>
                            </div>

                            <div className="team-member">
                                <div className="member-avatar">
                                    <div className="avatar blue"></div>
                                </div>
                                <div className="member-info">
                                    <h3>Pearl Dhingra</h3>
                                    <p>Web Dev and Design</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
};

export default About; 