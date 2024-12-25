import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import type { CardProps } from 'antd';
import { Card as AntCard, Input, Button, Avatar, Row, Col, Typography, Statistic, Tabs, Empty } from 'antd';
import { SearchOutlined, UserOutlined, PictureOutlined, PlayCircleOutlined, HighlightOutlined, ClockCircleOutlined } from '@ant-design/icons';
import './InstagramAccountFinder.css';

interface InstagramAccount {
  username: string;
  fullName: string;
  profilePic: string;
  followers: number;
  following: number;
  posts: number;
  bio: string;
}

const InstagramAccountFinder = () => {
  const [username, setUsername] = useState('');
  const [account, setAccount] = useState<InstagramAccount | null>(null);
  const { Search } = Input;
  const { Title, Paragraph, Text } = Typography;

  const handleSearch = (value: string) => {
    // Mock data - replace this with your actual API call
    const mockAccount: InstagramAccount = {
      username: value,
      fullName: 'Sample User',
      profilePic: 'https://via.placeholder.com/150',
      followers: 1234,
      following: 567,
      posts: 42,
      bio: 'This is a sample Instagram bio with 📸 #hashtags and @mentions'
    };
    setAccount(mockAccount);
  };

  const items = [
    {
      key: '1',
      label: (
        <span>
          <PictureOutlined />
          Posts
        </span>
      ),
      children: <Empty description="No posts available" />,
    },
    {
      key: '2',
      label: (
        <span>
          <ClockCircleOutlined />
          Stories
        </span>
      ),
      children: <Empty description="No stories available" />,
    },
    {
      key: '3',
      label: (
        <span>
          <HighlightOutlined />
          Highlights
        </span>
      ),
      children: <Empty description="No highlights available" />,
    },
    {
      key: '4',
      label: (
        <span>
          <PlayCircleOutlined />
          Reels
        </span>
      ),
      children: <Empty description="No reels available" />,
    },
  ];

  return (
    <div className="instagram-finder">
      <Row justify="center" className="search-container">
        <Col xs={20} sm={16} md={12} lg={8}>
          <Title level={2}>Instagram Account Finder</Title>
          <Search
            placeholder="Enter Instagram username"
            allowClear
            enterButton={<Button type="primary" icon={<SearchOutlined />}>Search</Button>}
            size="large"
            onSearch={handleSearch}
          />
        </Col>
      </Row>

      {account && (
        <Row justify="center" className="result-container">
          <Col xs={24} sm={20} md={16} lg={12}>
            <AntCard className="instagram-card">
              <div className="profile-header">
                <Avatar size={86} src={account.profilePic} icon={<UserOutlined />} />
                <div className="profile-info">
                  <Title level={4}>{account.username}</Title>
                  <Text strong>{account.fullName}</Text>
                </div>
              </div>

              <Row className="stats-container">
                <Col span={6}>
                  <Statistic title="Posts" value={account.posts} />
                </Col>
                <Col span={6}>
                  <Statistic title="Stories" value="0" />
                </Col>
                <Col span={6}>
                  <Statistic title="Followers" value={account.followers} />
                </Col>
                <Col span={6}>
                  <Statistic title="Following" value={account.following} />
                </Col>
              </Row>

              <div className="bio-container">
                <Paragraph>{account.bio}</Paragraph>
              </div>

              <div className="content-tabs">
                <Tabs
                  defaultActiveKey="1"
                  items={items}
                  size="large"
                  centered
                />
              </div>
            </AntCard>
          </Col>
        </Row>
      )}
    </div>
  );
};

export default InstagramAccountFinder; 