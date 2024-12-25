import React, { useState } from 'react';
import { Input, Row, Col, Card as AntCard, Avatar, Button } from 'antd';
import { SearchOutlined, LinkOutlined } from '@ant-design/icons';
import { InstagramAccount } from '../types/instagram.types';
import { fetchInstagramAccount } from '../services/instagramService';
import InstagramProfilePosts from './InstagramProfilePosts';
import './InstagramAccountFinder.css';

const InstagramAccountFinder = () => {
  const [username, setUsername] = useState('');
  const [account, setAccount] = useState<InstagramAccount | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSearch = async () => {
    if (!username.trim()) return;

    try {
      setLoading(true);
      setError(null);
      const data = await fetchInstagramAccount(username);
      setAccount(data);
    } catch (err) {
      setError('Account not found');
      setAccount(null);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="instagram-finder">
      <Row justify="center" className="search-container">
        <Col xs={24} sm={20} md={16} lg={12}>
          <Input
            size="large"
            placeholder="Enter Instagram username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            onPressEnter={handleSearch}
            prefix={<SearchOutlined />}
          />
        </Col>
      </Row>

      {error && (
        <Row justify="center">
          <Col xs={24} sm={20} md={16} lg={12}>
            <div className="error-message">{error}</div>
          </Col>
        </Row>
      )}

      {account && (
        <Row justify="center">
          <Col xs={24} sm={20} md={16} lg={12}>
            <AntCard className="profile-card">
              <div className="profile-header">
                <Avatar 
                  size={150} 
                  src={account.profile_pic_url_hd || account.profile_pic_url}
                  className="profile-avatar"
                />
                <div className="profile-info">
                  <div className="profile-username">
                    <h2>{account.username}</h2>
                    {account.isVerified && (
                      <span className="verified-badge">✓</span>
                    )}
                  </div>
                  <div className="profile-stats">
                    <div className="stat-item">
                      <span className="stat-value">{account.posts || 0}</span>
                      <span className="stat-label">posts</span>
                    </div>
                    <div className="stat-item">
                      <span className="stat-value">{account.followers || 0}</span>
                      <span className="stat-label">followers</span>
                    </div>
                    <div className="stat-item">
                      <span className="stat-value">{account.following || 0}</span>
                      <span className="stat-label">following</span>
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
          </Col>
        </Row>
      )}
    </div>
  );
};

export default InstagramAccountFinder; 