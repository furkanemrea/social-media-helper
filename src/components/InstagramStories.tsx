import React, { useEffect, useState } from 'react';
import { Empty, Spin, Row, Col, Modal } from 'antd';
import { PlayCircleOutlined } from '@ant-design/icons';
import { getInstagramStories } from '../services/instagramService';
import { convertImageToBase64 } from '../utils/imageUtils';
import './InstagramStories.css';

interface StoryItem {
  id: string;
  media_type: number; // 1 for image, 2 for video
  image_versions?: {
    items: Array<{
      url: string;
      width: number;
      height: number;
    }>;
  };
  video_versions?: Array<{
    url: string;
    width: number;
    height: number;
  }>;
  thumbnail_url?: string;
  taken_at_date: string;
  base64Image?: string;
}

const InstagramStories: React.FC<{ username: string }> = ({ username }) => {
  const [loading, setLoading] = useState(true);
  const [stories, setStories] = useState<StoryItem[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [selectedStory, setSelectedStory] = useState<StoryItem | null>(null);

  useEffect(() => {
    const fetchStories = async () => {
      try {
        setLoading(true);
        setError(null);
        const response = await getInstagramStories(username);
        
        if (response.data?.items) {
          const storiesWithBase64 = await Promise.all(
            response.data.items.map(async (story: StoryItem) => {
              const imageUrl = story.thumbnail_url || 
                             story.image_versions?.items[0]?.url;
              
              if (imageUrl) {
                try {
                  const base64Image = await convertImageToBase64(imageUrl);
                  return { ...story, base64Image };
                } catch (err) {
                  console.error('Error converting story image:', err);
                }
              }
              return story;
            })
          );
          setStories(storiesWithBase64);
        }
      } catch (err) {
        console.error('Error fetching stories:', err);
        setError('Failed to load stories');
      } finally {
        setLoading(false);
      }
    };

    fetchStories();
  }, [username]);

  if (loading) {
    return (
      <div className="stories-loading">
        <Spin size="large" />
      </div>
    );
  }

  if (error || !stories.length) {
    return <Empty description="No stories available" />;
  }

  const handleStoryClick = (story: StoryItem) => {
    setSelectedStory(story);
  };

  const handleModalClose = () => {
    setSelectedStory(null);
  };

  return (
    <div className="stories-container">
      <Row gutter={[16, 16]} className="stories-grid">
        {stories.map((story) => (
          <Col span={8} key={story.id}>
            <div 
              className="story-item" 
              onClick={() => handleStoryClick(story)}
              style={{ cursor: 'pointer' }}
            >
              {story.base64Image && (
                <>
                  <img 
                    src={story.base64Image} 
                    alt="Story" 
                    className="story-image"
                  />
                  {story.media_type === 2 && (
                    <PlayCircleOutlined className="video-indicator" />
                  )}
                  <div className="story-timestamp">
                    {new Date(story.taken_at_date).toLocaleTimeString([], {
                      hour: '2-digit',
                      minute: '2-digit'
                    })}
                  </div>
                </>
              )}
            </div>
          </Col>
        ))}
      </Row>

      <Modal
        open={selectedStory !== null}
        onCancel={handleModalClose}
        onClose={handleModalClose}
        footer={null}
        width="80%"
        centered
      >
        {selectedStory?.media_type === 2 ? (
          <video
            controls
            style={{ width: '100%' }}
            src={selectedStory.video_versions?.[0]?.url}
          />
        ) : (
          <img
            src={selectedStory?.base64Image}
            alt="Story"
            style={{ width: '100%' }}
          />
        )}
      </Modal>
    </div>
  );
};

export default InstagramStories; 