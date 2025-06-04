
import React, { useState, useEffect } from 'react';

type ImageLoaderProps = {
  src: string;
  alt: string;
  className?: string;
  fallbackText?: string;
  onLoad?: () => void;
  onError?: () => void;
};

const ImageLoader = ({ 
  src, 
  alt, 
  className = "", 
  fallbackText = "Imagem não disponível",
  onLoad,
  onError 
}: ImageLoaderProps) => {
  const [imageStatus, setImageStatus] = useState<'loading' | 'loaded' | 'error'>('loading');
  const [imageSrc, setImageSrc] = useState<string>(src);

  useEffect(() => {
    setImageStatus('loading');
    setImageSrc(src);
  }, [src]);

  const handleImageLoad = () => {
    console.log('Image loaded successfully:', imageSrc);
    setImageStatus('loaded');
    if (onLoad) onLoad();
  };

  const handleImageError = () => {
    console.error('Image failed to load:', imageSrc);
    setImageStatus('error');
    if (onError) onError();
    
    // Try to reload with cache buster
    if (!imageSrc.includes('?v=')) {
      const newSrc = `${src}?v=${Date.now()}`;
      console.log('Retrying with cache buster:', newSrc);
      setImageSrc(newSrc);
      setImageStatus('loading');
    }
  };

  if (imageStatus === 'error') {
    return (
      <div className={`bg-gray-200 flex items-center justify-center ${className}`}>
        <p className="text-gray-500 text-xs text-center p-2">{fallbackText}</p>
      </div>
    );
  }

  return (
    <div className="relative">
      {imageStatus === 'loading' && (
        <div className={`absolute inset-0 bg-gray-200 flex items-center justify-center ${className}`}>
          <div className="animate-pulse text-gray-400 text-xs">Carregando...</div>
        </div>
      )}
      <img
        src={imageSrc}
        alt={alt}
        className={className}
        onLoad={handleImageLoad}
        onError={handleImageError}
        style={{ display: imageStatus === 'loaded' ? 'block' : 'none' }}
      />
    </div>
  );
};

export default ImageLoader;
