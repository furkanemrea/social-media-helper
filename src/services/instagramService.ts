import axios from 'axios';
import { InstagramAccount, InstagramAccountResponse, InstagramPostsResponse } from '../types/instagram.types';

const INSTAGRAM_API_URL = 'https://instagram-scraper-api2.p.rapidapi.com/v1.2';
const RAPID_API_KEY = '73294bfdc7msh5d4adbfbeb54c78p1e09f9jsn473ddfb8e91a';
const RAPID_API_HOST = 'instagram-scraper-api2.p.rapidapi.com';

const api = axios.create({
  baseURL: 'https://instagram-scraper-api2.p.rapidapi.com/v1',
  headers: {
    'x-rapidapi-host': RAPID_API_HOST,
    'x-rapidapi-key': RAPID_API_KEY,
  },
});

export const fetchInstagramAccount = async (username: string): Promise<InstagramAccount> => {
  try {
    const response = await api.get<InstagramAccountResponse>(`/info`, {
      params: { username_or_id_or_url: username }
    });

    const { data } = response.data;
    
    return {
        username: data.username,
        fullName: data.full_name,
        profilePic: data.profile_pic_url_hd,
        followers: data.follower_count,
        following: data.following_count,
        posts: data.media_count,
        bio: data.biography,
        website: data.external_url,
        category: data.category,
        isVerified: data.is_verified,
        isPrivate: data.is_private,
        publicEmail: data.public_email,
        publicPhoneNumber: data.public_phone_number,
        location: data.location_data ? {
            city: data.location_data.city_name,
            street: data.location_data.address_street,
            zip: data.location_data.zip,
        } : undefined,
        bioLinks: data.bio_links?.map(link => ({
            title: link.title,
            url: link.url,
        })),
        profile_pic_url: data.profile_pic_url,
        profile_pic_url_hd: data.profile_pic_url_hd,
        hd_profile_pic_url_info: data.hd_profile_pic_url_info,
    } as InstagramAccount
    
  } catch (error) {
    if (axios.isAxiosError(error)) {
      throw new Error(error.response?.data?.message || 'Failed to fetch Instagram account');
    }
    throw error;
  }
}; 

export const getInstagramPosts = async (username: string): Promise<InstagramPostsResponse> => {
  try {
    const response = await fetch(`${INSTAGRAM_API_URL}/posts?username_or_id_or_url=${username}`, {
      method: 'GET',
      headers: {
        'x-rapidapi-host': RAPID_API_HOST,
        'x-rapidapi-key': RAPID_API_KEY,
      },
    });

    if (!response.ok) {
      throw new Error(`Failed to fetch Instagram posts: ${response.statusText}`);
    }

    const data = await response.json();
    
    // Process the items to ensure all image versions are included
    if (data.data?.items) {
      data.data.items = data.data.items.map((item: any) => ({
        ...item,
        image_versions: {
          items: [
            // Include thumbnail URL if it exists
            ...(item.thumbnail_url ? [{
              url: item.thumbnail_url,
              width: item.original_width || 1080,
              height: item.original_height || 1080
            }] : []),
            // Include any carousel media items
            ...(item.carousel_media?.map((media: any) => ({
              url: media.image_versions2?.candidates?.[0]?.url || media.thumbnail_url,
              width: media.original_width || 1080,
              height: media.original_height || 1080
            })) || []),
            // Include video thumbnail if it's a video
            ...(item.video_versions?.length ? [{
              url: item.video_versions[0].url,
              width: item.video_versions[0].width,
              height: item.video_versions[0].height
            }] : []),
            // Include any other image versions
            ...(item.image_versions2?.candidates || [])
          ].filter(img => img && img.url) // Remove any null/undefined entries
        }
      }));
    }

    return data;
  } catch (error) {
    console.error('Error fetching Instagram posts:', error);
    throw error;
  }
}; 