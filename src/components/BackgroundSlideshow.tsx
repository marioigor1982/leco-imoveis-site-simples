
import React from 'react';

const BackgroundSlideshow = () => {
  return (
    <div className="absolute inset-0 w-full h-full overflow-hidden z-0">
      <div className="absolute inset-0 bg-gradient-to-b from-[#253342]/70 to-[#232226]/60 z-10"></div>
      <video
        autoPlay
        muted
        loop
        className="w-full h-full object-cover"
      >
        <source src="/lovable-uploads/wallpaper-corretor-leandro.mp4" type="video/mp4" />
        Your browser does not support the video tag.
      </video>
    </div>
  );
};

export default BackgroundSlideshow;
