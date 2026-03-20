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
          console.log('✅ Content loaded from cache');
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

  // Subscribe to real-time content updates from Firebase Firestore
  useEffect(() => {
    let unsubscribe: (() => void) | null = null;

    try {
      setLoading(true);
      console.log('🔄 Subscribing to Firebase content updates...');
      
      // Subscribe to real-time updates from Firestore
      unsubscribe = ContentService.subscribeToContent((newContent) => {
        console.log(`✅ Received ${newContent.length} content items from Firebase`);
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
      console.error('❌ Error subscribing to content:', err);
      setError('Failed to connect to Firebase. Using cached data.');
      setLoading(false);
    }

    // Cleanup subscription on unmount
    return () => {
      if (unsubscribe) {
        console.log('🔌 Unsubscribing from Firebase updates');
        unsubscribe();
      }
    };
  }, []);

  const refreshContent = useCallback(async (): Promise<void> => {
    try {
      setError(null);
      setLoading(true);
      console.log('🔄 Refreshing content from Firebase...');
      const contentData = await ContentService.getAllContent();
      setContent(contentData);
      console.log(`✅ Loaded ${contentData.length} items from Firebase`);
      
      // Cache the data
      try {
        localStorage.setItem(CONTENT_CACHE_KEY, JSON.stringify({
          data: contentData,
          timestamp: Date.now()
        }));
      } catch (e) {
        console.error('Error caching content:', e);
      }
    } catch (err: any) {
      console.error('❌ Error refreshing content:', err);
      
      // Try to load from cache if available
      try {
        const cached = localStorage.getItem(CONTENT_CACHE_KEY);
        if (cached) {
          const { data } = JSON.parse(cached);
          const cachedData = Array.isArray(data) ? data : [];
          if (cachedData.length > 0) {
            setContent(cachedData);
            setError('Using cached content. Please check your Firebase connection.');
            return;
          }
        }
      } catch (cacheErr) {
        console.error('Error reading from cache:', cacheErr);
      }
      
      setError('Could not load content from Firebase. Please check your connection.');
    } finally {
      setLoading(false);
    }
  }, []);

  const getContent = async () => {
    await refreshContent();
  };

  // Lazy loading methods (using Firestore)
  const loadLazyContent = useCallback(async (key: string) => {
    // If already loaded, don't reload
    if (lazyContent[key]) {
      return;
    }
    
    try {
      setIsLazyLoading(true);
      setLazyError(null);
      
      const item = await ContentService.getContentById(key);
      
      if (item) {
        setLazyContent(prev => ({
          ...prev,
          [key]: item
        }));
      } else {
        setLazyError('Content not found');
      }
    } catch (err: any) {
      console.error('Error loading lazy content:', err);
      setLazyError(err.message || 'Failed to load content');
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
      
      const newContent: Record<string, ContentItem> = {};
      
      // Load all keys in parallel
      await Promise.all(keysToLoad.map(async (key) => {
        const item = await ContentService.getContentById(key);
        if (item) {
          newContent[key] = item;
        }
      }));
      
      setLazyContent(prev => ({
        ...prev,
        ...newContent
      }));
    } catch (err: any) {
      console.error('Error loading lazy content batch:', err);
      setLazyError(err.message || 'Failed to load content');
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
    const updatedItem: ContentItem = {
      id,
      content: newContent,
      title: title || id,
      type,
      section,
      lastModified: new Date().toISOString()
    };
    
    // Update local state immediately for better UX
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
    } catch (e) {
      console.error('Error updating cache:', e);
    }
    
    try {
      // Update in Firestore
      console.log(`🔄 Updating '${id}' in Firebase...`);
      await ContentService.updateContent(updatedItem);
      console.log(`✅ Successfully updated '${id}' in Firebase`);
      
      // Trigger custom event for cross-component updates
      window.dispatchEvent(new CustomEvent('contentUpdated'));
    } catch (error: any) {
      console.error('❌ Error updating content in Firebase:', error);
      
      // Rollback on error
      setContent(previousContent);
      localStorage.setItem(CONTENT_CACHE_KEY, JSON.stringify({
        data: previousContent,
        timestamp: Date.now()
      }));
      
      setError('Failed to update content in Firebase. Please try again.');
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
      const previousContent = [...content];
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
      
      // Delete from Firestore
      console.log(`🗑️ Deleting '${id}' from Firebase...`);
      await ContentService.deleteContent(id);
      console.log(`✅ Successfully deleted '${id}' from Firebase`);
      
      // Also remove from lazy content if it exists
      setLazyContent(prev => {
        const updated = { ...prev };
        delete updated[id];
        return updated;
      });
      
      // Trigger custom event for same-window updates
      window.dispatchEvent(new CustomEvent('contentUpdated'));
    } catch (err: any) {
      console.error('❌ Error deleting content:', err);
      
      // Rollback on error
      const cached = localStorage.getItem(CONTENT_CACHE_KEY);
      if (cached) {
        const { data } = JSON.parse(cached);
        setContent(data);
      }
      
      setError(err.message || 'Failed to delete content from Firebase');
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
  const { content } = useContent();
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
