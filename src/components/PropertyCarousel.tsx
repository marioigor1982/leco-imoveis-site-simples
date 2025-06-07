
import React, { useState } from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Pagination } from 'swiper/modules';
import { Property } from '@/types/database';
import PropertyFilters from './carousel/PropertyFilters';
import PropertyCard from './carousel/PropertyCard';
import CarouselControls from './carousel/CarouselControls';
import CarouselStyles from './carousel/CarouselStyles';

// Import Swiper styles
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';

type PropertyCarouselProps = {
  properties: Property[];
  onLike: (propertyId: string) => void;
  likedProperties: Record<string, boolean>;
  onPropertyClick: (property: Property) => void;
};

const PropertyCarousel = ({ properties, onLike, likedProperties, onPropertyClick }: PropertyCarouselProps) => {
  const [selectedType, setSelectedType] = useState<string>('all');
  const [selectedStatus, setSelectedStatus] = useState<string>('all');

  // Filtrar propriedades
  const filteredProperties = properties.filter((property) => {
    const typeMatch = selectedType === 'all' || property.type.toLowerCase() === selectedType.toLowerCase();
    const statusMatch = selectedStatus === 'all' || 
                       (selectedStatus === 'available' && !property.sold) || 
                       (selectedStatus === 'sold' && property.sold);
    return typeMatch && statusMatch;
  });

  return (
    <div className="w-full max-w-6xl mx-auto">
      <PropertyFilters
        selectedType={selectedType}
        selectedStatus={selectedStatus}
        onTypeChange={setSelectedType}
        onStatusChange={setSelectedStatus}
        resultCount={filteredProperties.length}
      />

      {/* Carousel */}
      {filteredProperties.length > 0 ? (
        <div className="relative">
          <Swiper
            modules={[Navigation, Pagination]}
            spaceBetween={20}
            slidesPerView={3}
            loop={filteredProperties.length > 3}
            pagination={{
              clickable: true,
              el: '.custom-pagination',
            }}
            navigation={{
              prevEl: '.custom-prev',
              nextEl: '.custom-next',
            }}
            breakpoints={{
              0: {
                slidesPerView: 1,
              },
              600: {
                slidesPerView: 2,
              },
              900: {
                slidesPerView: 3,
              },
            }}
            className="property-swiper"
          >
            {filteredProperties.map((property) => (
              <SwiperSlide key={property.id}>
                <PropertyCard
                  property={property}
                  isLiked={likedProperties[property.id]}
                  onLike={onLike}
                  onPropertyClick={onPropertyClick}
                />
              </SwiperSlide>
            ))}
          </Swiper>

          <CarouselControls />
        </div>
      ) : (
        <div className="text-center py-8">
          <p className="text-gray-600">
            Nenhum imóvel encontrado com os filtros selecionados.
          </p>
        </div>
      )}

      <CarouselStyles />
    </div>
  );
};

export default PropertyCarousel;
