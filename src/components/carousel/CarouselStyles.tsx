
import React from 'react';

const CarouselStyles = () => {
  return (
    <style>{`
      .property-swiper .swiper-slide {
        height: auto;
        display: flex;
      }
      
      .property-swiper .swiper-slide > div {
        width: 100%;
        display: flex;
        flex-direction: column;
      }
      
      .custom-pagination .swiper-pagination-bullet {
        width: 12px;
        height: 12px;
        background: #253342;
        opacity: 0.3;
        margin: 0 4px;
      }
      
      .custom-pagination .swiper-pagination-bullet-active {
        opacity: 1;
        background: #5e9188;
      }
      
      .line-clamp-1 {
        display: -webkit-box;
        -webkit-line-clamp: 1;
        -webkit-box-orient: vertical;
        overflow: hidden;
      }
      
      .line-clamp-2 {
        display: -webkit-box;
        -webkit-line-clamp: 2;
        -webkit-box-orient: vertical;
        overflow: hidden;
      }
    `}</style>
  );
};

export default CarouselStyles;
