import axios from 'axios';

// Create axios instance for content management API
const contentClient = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:8080/api',
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 10000, // Increased timeout to 10 seconds for slow connections
});

// Add request interceptor to include auth token
contentClient.interceptors.request.use((config) => {
  const token = localStorage.getItem('adminToken');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Content item interface
export interface ContentItem {
  id: string;
  title: string;
  content: string;
  type: 'text' | 'image' | 'html';
  section: 'home' | 'services' | 'about' | 'contact' | 'settings' | 'footer';
  lastModified: string;
}

// Settings interface
export interface WebsiteSettings {
  siteTitle: string;
  contactPhone: string;
  contactEmail: string;
  contactAddress: string;
}

// Response interfaces
export interface ContentResponse {
  success: boolean;
  data: ContentItem[];
  message?: string;
  debug?: {
    cache_hit?: boolean;
    duration_ms?: number;
    record_count?: number;
  };
}

export interface SettingsResponse {
  success: boolean;
  data: WebsiteSettings;
  message?: string;
}

export interface UpdateContentResponse {
  success: boolean;
  data: ContentItem[];
  message: string;
}

export interface UpdateSettingsResponse {
  success: boolean;
  data: WebsiteSettings;
  message: string;
}

export const contentAPI = {
  /**
   * Get all content items
   */
  async getContent(): Promise<ContentResponse> {
    try {
      const response = await contentClient.get<ContentResponse>('/content');
      return response.data;
    } catch (error: any) {
      console.error('Error fetching content:', error);
      throw error;
    }
  },

  /**
   * Update content item
   * @param id Content item ID
   * @param newContent New content value
   * @param title Optional title
   * @param type Optional type
   * @param section Optional section
   */
  async updateContent(
    id: string,
    newContent: string,
    title?: string,
    type?: 'text' | 'image' | 'html',
    section?: 'home' | 'services' | 'about' | 'contact' | 'settings' | 'footer'
  ): Promise<UpdateContentResponse> {
    try {
      const response = await contentClient.post<UpdateContentResponse>('/content/update', {
        id,
        content: newContent,
        title,
        type,
        section
      });
      return response.data;
    } catch (error: any) {
      console.error('Error updating content:', error);
      throw error;
    }
  },

  /**
   * Get website settings
   */
  async getSettings(): Promise<SettingsResponse> {
    try {
      const response = await contentClient.get<SettingsResponse>('/content/settings');
      return response.data;
    } catch (error: any) {
      console.error('Error fetching settings:', error);
      throw error;
    }
  },

  /**
   * Update website settings
   * @param settings New settings
   */
  async updateSettings(settings: WebsiteSettings): Promise<UpdateSettingsResponse> {
    try {
      const response = await contentClient.post<UpdateSettingsResponse>('/content/settings', settings);
      return response.data;
    } catch (error: any) {
      console.error('Error updating settings:', error);
      throw error;
    }
  }
};