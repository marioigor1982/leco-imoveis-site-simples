
import React from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

const CarouselControls = () => {
  return (
    <div className="flex justify-center items-center gap-5 mt-8">
      <button className="custom-prev w-12 h-12 border-2 border-[#253342] bg-white text-[#253342] rounded-lg flex items-center justify-center hover:bg-[#253342] hover:text-white transition-all duration-300 hover:-translate-y-1 shadow-lg">
        <ChevronLeft className="w-6 h-6" />
      </button>
      
      <div className="custom-pagination flex gap-2"></div>
      
      <button className="custom-next w-12 h-12 border-2 border-[#253342] bg-white text-[#253342] rounded-lg flex items-center justify-center hover:bg-[#253342] hover:text-white transition-all duration-300 hover:-translate-y-1 shadow-lg">
        <ChevronRight className="w-6 h-6" />
      </button>
    </div>
  );
};

export default CarouselControls;
