import React, { useEffect, useState } from 'react';
import { Row, Col, Spin, Empty, Modal } from 'antd';
import { PlayCircleOutlined } from '@ant-design/icons';
import { getHighlightInfo } from '../services/instagramService';
import { convertImageToBase64 } from '../utils/imageUtils';
import './HighlightItems.css';

interface HighlightItemProps {
  highlightId: string;
}

interface HighlightStory {
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
  }>;
  base64Image?: string;
}

const HighlightItems: React.FC<HighlightItemProps> = ({ highlightId }) => {
  const [loading, setLoading] = useState(true);
  const [items, setItems] = useState<HighlightStory[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [selectedItem, setSelectedItem] = useState<HighlightStory | null>(null);
  const [modalVisible, setModalVisible] = useState(false);

  useEffect(() => {
    const fetchHighlightItems = async () => {
      try {
        setLoading(true);
        setError(null);
        
        const response = await getHighlightInfo(highlightId);
        
        if (response.data?.items) {
          const processedItems = await Promise.all(
            response.data.items.map(async (item: HighlightStory) => {
              if (item.image_versions?.items[0]?.url) {
                try {
                  const base64Image = await convertImageToBase64(item.image_versions.items[0].url);
                  return { ...item, base64Image };
                } catch (error) {
                  console.error('Error converting image:', error);
                  return item;
                }
              }
              return item;
            })
          );
          setItems(processedItems);
        }
      } catch (err) {
        setError('Failed to load highlight items');
        console.error('Error fetching highlight items:', err);
      } finally {
        setLoading(false);
      }
    };

    if (highlightId) {
      fetchHighlightItems();
    }
  }, [highlightId]);

  useEffect(() => {
    if (modalVisible) {
      document.body.classList.add('modal-open');
    } else {
      document.body.classList.remove('modal-open');
    }

    return () => {
      document.body.classList.remove('modal-open');
    };
  }, [modalVisible]);

  const handleItemClick = (item: HighlightStory) => {
    setSelectedItem(item);
    setModalVisible(true);
  };

  const handleModalClose = () => {
    setModalVisible(false);
    setSelectedItem(null);
  };

  const renderModalContent = () => {
    if (!selectedItem) return null;

    if (selectedItem.media_type === 2 && selectedItem.video_versions?.[0]) {
      return (
        <video 
          controls 
          autoPlay 
          className="modal-media"
          src={selectedItem.video_versions[0].url}
        />
      );
    }

    return (
      <img 
        src={selectedItem.base64Image || selectedItem.image_versions?.items[0]?.url} 
        alt="Highlight content"
        className="modal-media"
      />
    );
  };

  if (loading) return <div className="highlight-items-loading"><Spin size="large" /></div>;
  if (error) return <Empty description={error} />;
  if (!items.length) return <Empty description="No items found in this highlight" />;

  return (
    <div className="highlight-items-container">
      <Row gutter={[16, 16]}>
        {items.map((item) => (
          <Col xs={24} sm={12} md={8} key={item.id}>
            <div 
              className="highlight-list-item"
              onClick={() => handleItemClick(item)}
            >
              {item.base64Image ? (
                <>
                  <img 
                    src={item.base64Image} 
                    alt="Highlight content" 
                    className="highlight-thumbnail"
                  />
                  {item.media_type === 2 && (
                    <PlayCircleOutlined className="video-indicator" />
                  )}
                </>
              ) : item.video_versions?.[0]?.url ? (
                <div className="video-placeholder">
                  <PlayCircleOutlined className="video-indicator" />
                </div>
              ) : (
                <div className="image-placeholder" />
              )}
            </div>
          </Col>
        ))}
      </Row>

      <Modal
        visible={modalVisible}
        onCancel={handleModalClose}
        footer={null}
        width="auto"
        centered
        className="highlight-modal"
        destroyOnClose
        maskStyle={{ backgroundColor: 'rgba(0, 0, 0, 0.9)' }}
      >
        {renderModalContent()}
      </Modal>
    </div>
  );
};

export default HighlightItems; 