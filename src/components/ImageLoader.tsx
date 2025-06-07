
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
  const [retryCount, setRetryCount] = useState(0);

  useEffect(() => {
    setImageStatus('loading');
    setImageSrc(src);
    setRetryCount(0);
  }, [src]);

  const handleImageLoad = () => {
    console.log('Image loaded successfully:', imageSrc);
    setImageStatus('loaded');
    if (onLoad) onLoad();
  };

  const handleImageError = () => {
    console.error('Image failed to load:', imageSrc);
    
    // Tentar apenas uma vez com cache buster se for URL do Supabase
    if (retryCount === 0 && imageSrc.includes('supabase')) {
      console.log('Retrying Supabase image with cache buster');
      const separator = imageSrc.includes('?') ? '&' : '?';
      const newSrc = `${imageSrc}${separator}t=${Date.now()}`;
      setImageSrc(newSrc);
      setRetryCount(1);
      return;
    }
    
    setImageStatus('error');
    if (onError) onError();
  };

  if (imageStatus === 'error') {
    return (
      <div className={`bg-gray-200 flex items-center justify-center ${className}`}>
        <div className="text-center p-4">
          <div className="text-gray-400 mb-2">
            <svg className="w-8 h-8 mx-auto" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M4 3a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V5a2 2 0 00-2-2H4zm12 12H4l4-8 3 6 2-4 3 6z" clipRule="evenodd" />
            </svg>
          </div>
          <p className="text-gray-500 text-xs">{fallbackText}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="relative">
      {imageStatus === 'loading' && (
        <div className={`absolute inset-0 bg-gray-200 flex items-center justify-center ${className}`}>
          <div className="flex items-center gap-2">
            <div className="animate-spin w-4 h-4 border-2 border-gray-300 border-t-gray-600 rounded-full"></div>
            <span className="text-gray-400 text-xs">Carregando...</span>
          </div>
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
