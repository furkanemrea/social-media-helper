import React from 'react';
import { Link } from 'react-router-dom';

const LandingPage = () => {
  return (
    <div className="landing-page">
      <h1>Welcome to Instagram Account Finder</h1>
      <p>Find and analyze Instagram accounts with ease</p>
      <Link to="/finder" className="cta-button">
        Get Started
      </Link>
    </div>
  );
};

export default LandingPage; 