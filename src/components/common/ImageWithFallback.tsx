import React, { useState, useEffect } from 'react';
import { User } from 'lucide-react';

export interface ImageWithFallbackProps extends React.ImgHTMLAttributes<HTMLImageElement> {
  fallbackSrc?: string;
  fallbackType?: 'default' | 'product' | 'avatar' | 'diy';
  category?: string;
  showCategoryIcon?: boolean;
}

// Beautiful inline SVG placeholders that require zero external network requests
const DEFAULT_FALLBACK_SVG =
  'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="600" height="400" viewBox="0 0 600 400"><rect width="100%" height="100%" fill="%23EEF5F0"/><path d="M260 220 L300 170 L350 230 L390 190 L430 240 L170 240 Z" fill="%23C8DEC9"/><circle cx="230" cy="160" r="24" fill="%239ABF9C"/><text x="50%" y="78%" dominant-baseline="middle" text-anchor="middle" font-family="sans-serif" font-weight="600" font-size="16" fill="%23435C4A">ReUseHub Sustainable Item</text></svg>';

const AVATAR_FALLBACK_SVG =
  'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="200" height="200" viewBox="0 0 200 200"><rect width="100%" height="100%" fill="%23E2EBE4"/><circle cx="100" cy="80" r="40" fill="%23688D6F"/><path d="M40 180 C40 135 70 130 100 130 C130 130 160 135 160 180 Z" fill="%23688D6F"/></svg>';

export const ImageWithFallback: React.FC<ImageWithFallbackProps> = ({
  src,
  alt = 'Image',
  className = '',
  fallbackSrc,
  fallbackType = 'default',
  onError,
  loading = 'lazy',
  ...rest
}) => {
  const [hasError, setHasError] = useState(false);
  const [isLoaded, setIsLoaded] = useState(false);

  // Reset error state when src changes
  useEffect(() => {
    setHasError(false);
    setIsLoaded(false);
  }, [src]);

  const defaultFallback = fallbackType === 'avatar' ? AVATAR_FALLBACK_SVG : DEFAULT_FALLBACK_SVG;
  const effectiveFallback = fallbackSrc || defaultFallback;

  const handleError = (e: React.SyntheticEvent<HTMLImageElement, Event>) => {
    if (!hasError) {
      setHasError(true);
      if (onError) {
        onError(e);
      }
    }
  };

  if (!src || hasError) {
    if (fallbackType === 'avatar') {
      return (
        <div
          className={`flex items-center justify-center bg-forest-100 text-forest-700 font-bold select-none ${className}`}
          aria-label={alt}
        >
          <User className="w-1/2 h-1/2 text-forest-600" />
        </div>
      );
    }

    return (
      <img
        src={effectiveFallback}
        alt={alt}
        className={`${className} object-cover bg-forest-50`}
        loading="lazy"
        {...rest}
      />
    );
  }

  return (
    <img
      src={src}
      alt={alt}
      loading={loading}
      className={`${className} ${isLoaded ? 'opacity-100' : 'opacity-90'} transition-opacity duration-300`}
      onLoad={() => setIsLoaded(true)}
      onError={handleError}
      {...rest}
    />
  );
};
