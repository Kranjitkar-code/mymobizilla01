import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { ContentService, type ContentItem } from '../services/contentService';

interface ContentContextType {
  content: ContentItem[];
  getContent: () => Promise<void>;
  updateContent: (id: string, content: string, title?: string, type?: 'text' | 'image' | 'html', section?: 'home' | 'services' | 'about' | 'contact' | 'settings' | 'footer') => Promise<void>;
  deleteContent: (id: string) => Promise<void>;
  refreshContent: () => Promise<void>;
  loading: boolean;
  error: string | null;
  // Lazy loading methods
  lazyContent: Record<string, ContentItem>;
  loadLazyContent: (key: string) => Promise<void>;
  loadLazyContentBatch: (keys: string[]) => Promise<void>;
  isLazyLoading: boolean;
  lazyError: string | null;
}

const ContentContext = createContext<ContentContextType | null>(null);

// Cache mechanism for offline fallback
const CONTENT_CACHE_KEY = 'contentCache';
const CACHE_DURATION = 5 * 60 * 1000; // 5 minutes

export function ContentProvider({ children }: { children: React.ReactNode }) {
  const [content, setContent] = useState<ContentItem[]>(() => {
    // Try to load from localStorage cache as fallback
    try {
      const cached = localStorage.getItem(CONTENT_CACHE_KEY);
      if (cached) {
        const { data, timestamp } = JSON.parse(cached);
        if (Array.isArray(data) && Date.now() - timestamp < CACHE_DURATION) {
          console.log('Content loaded from cache');
          return data;
        }
      }
    } catch (e) {
      console.error('Error reading cache:', e);
    }
    
    // Fallback content if nothing else is available
    return [
      {
        id: 'welcome-heading',
        title: 'Welcome Heading',
        content: 'Welcome to Mobizilla',
        type: 'text',
        section: 'home',
        lastModified: new Date().toISOString()
      },
      {
        id: 'welcome-text',
        title: 'Welcome Text',
        content: 'Your trusted partner for device repairs and buybacks',
        type: 'text',
        section: 'home',
        lastModified: new Date().toISOString()
      }
    ];
  });
  
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  
  // Lazy loading state
  const [lazyContent, setLazyContent] = useState<Record<string, ContentItem>>({});
  const [isLazyLoading, setIsLazyLoading] = useState<boolean>(false);
  const [lazyError, setLazyError] = useState<string | null>(null);

  // Subscribe to real-time content updates from Firebase
  useEffect(() => {
    let unsubscribe: (() => void) | null = null;

    try {
      setLoading(true);
      
      // Subscribe to real-time updates
      unsubscribe = ContentService.subscribeToContent((newContent) => {
        setContent(newContent);
        setError(null);
        setLoading(false);
        
        // Cache the data locally for offline access
        try {
          localStorage.setItem(CONTENT_CACHE_KEY, JSON.stringify({
            data: newContent,
            timestamp: Date.now()
          }));
        } catch (e) {
          console.error('Error caching content:', e);
        }
      });
    } catch (err: any) {
      console.error('Error subscribing to content:', err);
      setError('Failed to connect to database. Using cached data.');
      setLoading(false);
    }

    // Cleanup subscription on unmount
    return () => {
      if (unsubscribe) {
        unsubscribe();
      }
    };
  }, []);

  const refreshContent = useCallback(async () => {
    try {
      setError(null);
      setLoading(true);
      const contentData = await ContentService.getAllContent();
      setContent(contentData);
      
      // Cache the data
      try {
        localStorage.setItem(CONTENT_CACHE_KEY, JSON.stringify({
          data: contentData,
          timestamp: Date.now()
        }));
      } catch (e) {
        console.error('Error caching content:', e);
      }
      
      return contentData;
    } catch (err: any) {
      console.error('Error refreshing content:', err);
      
      // Try to load from cache if available
      try {
        const cached = localStorage.getItem(CONTENT_CACHE_KEY);
        if (cached) {
          const { data } = JSON.parse(cached);
          const cachedData = Array.isArray(data) ? data : [];
          if (cachedData.length > 0) {
            setContent(cachedData);
            setError('Using cached content. Please check your connection.');
            return cachedData;
          }
        }
      } catch (cacheErr) {
        console.error('Error reading from cache:', cacheErr);
      }
      
      setError('Could not load content. Please check your connection.');
      return [];
    } finally {
      setLoading(false);
    }
  }, []);
    try {
      setError(null);
      const response = await contentClient.get('/content');
      
      if (response.data && response.data.success) {
        const contentData = Array.isArray(response.data.data) ? response.data.data : [];
        setContent(contentData);
        
        // Cache the data
        try {
          localStorage.setItem(CONTENT_CACHE_KEY, JSON.stringify({
            data: contentData,
            timestamp: Date.now()
          }));
        } catch (e) {
          console.error('Error caching content:', e);
        }
        
        return contentData;
      } else {
        console.error('Unexpected API response format:', response.data);
        throw new Error('Invalid response format from server');
      }
    } catch (err: any) {
      console.error('Error refreshing content:', err);
      
      // Try to load from cache if available
      try {
        const cached = localStorage.getItem(CONTENT_CACHE_KEY);
        if (cached) {
          const { data } = JSON.parse(cached);
          const cachedData = Array.isArray(data) ? data : [];
          if (cachedData.length > 0) {
            setContent(cachedData);
            setError('Using cached content. Please check your connection.');
            return cachedData;
          }
        }
      } catch (cacheErr) {
        console.error('Error reading from cache:', cacheErr);
      }
      
      // If we have existing content, keep it but show an error
      if (content.length > 0) {
        setError('Could not refresh content. Using existing data.');
        return content;
      }
      
      // If we have no content at all, show a more prominent error
      setError('Could not load content. Please check your connection and refresh the page.');
      return [];
    } finally {
      setLoading(false);
    }
  }, [content.length]);

  // Add offline detection and sync when coming back online
  useEffect(() => {
    const handleOnline = async () => {
      console.log('Back online, checking for pending updates...');
      const pendingUpdates = JSON.parse(localStorage.getItem('pendingContentUpdates') || '[]');
      
      if (pendingUpdates.length > 0) {
        try {
          setLoading(true);
          // Process updates in reverse order (oldest first)
          for (const update of [...pendingUpdates].reverse()) {
            try {
              await contentClient.post('/content/update', {
                id: update.id,
                content: update.content,
                title: update.title,
                type: update.type,
                section: update.section
              });
              // Remove successfully synced update
              pendingUpdates.splice(pendingUpdates.indexOf(update), 1);
            } catch (err) {
              console.error('Error syncing update:', err);
              // Stop syncing if we hit an error, we'll try again on next online event
              break;
            }
          }
          
          // Update local storage with remaining pending updates
          localStorage.setItem('pendingContentUpdates', JSON.stringify(pendingUpdates));
          
          // Refresh content to ensure UI is up to date
          await refreshContent();
          
        } catch (err) {
          console.error('Error during sync:', err);
        } finally {
          setLoading(false);
        }
      }
    };
    
    window.addEventListener('online', handleOnline);
    
    // Initial check if we're online and have pending updates
    if (navigator.onLine) {
      handleOnline();
    }
    
    return () => {
      window.removeEventListener('online', handleOnline);
    };
  }, [refreshContent]);

  useEffect(() => {
    // Only load content if we don't have cached content
    if (content.length === 0) {
      refreshContent();
    } else {
      setLoading(false); // If we have cached content, don't show loading
    }
    
    // Clear any existing interval
    if (pollIntervalId) {
      clearInterval(pollIntervalId);
    }
    
    // Set up polling for content updates - but make it less frequent to reduce load
    const newPollIntervalId = setInterval(() => {
      // Only poll if the document is visible to save resources
      if (!document.hidden) {
        refreshContent();
      }
    }, 300000); // Refresh every 5 minutes instead of 2 minutes
    
    setPollIntervalId(newPollIntervalId);
    
    // Also set up visibility change listener to refresh when tab becomes visible
    const handleVisibilityChange = () => {
      if (!document.hidden) {
        refreshContent();
      }
    };
    
    document.addEventListener('visibilitychange', handleVisibilityChange);
    
    return () => {
      if (newPollIntervalId) {
        clearInterval(newPollIntervalId);
      }
      document.removeEventListener('visibilitychange', handleVisibilityChange);
    };
  }, [refreshContent, pollIntervalId]);

  const getContent = async () => {
    await refreshContent();
  };

  // Lazy loading methods
  const loadLazyContent = useCallback(async (key: string) => {
    // If already loaded, don't reload
    if (lazyContent[key]) {
      return;
    }
    
    try {
      setIsLazyLoading(true);
      setLazyError(null);
      
      const response = await contentClient.get(`/content/${key}`);
      
      if (response.data.success) {
        // Ensure response.data.data is an object before setting it
        if (response.data.data && typeof response.data.data === 'object') {
          setLazyContent(prev => ({
            ...prev,
            [key]: response.data.data
          }));
        } else {
          setLazyError('Invalid content data received');
        }
      } else {
        setLazyError(response.data.message || 'Failed to load content');
      }
    } catch (err: any) {
      console.error('Error loading lazy content:', err);
      setLazyError(err.response?.data?.message || err.message || 'Failed to load content');
    } finally {
      setIsLazyLoading(false);
    }
  }, [lazyContent]);

  const loadLazyContentBatch = useCallback(async (keys: string[]) => {
    // Filter out already loaded keys
    const keysToLoad = keys.filter(key => !lazyContent[key]);
    
    if (keysToLoad.length === 0) {
      return;
    }
    
    try {
      setIsLazyLoading(true);
      setLazyError(null);
      
      const response = await contentClient.post('/content/batch', { keys: keysToLoad });
      
      if (response.data.success) {
        const newContent: Record<string, ContentItem> = {};
        // Ensure response.data.data is an array before using forEach
        const dataArray = Array.isArray(response.data.data) ? response.data.data : [];
        dataArray.forEach((item: ContentItem) => {
          newContent[item.id] = item;
        });
        
        setLazyContent(prev => ({
          ...prev,
          ...newContent
        }));
      } else {
        setLazyError(response.data.message || 'Failed to load content');
      }
    } catch (err: any) {
      console.error('Error loading lazy content batch:', err);
      setLazyError(err.response?.data?.message || err.message || 'Failed to load content');
    } finally {
      setIsLazyLoading(false);
    }
  }, [lazyContent]);

  const updateContent = async (
    id: string, 
    newContent: string, 
    title?: string, 
    type: 'text' | 'image' | 'html' = 'text', 
    section: 'home' | 'services' | 'about' | 'contact' | 'settings' | 'footer' = 'home'
  ): Promise<void> => {
    // Optimistic update - update UI immediately
    const previousContent = [...content];
    const updatedItem = {
      id,
      content: newContent,
      title: title || id,
      type,
      section,
      lastModified: new Date().toISOString()
    };
    
    // Update local state
    const updatedContent = content.some(item => item.id === id)
      ? content.map(item => item.id === id ? { ...item, ...updatedItem } : item)
      : [...content, updatedItem];
      
    setContent(updatedContent);
    
    // Update cache immediately
    try {
      localStorage.setItem(CONTENT_CACHE_KEY, JSON.stringify({
        data: updatedContent,
        timestamp: Date.now()
      }));
      
      // If offline, queue the update for later
      if (!navigator.onLine) {
        const pendingUpdates = JSON.parse(localStorage.getItem('pendingContentUpdates') || '[]');
        pendingUpdates.push({
          id,
          content: newContent,
          title: title || id,
          type,
          section,
          timestamp: new Date().toISOString()
        });
        localStorage.setItem('pendingContentUpdates', JSON.stringify(pendingUpdates));
        setError('No internet connection. Changes saved locally and will sync when back online.');
        return;
      }
      
      // Try to sync with the server if online
      const response = await contentClient.post('/content/update', {
        id,
        content: newContent,
        title: title || id,
        type,
        section
      });
      
      if (response.data?.success) {
        // If server returns updated content, use it
        const serverData = Array.isArray(response.data.data) ? response.data.data : [updatedItem];
        setContent(serverData);
        
        // Update cache with server data
        localStorage.setItem(CONTENT_CACHE_KEY, JSON.stringify({
          data: serverData,
          timestamp: Date.now()
        }));
        
        return serverData;
      }
      
    } catch (error: any) {
      console.error('Error updating content:', error);
      
      // If we're online but got an error, queue the update for retry
      if (navigator.onLine) {
        const pendingUpdates = JSON.parse(localStorage.getItem('pendingContentUpdates') || '[]');
        pendingUpdates.push({
          id,
          content: newContent,
          title: title || id,
          type,
          section,
          timestamp: new Date().toISOString()
        });
        localStorage.setItem('pendingContentUpdates', JSON.stringify(pendingUpdates));
        setError('Failed to sync with server. Changes saved locally and will retry.');
      }
      
      throw error;
    }
  };

  const deleteContent = async (id: string) => {
    try {
      setError(null);
      // Ensure content is an array before proceeding
      if (!Array.isArray(content)) {
        console.error('Content is not an array:', content);
        setError('Content data structure is invalid');
        return;
      }
      
      // Optimistic update - update UI immediately
      const previousContent = [...content]; // Store previous state for rollback
      const updatedContent = content.filter(item => item.id !== id);
      setContent(updatedContent);
      
      // Update cache immediately
      try {
        localStorage.setItem(CONTENT_CACHE_KEY, JSON.stringify({
          data: updatedContent,
          timestamp: Date.now()
        }));
      } catch (e) {
        console.error('Error updating cache:', e);
      }
      
      const response = await contentClient.delete(`/content/${id}`);
      
      if (response.data.success) {
        // Update local state by filtering out the deleted item
        // Ensure content is an array before filtering
        const currentContent = Array.isArray(content) ? content : [];
        const updatedContent = currentContent.filter(item => item.id !== id);
        setContent(updatedContent);
        // Update cache
        try {
          localStorage.setItem(CONTENT_CACHE_KEY, JSON.stringify({
            data: updatedContent,
            timestamp: Date.now()
          }));
        } catch (e) {
          console.error('Error updating cache:', e);
        }
        // Also remove from lazy content if it exists
        setLazyContent(prev => {
          const updated = { ...prev };
          Object.keys(updated).forEach(key => {
            if (updated[key].id === id) {
              delete updated[key];
            }
          });
          return updated;
        });
        // Trigger custom event for same-window updates
        window.dispatchEvent(new CustomEvent('contentUpdated'));
      } else {
        // Rollback on error
        setContent(previousContent);
        setError(response.data.message || 'Failed to delete content');
        throw new Error(response.data.message || 'Failed to delete content');
      }
    } catch (err: any) {
      console.error('Error deleting content:', err);
      setError(err.response?.data?.message || err.message || 'Failed to delete content');
      throw err;
    }
  };

  return (
    <ContentContext.Provider value={{
      content,
      getContent,
      updateContent,
      deleteContent,
      refreshContent,
      loading,
      error,
      // Lazy loading properties
      lazyContent,
      loadLazyContent,
      loadLazyContentBatch,
      isLazyLoading,
      lazyError
    }}>
      {children}
    </ContentContext.Provider>
  );
}

export const useContent = () => {
  const context = useContext(ContentContext);
  if (!context) {
    throw new Error('useContent must be used within a ContentProvider');
  }
  return context;
};

// Hook to get specific content with fallback
export const useContentItem = (id: string, fallback: string = '') => {
  const { content, loading } = useContent();
  const contentItem = content.find(item => item.id === id);
  return contentItem?.content || fallback;
};

// Hook for lazy loading individual content items
export const useLazyContentItem = (key: string, fallback: string = '') => {
  const { lazyContent, loadLazyContent } = useContent();
  
  useEffect(() => {
    if (key && !lazyContent[key]) {
      loadLazyContent(key);
    }
  }, [key, lazyContent, loadLazyContent]);
  
  const contentItem = lazyContent[key];
  return contentItem?.content || fallback;
};