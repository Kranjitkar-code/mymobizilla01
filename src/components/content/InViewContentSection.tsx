import React, { useEffect, useRef, useState } from 'react';
import { useLazyContentItem } from '@/contexts/ContentContext';

interface InViewContentSectionProps {
  contentKey: string;
  fallback?: string;
  className?: string;
  placeholder?: React.ReactNode;
  rootMargin?: string; // Intersection Observer root margin
}

const InViewContentSection: React.FC<InViewContentSectionProps> = ({ 
  contentKey, 
  fallback = 'Loading content...',
  className = '',
  placeholder = <div className="h-4 bg-gray-200 rounded animate-pulse"></div>,
  rootMargin = '100px'
}) => {
  const content = useLazyContentItem(contentKey, '');
  const [isVisible, setIsVisible] = useState(false);
  const elementRef = useRef<HTMLDivElement>(null);
  
  useEffect(() => {
    if (!elementRef.current) return;
    
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.disconnect();
        }
      },
      { rootMargin }
    );
    
    observer.observe(elementRef.current);
    
    return () => {
      observer.disconnect();
    };
  }, [rootMargin]);

  // Show placeholder while not visible or loading
  if (!isVisible || !content) {
    return (
      <div ref={elementRef} className={`in-view-content-section ${className}`}>
        {placeholder}
      </div>
    );
  }

  return (
    <div className={`in-view-content-section ${className}`}>
      {content || fallback}
    </div>
  );
};

export default InViewContentSection;