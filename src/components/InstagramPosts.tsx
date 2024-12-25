import React, { useEffect, useState } from 'react';
import { Row, Col, Modal, Spin } from 'antd';
import { PlayCircleOutlined } from '@ant-design/icons';
import { convertImageToBase64 } from '../utils/imageUtils';

interface PostItem {
  id: string;
  media_type: number;
  thumbnail_url?: string;
  video_versions?: Array<{
    url: string;
    width: number;
    height: number;
  }>;
  image_versions: {
    items: Array<{
      url: string;
      width: number;
      height: number;
    }>;
  };
  base64Image?: string;
}

const InstagramPosts: React.FC<{ posts: PostItem[] }> = ({ posts }) => {
  const [processedPosts, setProcessedPosts] = useState<PostItem[]>([]);
  const [selectedPost, setSelectedPost] = useState<PostItem | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const processPosts = async () => {
      try {
        setLoading(true);
        const postsWithBase64 = await Promise.all(
          posts.map(async (post) => {
            const imageUrl = post.thumbnail_url || post.image_versions.items[0]?.url;
            if (imageUrl) {
              try {
                const base64Image = await convertImageToBase64(imageUrl);
                return { ...post, base64Image };
              } catch (err) {
                console.error('Error converting post image:', err);
                return post;
              }
            }
            return post;
          })
        );
        setProcessedPosts(postsWithBase64);
      } catch (error) {
        console.error('Error processing posts:', error);
      } finally {
        setLoading(false);
      }
    };

    processPosts();
  }, [posts]);

  const handlePostClick = (post: PostItem) => {
    setSelectedPost(post);
  };

  const handleModalClose = () => {
    setSelectedPost(null);
  };

  if (loading) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', padding: '20px' }}>
        <Spin size="large" />
      </div>
    );
  }

  return (
    <div className="posts-container">
      <Row gutter={[8, 8]}>
        {processedPosts.map((post) => (
          <Col span={8} key={post.id}>
            <div 
              className="post-item" 
              onClick={() => handlePostClick(post)}
            >
              {post.base64Image && (
                <>
                  <img 
                    src={post.base64Image}
                    alt="Post"
                    className="post-thumbnail"
                  />
                  {post.media_type === 2 && (
                    <PlayCircleOutlined className="video-indicator" />
                  )}
                </>
              )}
            </div>
          </Col>
        ))}
      </Row>

      <Modal
        open={selectedPost !== null}
        onCancel={handleModalClose}
        footer={null}
        width={800}
        centered
        className="post-modal"
      >
        {selectedPost && (
          <div className="modal-content">
            {selectedPost.media_type === 2 ? (
              <div className="video-wrapper">
                <video
                  key={selectedPost.id}
                  controls
                  autoPlay
                  playsInline
                  className="modal-video"
                  src={selectedPost.video_versions?.[0]?.url}
                >
                  Your browser does not support the video tag.
                </video>
              </div>
            ) : (
              <img
                src={selectedPost.base64Image}
                alt="Post"
                className="modal-image"
              />
            )}
          </div>
        )}
      </Modal>
    </div>
  );
};

export default InstagramPosts; 