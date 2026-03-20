import React, { useEffect } from 'react';
import { useLazyContentItem } from '@/contexts/ContentContext';

interface LazyContentSectionProps {
  contentKey: string;
  fallback?: string;
  className?: string;
  onLoad?: () => void;
}

const LazyContentSection: React.FC<LazyContentSectionProps> = ({ 
  contentKey, 
  fallback = 'Loading content...',
  className = '',
  onLoad
}) => {
  const content = useLazyContentItem(contentKey, fallback);
  
  // Notify when content is loaded
  useEffect(() => {
    if (content && content !== fallback && onLoad) {
      onLoad();
    }
  }, [content, fallback, onLoad]);

  return (
    <div className={`lazy-content-section ${className}`}>
      {content}
    </div>
  );
};

export default LazyContentSection;