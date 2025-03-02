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
                            Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do
                            eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut
                            enim ad minim veniam, quis nostrud exercitation ullamco laboris
                            nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in
                            reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla
                            pariatur. Excepteur sint occaecat cupidatat non proident, sunt in
                            culpa qui officia deserunt mollit anim id est laborum. Sed ut
                            perspiciatis unde omnis iste natus error sit voluptatem
                            accusantium doloremque laudantium, totam rem aperiam, eaque
                            ipsa quae ab illo inventore veritatis et quasi architecto beatae
                            vitae dicta sunt explicabo.
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
                                    <h3>Jane Doe</h3>
                                    <p>Head of Operations</p>
                                </div>
                            </div>

                            <div className="team-member">
                                <div className="member-avatar">
                                    <div className="avatar pink"></div>
                                </div>
                                <div className="member-info">
                                    <h3>John Doe</h3>
                                    <p>Technical Director</p>
                                </div>
                            </div>

                            <div className="team-member">
                                <div className="member-avatar">
                                    <div className="avatar pink"></div>
                                </div>
                                <div className="member-info">
                                    <h3>Sarah Johnson</h3>
                                    <p>Lead Designer</p>
                                </div>
                            </div>

                            <div className="team-member">
                                <div className="member-avatar">
                                    <div className="avatar blue"></div>
                                </div>
                                <div className="member-info">
                                    <h3>Mike Smith</h3>
                                    <p>Product Manager</p>
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