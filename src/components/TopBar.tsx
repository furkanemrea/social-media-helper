import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { InstagramOutlined, HomeOutlined, SearchOutlined } from '@ant-design/icons';
import './TopBar.css';

const TopBar = () => {
  const location = useLocation();

  return (
    <div className="topbar">
      <div className="topbar-content">
        <Link to="/" className="logo-section">
          <InstagramOutlined className="logo-icon" />
          <span className="logo-text">InstaViewer</span>
        </Link>

        <nav className="nav-links">
          <Link 
            to="/" 
            className={`nav-link ${location.pathname === '/' ? 'active' : ''}`}
          >
            <HomeOutlined />
            <span>Home</span>
          </Link>
          <Link 
            to="/finder" 
            className={`nav-link ${location.pathname === '/finder' ? 'active' : ''}`}
          >
            <SearchOutlined />
            <span>Search</span>
          </Link>
        </nav>
      </div>
    </div>
  );
};

export default TopBar; 