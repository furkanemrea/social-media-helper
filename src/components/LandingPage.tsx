import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from 'antd';
import { InstagramOutlined, LockOutlined, EyeOutlined, PictureOutlined } from '@ant-design/icons';
import './LandingPage.css';

const LandingPage = () => {
  return (
    <div className="landing-container">
      <div className="hero-section">
        <div className="hero-content">
          <h1>Anonymous Instagram Viewer</h1>
          <p className="hero-subtitle">View Instagram profiles, stories, and highlights without logging in</p>
          <Link to="/finder">
            <Button type="primary" size="large" className="cta-button">
              Try Now - It's Free
            </Button>
          </Link>
        </div>
      </div>

      <div className="features-section">
        <h2>Key Features</h2>
        <div className="features-grid">
          <div className="feature-card">
            <div className="feature-icon">
              <LockOutlined />
            </div>
            <h3>100% Anonymous</h3>
            <p>View profiles without leaving any trace or requiring an Instagram account</p>
          </div>

          <div className="feature-card">
            <div className="feature-icon">
              <InstagramOutlined />
            </div>
            <h3>Profile Details</h3>
            <p>Access public profile information, follower counts, and bio details</p>
          </div>

          <div className="feature-card">
            <div className="feature-icon">
              <PictureOutlined />
            </div>
            <h3>View Posts</h3>
            <p>Browse through photos and videos from public Instagram profiles</p>
          </div>

          <div className="feature-card">
            <div className="feature-icon">
              <EyeOutlined />
            </div>
            <h3>Story Highlights</h3>
            <p>Check out story highlights without being detected</p>
          </div>
        </div>
      </div>

      <div className="how-it-works">
        <h2>How It Works</h2>
        <div className="steps-container">
          <div className="step">
            <div className="step-number">1</div>
            <h3>Enter Username</h3>
            <p>Simply type in any public Instagram username</p>
          </div>
          <div className="step">
            <div className="step-number">2</div>
            <h3>Get Results</h3>
            <p>Instantly view profile details and content</p>
          </div>
          <div className="step">
            <div className="step-number">3</div>
            <h3>Stay Anonymous</h3>
            <p>Browse freely without any tracking</p>
          </div>
        </div>
      </div>

      <div className="cta-section">
        <h2>Ready to Start?</h2>
        <p>Experience Instagram viewing without limitations</p>
        <Link to="/finder">
          <Button type="primary" size="large" className="cta-button">
            Start Browsing Now
          </Button>
        </Link>
      </div>
    </div>
  );
};

export default LandingPage; 