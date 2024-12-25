import React, { useEffect, useState } from 'react';
import { Row, Col, Spin, Modal, Empty } from 'antd';
import { getInstagramHighlights } from '../services/instagramService';
import { convertImageToBase64 } from '../utils/imageUtils';
import './InstagramHighlights.css';

interface HighlightItem {
  id: string;
  title: string;
  cover_media: {
    cropped_image_version: {
      url: string;
    };
  };
  media_count: number;
}

interface StoryItem {
  id: string;
  media_type: number;
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

const InstagramHighlights: React.FC<{ username: string }> = ({ username }) => {
  const [loading, setLoading] = useState(true);
  const [highlights, setHighlights] = useState<HighlightItem[]>([]);
  const [selectedHighlight, setSelectedHighlight] = useState<string | null>(null);
  const [stories, setStories] = useState<StoryItem[]>([]);
  const [currentStoryIndex, setCurrentStoryIndex] = useState(0);

  useEffect(() => {
    const fetchHighlights = async () => {
      try {
        setLoading(true);
        const response = await getInstagramHighlights(username);
        if (response.data?.items) {
          setHighlights(response.data.items);
        }
      } catch (error) {
        console.error('Error fetching highlights:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchHighlights();
  }, [username]);

  useEffect(() => {
    const loadHighlightStories = async () => {
      if (!selectedHighlight) return;

      try {
        setLoading(true);
        const response = await getInstagramHighlights(selectedHighlight);
        
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
      } catch (error) {
        console.error('Error loading highlight stories:', error);
      } finally {
        setLoading(false);
      }
    };

    loadHighlightStories();
  }, [selectedHighlight]);

  const handleHighlightClick = (highlightId: string) => {
    setSelectedHighlight(highlightId);
    setCurrentStoryIndex(0);
  };    

  const handleModalClose = () => {
    setSelectedHighlight(null);
    setStories([]);
    setCurrentStoryIndex(0);
  };

  const handleNextStory = () => {
    if (currentStoryIndex < stories.length - 1) {
      setCurrentStoryIndex(prev => prev + 1);
    } else {
      handleModalClose();
    }
  };

  const handlePrevStory = () => {
    if (currentStoryIndex > 0) {
      setCurrentStoryIndex(prev => prev - 1);
    }
  };

  if (loading) {
    return (
      <div className="highlights-loading">
        <Spin size="large" />
      </div>
    );
  }

  if (!highlights.length) {
    return <Empty description="No highlights found" />;
  }

  return (
    <div className="highlights-container">
      <Row gutter={[16, 16]} className="highlights-row">
        {highlights.map((highlight) => (
          <Col key={highlight.id}>
            <div 
              className="highlight-item"
              onClick={() => handleHighlightClick(highlight.id)}
            >
              <div className="highlight-circle">
                <img
                  src={highlight.cover_media.cropped_image_version.url}
                  alt={highlight.title}
                  className="highlight-cover"
                />
              </div>
              <div className="highlight-title">{highlight.title}</div>
            </div>
          </Col>
        ))}
      </Row>

      <Modal
        open={selectedHighlight !== null}
        onCancel={handleModalClose}
        footer={null}
        width="auto"
        centered
        className="highlight-story-modal"
      >
        {loading ? (
          <div className="story-loading">
            <Spin size="large" />
          </div>
        ) : (
          stories[currentStoryIndex] && (
            <div className="story-viewer">
              <div 
                className="story-prev" 
                onClick={handlePrevStory}
                style={{ visibility: currentStoryIndex > 0 ? 'visible' : 'hidden' }}
              />
              <div 
                className="story-next" 
                onClick={handleNextStory}
              />
              {stories[currentStoryIndex].media_type === 2 ? (
                <video
                  controls
                  autoPlay
                  className="story-media"
                  src={stories[currentStoryIndex].video_versions?.[0]?.url}
                />
              ) : (
                <img
                  src={stories[currentStoryIndex].base64Image}
                  alt="Story"
                  className="story-media"
                />
              )}
            </div>
          )
        )}
      </Modal>
    </div>
  );
};

export default InstagramHighlights; 