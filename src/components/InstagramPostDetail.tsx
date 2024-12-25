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
  const [carouselVideos, setCarouselVideos] = useState<string[]>([]);

  useEffect(() => {
    console.log({post});
    const loadCarouselMedia = async () => {
      if (!post || !visible) return;

      try {
        setLoading(true);
        const mediaUrls = post.carouselBase64Images?.map(media => 
          media || ''
        ).filter(Boolean) || [];

        // Handle single media post
        if (mediaUrls.length === 0) {
          if (post.video_url) {
            setCarouselVideos([post.video_url]);
            setCarouselImages([]);
          } else if (post.base64Image) {
            setCarouselImages([post.base64Image]);
            setCarouselVideos([]);
          }
          return;
        }

        // Handle carousel media
        const processedMedia = await Promise.all(
          mediaUrls.map(async (url) => {
            if (url.includes('video_url:')) {
              // If the URL indicates it's a video
              return { type: 'video', url: url.replace('video_url:', '') };
            } else {
              // If it's an image, convert to base64
              const base64 = await convertImageToBase64(url);
              return { type: 'image', url: base64 };
            }
          })
        );

        const images = processedMedia
          .filter(media => media.type === 'image')
          .map(media => media.url);
        
        const videos = processedMedia
          .filter(media => media.type === 'video')
          .map(media => media.url);

        setCarouselImages(images);
        setCarouselVideos(videos);
      } catch (error) {
        console.error('Error loading carousel media:', error);
      } finally {
        setLoading(false);
      }
    };

    loadCarouselMedia();
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
            dots={carouselImages.length + carouselVideos.length > 1}
            arrows={carouselImages.length + carouselVideos.length > 1}
            prevArrow={<LeftOutlined />}
            nextArrow={<RightOutlined />}
          >
            {carouselVideos.map((videoUrl, index) => (
              <div key={`video-${index}`} className="carousel-item">
                <video
                  controls
                  playsInline
                  src={videoUrl}
                  style={{ width: '100%', height: '100%', objectFit: 'contain' }}
                >
                  Your browser does not support the video tag.
                </video>
              </div>
            ))}
            {carouselImages.map((base64, index) => (
              <div key={`image-${index}`} className="carousel-item">
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