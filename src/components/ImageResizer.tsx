
import React, { useState, useEffect } from 'react';

type ImageResizerProps = {
  src: string;
  alt: string;
  className?: string;
  fallbackText?: string;
  width?: number;
  height?: number;
  onLoad?: () => void;
  onError?: () => void;
};

const ImageResizer = ({ 
  src, 
  alt, 
  className = "", 
  fallbackText = "Imagem não disponível",
  width = 730,
  height = 479,
  onLoad,
  onError 
}: ImageResizerProps) => {
  const [imageStatus, setImageStatus] = useState<'loading' | 'loaded' | 'error'>('loading');
  const [resizedImageSrc, setResizedImageSrc] = useState<string>('');

  useEffect(() => {
    if (!src) {
      setImageStatus('error');
      return;
    }

    setImageStatus('loading');
    
    const img = new Image();
    img.crossOrigin = 'anonymous';
    
    img.onload = () => {
      try {
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');
        
        if (!ctx) {
          setImageStatus('error');
          return;
        }

        canvas.width = width;
        canvas.height = height;
        
        // Calcular o crop para manter a proporção
        const sourceAspect = img.width / img.height;
        const targetAspect = width / height;
        
        let sourceX = 0;
        let sourceY = 0;
        let sourceWidth = img.width;
        let sourceHeight = img.height;
        
        if (sourceAspect > targetAspect) {
          // Imagem mais larga, crop nas laterais
          sourceWidth = img.height * targetAspect;
          sourceX = (img.width - sourceWidth) / 2;
        } else {
          // Imagem mais alta, crop em cima/baixo
          sourceHeight = img.width / targetAspect;
          sourceY = (img.height - sourceHeight) / 2;
        }
        
        ctx.drawImage(
          img,
          sourceX, sourceY, sourceWidth, sourceHeight,
          0, 0, width, height
        );
        
        const resizedDataUrl = canvas.toDataURL('image/jpeg', 0.85);
        setResizedImageSrc(resizedDataUrl);
        setImageStatus('loaded');
        
        if (onLoad) onLoad();
      } catch (error) {
        console.error('Error resizing image:', error);
        setImageStatus('error');
        if (onError) onError();
      }
    };
    
    img.onerror = () => {
      console.error('Error loading image:', src);
      setImageStatus('error');
      if (onError) onError();
    };
    
    img.src = src;
  }, [src, width, height, onLoad, onError]);

  if (imageStatus === 'error') {
    return (
      <div className={`bg-gray-200 flex items-center justify-center ${className}`} style={{ width, height }}>
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

  if (imageStatus === 'loading') {
    return (
      <div className={`bg-gray-200 flex items-center justify-center ${className}`} style={{ width, height }}>
        <div className="flex items-center gap-2">
          <div className="animate-spin w-4 h-4 border-2 border-gray-300 border-t-gray-600 rounded-full"></div>
          <span className="text-gray-400 text-xs">Redimensionando...</span>
        </div>
      </div>
    );
  }

  return (
    <img
      src={resizedImageSrc}
      alt={alt}
      className={className}
      style={{ width, height, objectFit: 'cover' }}
    />
  );
};

export default ImageResizer;
