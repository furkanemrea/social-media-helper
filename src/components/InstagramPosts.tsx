import React, { useEffect, useState } from 'react';
import { Row, Col, Card, Spin, Avatar } from 'antd';
import { PlayCircleOutlined, HeartOutlined, MessageOutlined } from '@ant-design/icons';
import { InstagramPost } from '../types/instagram.types';
import { getInstagramPosts } from '../services/instagramService';
import './InstagramPosts.css';

const InstagramPosts: React.FC<{ username: string }> = ({ username }) => {
  const [posts, setPosts] = useState<InstagramPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        setLoading(true);
        const response = await getInstagramPosts(username);
        setPosts(response.data.items);
      } catch (err) {
        setError('Failed to fetch Instagram posts');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    if (username) {
      fetchPosts();
    }
  }, [username]);

  if (loading) return <Spin size="large" className="posts-loader" />;
  if (error) return <div className="error-message">{error}</div>;

  return (
    <Row gutter={[16, 16]} className="posts-grid">
      {posts.map((post) => (
        <Col xs={24} sm={12} md={8} lg={6} key={post.id}>
          <Card 
            hoverable 
            className="post-card"
            cover={
              <div className="post-media">
                {post.media_type === 2 ? ( // Video
                  <>
                    <img 
                      alt={post.caption?.text || 'Instagram post'} 
                      src={post.thumbnail_url} 
                    />
                    <PlayCircleOutlined className="play-icon" />
                  </>
                ) : ( // Image
                  <img 
                    alt={post.caption?.text || 'Instagram post'} 
                    src={post.image_versions?.items[0]?.url || post.thumbnail_url} 
                  />
                )}
              </div>
            }
          >
            <div className="post-info">
              <div className="post-header">
                <Avatar src={post.caption?.user?.profile_pic_url} size="small" />
                <span className="username">{post.caption?.user?.username}</span>
              </div>
              <div className="post-stats">
                <span>
                  <HeartOutlined /> {post.like_count.toLocaleString()}
                </span>
                <span>
                  <MessageOutlined /> {post.comment_count.toLocaleString()}
                </span>
                {post.play_count && (
                  <span>
                    <PlayCircleOutlined /> {post.play_count.toLocaleString()}
                  </span>
                )}
              </div>
              <div className="post-caption">
                {post.caption?.text.length > 100 
                  ? `${post.caption.text.substring(0, 100)}...` 
                  : post.caption?.text}
              </div>
            </div>
          </Card>
        </Col>
      ))}
    </Row>
  );
};

export default InstagramPosts; 