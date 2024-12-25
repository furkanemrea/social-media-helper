export interface InstagramAccount {
  username: string;
  fullName: string;
  profilePic: string;
  followers: number;
  following: number;
  posts: number;
  bio: string;
  website?: string;
  category?: string;
  isVerified: boolean;
  isPrivate: boolean;
  publicEmail?: string;
  publicPhoneNumber?: string;
  location?: {
    city: string;
    street: string;
    zip: string;
  };
  bioLinks?: {
    title: string;
    url: string;
  }[];
  profile_pic_url: string;
  profile_pic_url_hd: string;
  hd_profile_pic_url_info?: {
    url: string;
    width: number;
    height: number;
  };
} 




export interface InstagramAccountResponse {
    data: InstagramAccountItem;
  }
  
  export interface About {
    country: string;
    date_joined: string;
    date_joined_as_timestamp: number;
    former_usernames: number;
  }
  
  export interface Active_standalone_fundraisers {
    fundraisers: any[];
    total_count: number;
  }
  
  export interface Bio_linksItem {
    is_pinned: boolean;
    link_id: number;
    link_type: string;
    lynx_url: string;
    open_external_url_with_in_app_browser: boolean;
    title: string;
    url: string;
  }
  
  export interface User {
    id: number;
    username: string;
  }
  
  export interface EntitiesItem {
    user: User;
  }
  
  export interface Biography_with_entities {
    entities: EntitiesItem[];
    raw_text: string;
  }
  
  export interface Hd_profile_pic_url_info {
    height: number;
    url: string;
    width: number;
  }
  
  export interface Hd_profile_pic_versionsItem {
    height: number;
    url: string;
    width: number;
  }
  
  export interface Location_data {
    address_street: string;
    city_id: any;
    city_name: string;
    instagram_location_id: string;
    latitude: any;
    longitude: any;
    zip: string;
  }
  
  export interface Pinned_channels_info {
    has_public_channels: boolean;
    pinned_channels_list: any[];
  }
  
  export interface InstagramAccountItem {
    about: About;
    account_badges: any[];
    account_type: number;
    active_standalone_fundraisers: Active_standalone_fundraisers;
    ads_incentive_expiration_date: any;
    ads_page_id: any;
    ads_page_name: any;
    bio_links: Bio_linksItem[];
    biography: string;
    biography_email: any;
    biography_with_entities: Biography_with_entities;
    business_contact_method: string;
    can_add_fb_group_link_on_profile: boolean;
    can_hide_category: boolean;
    can_hide_public_contacts: boolean;
    category: string;
    category_id: number;
    contact_phone_number: string;
    current_catalog_id: any;
    direct_messaging: string;
    external_lynx_url: string;
    external_url: string;
    fbid_v2: string;
    follower_count: number;
    following_count: number;
    full_name: string;
    has_anonymous_profile_picture: boolean;
    has_chaining: boolean;
    has_guides: boolean;
    has_igtv_series: boolean;
    hd_profile_pic_url_info: Hd_profile_pic_url_info;
    hd_profile_pic_versions: Hd_profile_pic_versionsItem[];
    id: string;
    is_business: boolean;
    is_call_to_action_enabled: boolean;
    is_category_tappable: boolean;
    is_eligible_for_request_message: boolean;
    is_favorite: boolean;
    is_favorite_for_clips: boolean;
    is_favorite_for_igtv: boolean;
    is_favorite_for_stories: boolean;
    is_private: boolean;
    is_profile_audio_call_enabled: boolean;
    is_verified: boolean;
    latest_reel_media: number;
    live_subscription_status: string;
    location_data: Location_data;
    media_count: number;
    merchant_checkout_style: string;
    page_id: any;
    page_name: any;
    pinned_channels_info: Pinned_channels_info;
    primary_profile_link_type: number;
    professional_conversion_suggested_account_type: number;
    profile_context: string;
    profile_context_facepile_users: any[];
    profile_context_links_with_user_ids: any[];
    profile_pic_id: string;
    profile_pic_url: string;
    profile_pic_url_hd: string;
    public_email: string;
    public_phone_country_code: string;
    public_phone_number: string;
    seller_shoppable_feed_type: string;
    show_shoppable_feed: boolean;
    third_party_downloads_enabled: number;
    total_igtv_videos: number;
    upcoming_events: any[];
    username: string;
  }
  
  export interface InstagramPostsResponse {
    data: {
      count: number;
      items: InstagramPost[];
      user: InstagramUser;
    };
    pagination_token: string;
  }
  
  export interface InstagramPost {
    id: string;
    code: string;
    caption: {
      text: string;
      created_at: number;
      user: InstagramUser;
    };
    media_type: number;
    like_count: number;
    comment_count: number;
    play_count?: number;
    video_url?: string;
    thumbnail_url?: string;
    taken_at: number;
    image_versions?: {
      items: {
        url: string;
        width: number;
        height: number;
      }[];
    };
  }
  
  export interface InstagramUser {
    id: string;
    username: string;
    full_name: string;
    profile_pic_url: string;
    is_private: boolean;
    is_verified: boolean;
  }
  
  