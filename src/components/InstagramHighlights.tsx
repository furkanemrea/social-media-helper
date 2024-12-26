import React, { useEffect, useState } from 'react';
import { Row, Col, Spin, Modal, Empty } from 'antd';
import { getInstagramHighlights } from '../services/instagramService';
import { convertImageToBase64 } from '../utils/imageUtils';
import './InstagramHighlights.css';
import HighlightItems from './HighlightItems';

interface HighlightItem {
  id: string;
  title: string;
  cover_media: {
    cropped_image_version: {
      url: string;
    };
  };
}

const InstagramHighlights: React.FC<{ username: string }> = ({ username }) => {
  const [loading, setLoading] = useState(true);
  const [highlights, setHighlights] = useState<HighlightItem[]>([]);
  const [selectedHighlightId, setSelectedHighlightId] = useState<string | null>(null);

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

  const handleHighlightClick = (highlightId: string) => {
    setSelectedHighlightId(highlightId);
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
      <Row gutter={[16, 16]}>
        {highlights.map((highlight) => (
          <Col xs={6} sm={4} md={3} key={highlight.id}>
            <div 
              className={`highlight-item ${selectedHighlightId === highlight.id ? 'selected' : ''}`}
              onClick={() => handleHighlightClick(highlight.id)}
            >
              {highlight.cover_media?.cropped_image_version?.url && (
                <div className="highlight-cover-wrapper">
                  <img 
                    src={highlight.cover_media.cropped_image_version.url} 
                    alt={highlight.title} 
                    className="highlight-cover"
                  />
                </div>
              )}
              <div className="highlight-title">{highlight.title}</div>
            </div>
          </Col>
        ))}
      </Row>

      {selectedHighlightId && (
        <div className="highlight-items-section">
          <HighlightItems highlightId={selectedHighlightId} />
        </div>
      )}
    </div>
  );
};

export default InstagramHighlights; 