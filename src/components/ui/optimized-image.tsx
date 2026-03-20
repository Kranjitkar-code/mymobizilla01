import { useEffect, useState } from 'react';

interface ImageProps extends React.ImgHTMLAttributes<HTMLImageElement> {
  src: string;
  alt: string;
  className?: string;
  priority?: boolean;
}

export function OptimizedImage({ src, alt, className = '', priority = false, ...props }: ImageProps) {
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    if (priority) {
      const img = new Image();
      img.src = src;
    }
  }, [src, priority]);

  return (
    <img
      src={src}
      alt={alt}
      className={`${className} ${!loaded ? 'opacity-0' : 'opacity-100'} transition-opacity duration-300`}
      loading={priority ? 'eager' : 'lazy'}
      decoding="async"
      onLoad={() => setLoaded(true)}
      {...props}
    />
  );
}
