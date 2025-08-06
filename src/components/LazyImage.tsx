import { useState, useRef, useEffect } from 'react';

interface LazyImageProps {
  src: string;
  alt: string;
  className?: string;
  placeholder?: string;
  loading?: 'lazy' | 'eager';
  onError?: (e: React.SyntheticEvent<HTMLImageElement, Event>) => void;
}

export const LazyImage = ({ 
  src, 
  alt, 
  className = '', 
  placeholder = "/api/placeholder/300/400",
  loading = 'lazy',
  onError
}: LazyImageProps) => {
  const [isLoaded, setIsLoaded] = useState(false);
  const [hasError, setHasError] = useState(false);
  const imgRef = useRef<HTMLImageElement>(null);

  useEffect(() => {
    const img = imgRef.current;
    if (!img) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            img.src = src;
            observer.unobserve(img);
          }
        });
      },
      { threshold: 0.1 }
    );

    if (loading === 'lazy') {
      observer.observe(img);
    } else {
      img.src = src;
    }

    return () => observer.disconnect();
  }, [src, loading]);

  const handleLoad = () => {
    setIsLoaded(true);
  };

  const handleError = (e: React.SyntheticEvent<HTMLImageElement, Event>) => {
    setHasError(true);
    if (imgRef.current) {
      imgRef.current.src = placeholder;
    }
    onError?.(e);
  };

  return (
    <div className={`relative overflow-hidden ${className}`}>
      <img
        ref={imgRef}
        alt={alt}
        className={`w-full h-full object-cover transition-opacity duration-300 ${
          isLoaded ? 'opacity-100' : 'opacity-0'
        }`}
        onLoad={handleLoad}
        onError={handleError}
        decoding="async"
      />
      {!isLoaded && !hasError && (
        <div className="absolute inset-0 bg-muted animate-pulse" />
      )}
    </div>
  );
};