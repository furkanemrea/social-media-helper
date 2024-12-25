import React, { useEffect, useState } from 'react';
import { Row, Col, Spin, Empty } from 'antd';
import { PlayCircleOutlined, HeartOutlined, MessageOutlined } from '@ant-design/icons';
import { InstagramPost } from '../types/instagram.types';
import { getInstagramPosts } from '../services/instagramService';
import { convertImageToBase64 } from '../utils/imageUtils';
import InstagramPostDetail from './InstagramPostDetail';
import './InstagramProfilePosts.css';

interface PostWithBase64 extends InstagramPost {
  base64Image?: string;
}

const InstagramProfilePosts: React.FC<{ username: string }> = ({ username }) => {
  const [posts, setPosts] = useState<PostWithBase64[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedPost, setSelectedPost] = useState<PostWithBase64 | null>(null);

  const convertPostsToBase64 = async (posts: InstagramPost[]) => {
    const convertedPosts = await Promise.all(
      posts.map(async (post) => {
        try {
          const imageUrl = post.thumbnail_url || post.image_versions?.items?.[0]?.url;
          if (!imageUrl) return { ...post };

          const base64Image = await convertImageToBase64(imageUrl);
          return { ...post, base64Image };
        } catch (error) {
          console.error('Error converting image to base64:', error);
          return { ...post };
        }
      })
    );
    return convertedPosts;
  };

  useEffect(() => {
    const fetchPosts = async () => {
      if (!username) return;
      
      try {
        setLoading(true);
        const response = await getInstagramPosts(username);
        const postsWithBase64 = await convertPostsToBase64(response.data.items || []);
        setPosts(postsWithBase64.filter(post => post.code)); // Only keep posts with successful base64 conversion
      } catch (err) {
        console.error('Error fetching posts:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchPosts();
  }, [username]);

  if (loading) {
    return (
      <div className="posts-loading-container">
        <Spin size="large" />
      </div>
    );
  }

  if (!posts.length) {
    return <Empty description="No posts found" />;
  }

  return (
    <div className="profile-posts-container">
      <div className="posts-header">
        <h3>Posts</h3>
      </div>
      <Row gutter={[1, 1]} className="posts-grid">
        {posts.map((post) => (
          <Col xs={8} key={post.id}>
            <div className="post-wrapper">
              <div className="post-item" onClick={() => setSelectedPost(post)}>
                {post.base64Image && (
                  <img
                    src={post.base64Image}
                    alt={post.caption?.text || 'Instagram post'}
                    loading="lazy"
                  />
                )}
                {post.media_type === 2 && (
                  <PlayCircleOutlined className="video-indicator" />
                )}
                <div className="post-overlay">
                  <span><HeartOutlined /> {post.like_count}</span>
                  <span><MessageOutlined /> {post.comment_count}</span>
                </div>
              </div>
            </div>
          </Col>
        ))}
      </Row>

      <InstagramPostDetail
        post={selectedPost}
        visible={!!selectedPost}
        onClose={() => setSelectedPost(null)}
      />
    </div>
  );
};

export default InstagramProfilePosts; 