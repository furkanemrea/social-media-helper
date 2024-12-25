import React, { useState, lazy, Suspense, useEffect } from 'react';
import { Row, Col, Spin, Empty, Tabs } from 'antd';
import { AppstoreOutlined, PlaySquareOutlined, BookOutlined, HeartOutlined, MessageOutlined, PlayCircleOutlined } from '@ant-design/icons';
import { InstagramPost } from '../types/instagram.types';
import { getInstagramPosts } from '../services/instagramService';
import { convertImageToBase64 } from '../utils/imageUtils';
import InstagramPostDetail from './InstagramPostDetail';
import './InstagramProfilePosts.css';

interface PostWithBase64 extends InstagramPost {
  base64Image?: string;
}

const { TabPane } = Tabs;

// Lazy load the Stories component
const InstagramStories = lazy(() => import('./InstagramStories'));

const InstagramProfilePosts: React.FC<{ username: string }> = ({ username }) => {
  const [posts, setPosts] = useState<PostWithBase64[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedPost, setSelectedPost] = useState<PostWithBase64 | null>(null);
  const [activeTab, setActiveTab] = useState('posts');
  const [loadedTabs, setLoadedTabs] = useState<Set<string>>(new Set(['posts']));

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
        setPosts(postsWithBase64.filter(post => post.code));
     } catch (err) {
        console.error('Error fetching posts:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchPosts();
  }, [username]);

  const handleTabChange = (key: string) => {
    setActiveTab(key);
    setLoadedTabs(prev => new Set(Array.from(prev).concat(key)));
  };

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
      <Tabs 
        defaultActiveKey="posts" 
        centered 
        className="profile-tabs"
        onChange={handleTabChange}
      >
        <TabPane
          tab={
            <span>
              <AppstoreOutlined />
              POSTS
            </span>
          }
          key="posts"
        >
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
        </TabPane>

        <TabPane
          tab={
            <span>
              <BookOutlined />
              STORIES
            </span>
          }
          key="stories"
        >
          <Suspense fallback={<div className="tab-loading"><Spin size="large" /></div>}>
            {loadedTabs.has('stories') && <InstagramStories username={username} />}
          </Suspense>
        </TabPane>

        <TabPane
          tab={
            <span>
              <BookOutlined />
              HIGHLIGHTS
            </span>
          }
          key="highlights"
        >
          <Empty description="No highlights available" />
        </TabPane>

        <TabPane
          tab={
            <span>
              <PlaySquareOutlined />
              REELS
            </span>
          }
          key="reels"
        >
          <Empty description="No reels available" />
        </TabPane>
      </Tabs>

      <InstagramPostDetail
        post={selectedPost}
        visible={!!selectedPost}
        onClose={() => setSelectedPost(null)}
      />
    </div>
  );
};

export default InstagramProfilePosts; 