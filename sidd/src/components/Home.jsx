import React, { useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import "../styles/Home.css";

const Home = ({ isAuthenticated, onSignOut }) => {
  const navigate = useNavigate();

  useEffect(() => {
    // Add Spline viewer script
    const script = document.createElement("script");
    script.type = "module";
    script.src =
      "https://unpkg.com/@splinetool/viewer@1.9.72/build/spline-viewer.js";
    document.head.appendChild(script);

    return () => {
      document.head.removeChild(script);
    };
  }, []);

  const handleGetStarted = () => {
    if (isAuthenticated) {
      navigate("/app");
    } else {
      navigate("/auth");
    }
  };

  return (
    <div className="home-container">
      <nav className="home-nav">
        <div className="nav-logo">
          <Link to="/">
            <h1>Prescripto</h1>
          </Link>
        </div>
        <div className="nav-links">
          <a href="#" className="active">
            Home
          </a>
          <a href="#about">About</a>
          <Link to="/services">Services</Link>
          <a href="#contact">Contact us</a>
        </div>
        <div className="nav-button">
          {isAuthenticated ? (
            <button onClick={onSignOut} className="sign-out-btn">
              Sign out
            </button>
          ) : (
            <Link to="/auth" className="get-started-btn">
              Get started
            </Link>
          )}
        </div>
      </nav>

      <main className="home-main">
        <div className="hero-section">
          <h1 className="hero-title">Prescripto</h1>
          <h2 className="hero-tagline">
            Making healthcare <span className="highlight">accessible</span>,
            <br />
            one session at a time
          </h2>

          <p className="hero-description">
            Connect with healthcare providers seamlessly through our innovative
            digital platform. Quality care available to everyone, everywhere.
          </p>

          <div className="cta-buttons">
            <button onClick={handleGetStarted} className="primary-button">
              Get Started
            </button>
            <a href="#features" className="secondary-button">
              Learn More
            </a>
          </div>
        </div>

        <div className="hero-image-container">
          <spline-viewer url="https://prod.spline.design/tboF4fayuwmDQTvD/scene.splinecode"></spline-viewer>
        </div>
      </main>

      <section className="features-section" id="features">
        <h2 className="section-title">Why Choose Prescripto?</h2>

        <div className="features-grid">
          <div className="feature-card">
            <div className="feature-icon">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"
                />
              </svg>
            </div>
            <h3>Accurate Transcriptions</h3>
            <p>
              Our advanced AI technology provides precise medical transcriptions
              in real-time.
            </p>
          </div>

          <div className="feature-card">
            <div className="feature-icon">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"
                />
              </svg>
            </div>
            <h3>Privacy Focused</h3>
            <p>
              Your data is encrypted and secure. We comply with medical privacy
              standards.
            </p>
          </div>

          <div className="feature-card">
            <div className="feature-icon">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M13 10V3L4 14h7v7l9-11h-7z"
                />
              </svg>
            </div>
            <h3>Instant Summaries</h3>
            <p>
              Get clinical summaries instantly, saving time and improving
              patient care.
            </p>
          </div>
        </div>
      </section>

      <footer className="home-footer">
        <div className="footer-content">
          <div className="footer-logo">
            <h2>Prescripto</h2>
            <p>Making healthcare accessible, one session at a time.</p>
          </div>

          <div className="footer-links">
            <div className="footer-column">
              <h3>Company</h3>
              <a href="#about">About Us</a>
              <a href="#team">Our Team</a>
              <a href="#careers">Careers</a>
            </div>

            <div className="footer-column">
              <h3>Resources</h3>
              <a href="#blog">Blog</a>
              <a href="#help">Help Center</a>
              <a href="#faq">FAQ</a>
            </div>

            <div className="footer-column">
              <h3>Legal</h3>
              <a href="#privacy">Privacy Policy</a>
              <a href="#terms">Terms of Service</a>
              <a href="#compliance">Compliance</a>
            </div>
          </div>
        </div>

        <div className="footer-bottom">
          <p>
            &copy; {new Date().getFullYear()} Prescripto. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  );
};

export default Home;
