import axios from 'axios';
import { InstagramAccount, InstagramAccountResponse, InstagramPostsResponse } from '../types/instagram.types';

const INSTAGRAM_API_URL = 'https://instagram-scraper-api2.p.rapidapi.com/v1.2';
const RAPID_API_KEY = 'a0164d8ebcmsh8f1b628ba11d0d0p1b4f5bjsn0029879f66db';
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

export const getInstagramStories = async (username: string) => {
  try {
    const response = await fetch(`https://instagram-scraper-api2.p.rapidapi.com/v1/stories?username_or_id_or_url=${username}`, {
      method: 'GET',
      headers: {
        'x-rapidapi-host': 'instagram-scraper-api2.p.rapidapi.com',
        'x-rapidapi-key': 'a0164d8ebcmsh8f1b628ba11d0d0p1b4f5bjsn0029879f66db',
      },
    });
    console.log({response});
    if (!response.ok) {
      throw new Error(`Failed to fetch stories: ${response.statusText}`);
    }

    return await response.json();
  } catch (error) {
    console.error('Error fetching stories:', error);
    throw error;
  }
}; 

export const getInstagramHighlights = async (username: string) => {
  try {
    const response = await fetch(
      `https://instagram-scraper-api2.p.rapidapi.com/v1/highlights?username_or_id_or_url=${username}`,
      {
        headers: {
          'x-rapidapi-host': 'instagram-scraper-api2.p.rapidapi.com',
          'x-rapidapi-key': 'a0164d8ebcmsh8f1b628ba11d0d0p1b4f5bjsn0029879f66db'
        }
      }
    );
    
    if (!response.ok) {
      throw new Error(`Failed to fetch highlights: ${response.statusText}`);
    }

    return await response.json();
  } catch (error) {
    console.error('Error fetching highlights:', error);
    throw error;
  }
};

export const getInstagramHighlightStories = async (highlightId: string) => {
  try {
    const response = await fetch(
      `https://instagram-scraper-api2.p.rapidapi.com/v1/highlight/stories?highlight_id=${highlightId}`,
      {
        headers: {
          'x-rapidapi-host': 'instagram-scraper-api2.p.rapidapi.com',
          'x-rapidapi-key': 'a0164d8ebcmsh8f1b628ba11d0d0p1b4f5bjsn0029879f66db'
        }
      }
    );
    
    if (!response.ok) {
      throw new Error(`Failed to fetch highlight stories: ${response.statusText}`);
    }

    return await response.json();
  } catch (error) {
    console.error('Error fetching highlight stories:', error);
    throw error;
  }
}; 

export const getHighlightInfo = async (highlightId: string) => {
  try {
    const response = await fetch(
      `https://instagram-scraper-api2.p.rapidapi.com/v1/highlight_info?highlight_id=${highlightId.split(':')[1]}`,
      {
        headers: {
          'x-rapidapi-host': 'instagram-scraper-api2.p.rapidapi.com',
          'x-rapidapi-key': 'a0164d8ebcmsh8f1b628ba11d0d0p1b4f5bjsn0029879f66db'
        }
      }
    );
    
    if (!response.ok) {
      throw new Error(`Failed to fetch highlight info: ${response.statusText}`);
    }

    const resp = await response.json();
    console.log({resp})
    return resp;
  } catch (error) {
    console.error('Error fetching highlight info:', error);
  }
}; 