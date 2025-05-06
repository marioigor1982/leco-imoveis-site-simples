
import React, { useState, useEffect } from 'react';

const images = [
  "/lovable-uploads/a8f8fe57-1f30-43ac-b6df-55b068365447.png", // Cozinha
  "/lovable-uploads/96ce8d25-2383-4ff3-aae8-d256ce292b38.png", // Quarto
  "/lovable-uploads/6e7e5047-6cb8-44ec-9223-55d354d7eb6e.png", // Quadra de areia
  "/lovable-uploads/93ebed18-1f23-47df-8ec9-f4727215f637.png", // Academia
  "/lovable-uploads/f16ad66f-5aa9-4348-b63f-6a9127bee08d.png"  // Piscina
];

const BackgroundSlideshow = () => {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentImageIndex((prevIndex) => (prevIndex + 1) % images.length);
    }, 5000); // Muda a imagem a cada 5 segundos

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="absolute inset-0 w-full h-full overflow-hidden z-0">
      <div className="absolute inset-0 bg-gradient-to-b from-[#253342]/70 to-[#232226]/60 z-10"></div>
      
      {/* Slideshow de imagens */}
      <div className="relative h-full w-full">
        {images.map((image, index) => (
          <div
            key={index}
            className={`absolute inset-0 w-full h-full transition-opacity duration-1000 ease-in-out ${
              index === currentImageIndex ? 'opacity-100' : 'opacity-0'
            }`}
          >
            <img
              src={image}
              alt={`Imóvel destacado ${index + 1}`}
              className="w-full h-full object-cover"
            />
          </div>
        ))}
      </div>
    </div>
  );
};

export default BackgroundSlideshow;
