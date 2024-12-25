import React, { useEffect, useState } from 'react';
import { Modal, Carousel } from 'antd';
import { LeftOutlined, RightOutlined, HeartOutlined, MessageOutlined } from '@ant-design/icons';
import { InstagramPost } from '../types/instagram.types';
import { convertImageToBase64 } from '../utils/imageUtils';
import './InstagramPostDetail.css';

interface PostWithBase64 extends InstagramPost {
  base64Image?: string;
  carouselBase64Images?: string[];
}

interface Props {
  post: PostWithBase64 | null;
  visible: boolean;
  onClose: () => void;
}

const InstagramPostDetail: React.FC<Props> = ({ post, visible, onClose }) => {
  const [loading, setLoading] = useState(false);
  const [carouselImages, setCarouselImages] = useState<string[]>([]);

  useEffect(() => {
    const loadCarouselImages = async () => {
      if (!post || !visible) return;

      try {
        setLoading(true);
        const imageUrls = post.carouselBase64Images?.map(media => 
          media || ''
        ).filter(Boolean) || [];
        
        if (imageUrls.length === 0 && post.base64Image) {
          setCarouselImages([post.base64Image]);
          return;
        }

        const base64Images = await Promise.all(
          imageUrls.map(url => convertImageToBase64(url))
        );
        setCarouselImages(base64Images);
      } catch (error) {
        console.error('Error loading carousel images:', error);
      } finally {
        setLoading(false);
      }
    };

    loadCarouselImages();
  }, [post, visible]);

  if (!post) return null;

  return (
    <Modal
      open={visible}
      onCancel={onClose}
      footer={null}
      width={1000}
      className="post-detail-modal"
      centered
    >
      <div className="post-detail-container">
        <div className="post-detail-media">
          <Carousel
            dots={carouselImages.length > 1}
            arrows={carouselImages.length > 1}
            prevArrow={<LeftOutlined />}
            nextArrow={<RightOutlined />}
          >
            {carouselImages.map((base64, index) => (
              <div key={index} className="carousel-item">
                <img src={base64} alt={`Post ${index + 1}`} />
              </div>
            ))}
          </Carousel>
        </div>
        
        <div className="post-detail-info">
          <div className="post-detail-header">
            <img 
              src={post.caption?.user?.profile_pic_url} 
              alt={post.caption?.user?.username} 
              className="user-avatar"
            />
            <span className="username">{post.caption?.user?.username}</span>
          </div>
          
          <div className="post-detail-caption">
            {post.caption?.text}
          </div>
          
          <div className="post-detail-stats">
            <span><HeartOutlined /> {post.like_count.toLocaleString()}</span>
            <span><MessageOutlined /> {post.comment_count.toLocaleString()}</span>
          </div>
        </div>
      </div>
    </Modal>
  );
};

export default InstagramPostDetail; 