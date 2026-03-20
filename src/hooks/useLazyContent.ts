import { useState, useEffect, useCallback } from 'react';
import axios from 'axios';

interface ContentItem {
  id: string;
  title: string;
  content: string;
  type: 'text' | 'image' | 'html';
  section: 'home' | 'services' | 'about' | 'contact' | 'settings' | 'footer';
  lastModified: string;
}

interface UseLazyContentReturn {
  content: ContentItem | null;
  loading: boolean;
  error: string | null;
  loadContent: (key: string) => Promise<void>;
}

// Cache mechanism
const CONTENT_CACHE_KEY = 'lazyContentCache';
const CACHE_DURATION = 5 * 60 * 1000; // 5 minutes

const getContentCache = (): Record<string, { data: ContentItem; timestamp: number }> => {
  try {
    const cached = localStorage.getItem(CONTENT_CACHE_KEY);
    return cached ? JSON.parse(cached) : {};
  } catch (e) {
    return {};
  }
};

const setContentCache = (cache: Record<string, { data: ContentItem; timestamp: number }>) => {
  try {
    localStorage.setItem(CONTENT_CACHE_KEY, JSON.stringify(cache));
  } catch (e) {
    console.error('Error setting content cache:', e);
  }
};

const getCachedContent = (key: string): ContentItem | null => {
  const cache = getContentCache();
  if (cache[key] && Date.now() - cache[key].timestamp < CACHE_DURATION) {
    return cache[key].data;
  }
  return null;
};

const setCachedContent = (key: string, data: ContentItem) => {
  const cache = getContentCache();
  cache[key] = {
    data,
    timestamp: Date.now()
  };
  setContentCache(cache);
};

// Create axios instance for content management API with timeout
const contentClient = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:8000/api',
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 10000, // 10 second timeout
});

// Add request interceptor to include auth token
contentClient.interceptors.request.use((config) => {
  const token = localStorage.getItem('adminToken');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export const useLazyContent = (initialKey?: string): UseLazyContentReturn => {
  const [content, setContent] = useState<ContentItem | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const loadContent = useCallback(async (key: string) => {
    // Check cache first
    const cached = getCachedContent(key);
    if (cached) {
      setContent(cached);
      return;
    }

    try {
      setLoading(true);
      setError(null);
      
      const response = await contentClient.get(`/content/${key}`);
      
      if (response.data.success) {
        setContent(response.data.data);
        // Cache the data
        setCachedContent(key, response.data.data);
      } else {
        setError(response.data.message || 'Failed to load content');
      }
    } catch (err: any) {
      console.error('Error loading content:', err);
      setError(err.response?.data?.message || err.message || 'Failed to load content');
    } finally {
      setLoading(false);
    }
  }, []);

  // Load initial content if provided
  useEffect(() => {
    if (initialKey) {
      loadContent(initialKey);
    }
  }, [initialKey, loadContent]);

  return {
    content,
    loading,
    error,
    loadContent
  };
};

// Hook for loading multiple content items at once
interface UseBatchContentReturn {
  content: Record<string, ContentItem>;
  loading: boolean;
  error: string | null;
  loadContentBatch: (keys: string[]) => Promise<void>;
}

export const useBatchContent = (): UseBatchContentReturn => {
  const [content, setContent] = useState<Record<string, ContentItem>>({});
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const loadContentBatch = useCallback(async (keys: string[]) => {
    // Check cache first for all keys
    const cachedContent: Record<string, ContentItem> = {};
    const keysToFetch: string[] = [];
    
    keys.forEach(key => {
      const cached = getCachedContent(key);
      if (cached) {
        cachedContent[key] = cached;
      } else {
        keysToFetch.push(key);
      }
    });
    
    // If all content is cached, return immediately
    if (keysToFetch.length === 0) {
      setContent(prev => ({ ...prev, ...cachedContent }));
      return;
    }

    try {
      setLoading(true);
      setError(null);
      
      const response = await contentClient.post('/content/batch', { keys: keysToFetch });
      
      if (response.data.success) {
        const newContent: Record<string, ContentItem> = {};
        response.data.data.forEach((item: ContentItem) => {
          newContent[item.id] = item;
          // Cache each item
          setCachedContent(item.id, item);
        });
        
        setContent(prev => ({ ...prev, ...cachedContent, ...newContent }));
      } else {
        setError(response.data.message || 'Failed to load content');
      }
    } catch (err: any) {
      console.error('Error loading content batch:', err);
      setError(err.response?.data?.message || err.message || 'Failed to load content');
    } finally {
      setLoading(false);
    }
  }, []);

  return {
    content,
    loading,
    error,
    loadContentBatch
  };
};