import { useEffect, useRef, useState } from 'react';

interface UseInViewOptions {
  rootMargin?: string;
  threshold?: number | number[];
}

export const useInView = (options: UseInViewOptions = {}) => {
  const [isInView, setIsInView] = useState(false);
  const [hasBeenInView, setHasBeenInView] = useState(false);
  const elementRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!elementRef.current) return;
    
    const observer = new IntersectionObserver(
      ([entry]) => {
        const inView = entry.isIntersecting;
        setIsInView(inView);
        
        if (inView) {
          setHasBeenInView(true);
        }
      },
      {
        rootMargin: options.rootMargin || '0px',
        threshold: options.threshold || 0
      }
    );
    
    observer.observe(elementRef.current);
    
    return () => {
      observer.disconnect();
    };
  }, [options.rootMargin, options.threshold]);

  return {
    elementRef,
    isInView,
    hasBeenInView
  };
};