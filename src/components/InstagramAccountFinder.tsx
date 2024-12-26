import React, { useState } from 'react';
import { Input, Card as AntCard, Spin, Row, Col, Button, Avatar, Alert } from 'antd';
import { SearchOutlined, InstagramOutlined, LinkOutlined, LockOutlined } from '@ant-design/icons';
import { fetchInstagramAccount } from '../services/instagramService';
import { convertImageToBase64 } from '../utils/imageUtils';
import InstagramPosts from './InstagramPosts';
import InstagramHighlights from './InstagramHighlights';
import './InstagramAccountFinder.css';
import { InstagramAccount } from '../types/instagram.types';
import InstagramProfilePosts from './InstagramProfilePosts';

const InstagramAccountFinder = () => {
  const [username, setUsername] = useState('');
  const [account, setAccount] = useState<InstagramAccount | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [base64Image, setBase64Image] = useState(null);

  const handleSearch = async () => {
    if (!username.trim()) return;

    setAccount(null);
    setBase64Image('');
    setError('');
    setLoading(true);

    try {
      setLoading(true);
      setError(null);
      const data = await fetchInstagramAccount(username);
      setAccount(data);
      getImageUrl(data?.profile_pic_url_hd || data?.profile_pic_url);
    } catch (err) {
      setError('Account not found');
      setAccount(null);
    } finally {
      setLoading(false);
    }
  };

  const getImageUrl =  async (url: string) => {
      const data = await convertImageToBase64(url);
      setBase64Image(data);
  }

  return (
    <div className="instagram-finder">
      <div className="search-container">
        <div className="search-header">
          <InstagramOutlined className="instagram-icon" />
          <h1 className="search-title">Instagram Profile Viewer</h1>
          <p className="search-description">
            Enter any Instagram username to view their public profile anonymously
          </p>
        </div>
        <div className="search-box">
          <label className="search-label">
            Search Instagram Account
          </label>
          <div className="search-input-group">
            <Input
              prefix={<SearchOutlined className="search-icon" />}
              placeholder="Enter Instagram username..."
              size="large"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              onPressEnter={handleSearch}
              className="search-input"
              allowClear
            />
            <Button 
              type="primary" 
              size="large" 
              onClick={handleSearch}
              className="search-button"
              icon={<SearchOutlined />}
            >
              Search
            </Button>
          </div>
        </div>
      </div>

      {error && (
        <Row justify="center">
          <Col xs={24} sm={20} md={16} lg={12}>
            <div className="error-message">{error}</div>
          </Col>
        </Row>
      )}

      {account && !loading && (
        <Row justify="center">
          <Col xs={24} sm={20} md={16} lg={12}>
            <AntCard className="profile-card">
              <div className="profile-header">
                <Avatar 
                  size={150} 
                  src={base64Image}
                  className="profile-avatar"
                />
                <div className="profile-info">
                  <div className="profile-username-container">
                    <h2>{account.username}</h2>
                    {account.isVerified && (
                      <span className="verified-badge">✓</span>
                    )}
                  </div>
                  <div className="profile-stats">
                    <div className="stat-item">
                      <div className="stat-value">{account.posts || 0}</div>
                      <div className="stat-label">posts</div>
                    </div>
                    <div className="stat-item">
                      <div className="stat-value">{account.followers || 0}</div>
                      <div className="stat-label">followers</div>
                    </div>
                    <div className="stat-item">
                      <div className="stat-value">{account.following || 0}</div>
                      <div className="stat-label">following</div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="profile-bio">
                <div className="bio-name">{account.username}</div>
                {account.category && (
                  <div className="bio-category">{account.category}</div>
                )}
                {account.bio && (
                  <div className="bio-text">
                    {account.bio.split('\n').map((line, i) => (
                      <p key={i}>{line}</p>
                    ))}
                  </div>
                )}
                {account.website && (
                  <a 
                    href={account.website} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="bio-link"
                  >
                    <LinkOutlined /> {account.website}
                  </a>
                )}
              </div>

              <InstagramProfilePosts username={account.username} />
            </AntCard>

              <div className="private-account-message">
                <Alert
                  message="Private Account"
                  description={
                    <div className="private-account-content">
                      <LockOutlined className="lock-icon" />
                      <p>This account is private. Only approved followers can see their photos and videos.</p>
                    </div>
                  }
                  type="info"
                  showIcon={false}
                />
              </div>
            
             { account.username && (
                <>
                  <InstagramProfilePosts username={account.username} />
                  <InstagramHighlights username={account.username} />
                </>
              )}
          </Col>
        </Row>
      )}
    </div>
  );
};

export default InstagramAccountFinder; 