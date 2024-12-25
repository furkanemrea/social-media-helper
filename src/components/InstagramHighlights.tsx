import React, { useEffect, useState } from 'react';
import { Row, Col, Spin } from 'antd';
import { getInstagramHighlights } from '../services/instagramService';
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

const InstagramHighlights: React.FC<{ username: string }> = ({ username }) => {
  const [loading, setLoading] = useState(true);
  const [highlights, setHighlights] = useState<HighlightItem[]>([]);

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

  if (loading) {
    return (
      <div className="highlights-loading">
        <Spin size="large" />
      </div>
    );
  }

  return (
    <div className="highlights-container">
      <Row gutter={[16, 16]} className="highlights-row">
        {highlights.map((highlight) => (
          <Col key={highlight.id}>
            <div className="highlight-item">
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
    </div>
  );
};

export default InstagramHighlights; 