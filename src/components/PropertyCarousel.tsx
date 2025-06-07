
import React, { useEffect, useState } from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Pagination } from 'swiper/modules';
import { ChevronLeft, ChevronRight, Heart } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { supabase } from '@/integrations/supabase/client';
import { Property } from '@/types/database';
import ImageLoader from './ImageLoader';

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

  const propertyTypes = [
    { value: 'all', label: 'Todos os tipos' },
    { value: 'Casa', label: 'Casa' },
    { value: 'Sobrado', label: 'Sobrado' },
    { value: 'Apartamento', label: 'Apartamento' },
    { value: 'Kitnet', label: 'Kitnet' },
    { value: 'Comercial', label: 'Comercial' },
    { value: 'Terreno', label: 'Terreno' },
    { value: 'Chácara', label: 'Chácara' },
    { value: 'Cobertura', label: 'Cobertura' },
    { value: 'Studio', label: 'Studio' }
  ];

  const statusOptions = [
    { value: 'all', label: 'Todos' },
    { value: 'available', label: 'Disponíveis' },
    { value: 'sold', label: 'Vendidos' }
  ];

  // Filtrar propriedades
  const filteredProperties = properties.filter((property) => {
    const typeMatch = selectedType === 'all' || property.type.toLowerCase() === selectedType.toLowerCase();
    const statusMatch = selectedStatus === 'all' || 
                       (selectedStatus === 'available' && !property.sold) || 
                       (selectedStatus === 'sold' && property.sold);
    return typeMatch && statusMatch;
  });

  const sendWhatsAppMessage = (property: Property) => {
    const message = `Olá Leandro, estou interessado no imóvel: ${property.title} - ${property.ref} no valor de ${property.price}. Gostaria de mais informações.`;
    const encodedMessage = encodeURIComponent(message);
    window.open(`https://wa.me/5511991866739?text=${encodedMessage}`, '_blank');
  };

  return (
    <div className="w-full max-w-6xl mx-auto">
      {/* Filtros */}
      <div className="mb-6 flex flex-wrap gap-4 justify-center">
        <div className="flex items-center gap-2 bg-white p-3 rounded-lg shadow-sm border">
          <Select value={selectedType} onValueChange={setSelectedType}>
            <SelectTrigger className="w-48 border-0 shadow-none">
              <SelectValue placeholder="Filtrar por tipo" />
            </SelectTrigger>
            <SelectContent>
              {propertyTypes.map((type) => (
                <SelectItem key={type.value} value={type.value}>
                  {type.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="flex items-center gap-2 bg-white p-3 rounded-lg shadow-sm border">
          <Select value={selectedStatus} onValueChange={setSelectedStatus}>
            <SelectTrigger className="w-48 border-0 shadow-none">
              <SelectValue placeholder="Status do imóvel" />
            </SelectTrigger>
            <SelectContent>
              {statusOptions.map((status) => (
                <SelectItem key={status.value} value={status.value}>
                  {status.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Contador de resultados */}
      <div className="text-center mb-6">
        <p className="text-sm text-gray-600">
          {filteredProperties.length} imóvel(is) encontrado(s)
        </p>
      </div>

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
                <div className="bg-white rounded-lg overflow-hidden shadow-md hover:shadow-lg transition-all duration-300 cursor-pointer group">
                  <div className="relative h-40">
                    {property.image_url ? (
                      <div className="relative w-full h-full">
                        <ImageLoader
                          src={property.image_url}
                          alt={property.title}
                          className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                          fallbackText="Imagem indisponível"
                        />
                        {property.sold && (
                          <div className="absolute inset-0 flex items-center justify-center">
                            <div className="bg-green-500/90 text-white font-bold py-2 px-6 transform -rotate-45 text-lg w-full text-center">
                              VENDIDO
                            </div>
                          </div>
                        )}
                      </div>
                    ) : (
                      <div className="w-full h-full bg-gray-200 flex items-center justify-center">
                        <p className="text-gray-500">Sem imagem</p>
                      </div>
                    )}
                    <div className="absolute top-2 left-2 bg-[#253342] text-white text-xs font-semibold px-2 py-1 rounded">
                      {property.type}
                    </div>
                    <div className="absolute bottom-2 right-2 bg-[#5e9188] text-white text-xs font-semibold px-2 py-1 rounded">
                      Ref: {property.ref}
                    </div>
                  </div>
                  
                  <div className="p-4">
                    <h3 className="text-lg font-semibold text-gray-900 mb-2 line-clamp-1">
                      {property.title}
                    </h3>
                    <p className="text-gray-600 mb-1 flex items-center text-sm">
                      <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
                        <path d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" />
                      </svg>
                      {property.location}
                    </p>
                    <p className="text-gray-600 mb-3 text-sm line-clamp-2">
                      {property.details}
                    </p>
                    <div className="flex justify-between items-center">
                      <span className="text-lg font-bold text-[#253342]">
                        {property.price}
                      </span>
                      
                      <div className="flex items-center space-x-2">
                        <Button
                          onClick={(e) => {
                            e.stopPropagation();
                            onLike(property.id);
                          }}
                          size="sm"
                          variant="ghost"
                          className="flex items-center gap-1 hover:bg-pink-50"
                        >
                          <Heart
                            className={`w-4 h-4 ${likedProperties[property.id] ? 'fill-red-500 text-red-500' : 'text-gray-400'}`}
                          />
                          <span className="text-sm font-medium">{property.likes || 0}</span>
                        </Button>
                        
                        <Button
                          onClick={(e) => {
                            e.stopPropagation();
                            sendWhatsAppMessage(property);
                          }}
                          className="bg-green-600 hover:bg-green-700 text-white flex items-center font-medium px-3 py-2 text-sm"
                          disabled={property.sold}
                        >
                          <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 24 24">
                            <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z"/>
                            <path d="M12 0C5.373 0 0 5.373 0 12c0 2.583.823 5.077 2.364 7.142L.236 23.656A1 1 0 001 25c.148 0 .294-.032.429-.097l4.677-2.131A11.969 11.969 0 0012 24c6.627 0 12-5.373 12-12S18.627 0 12 0zm0 22c-1.86 0-3.668-.556-5.2-1.593a1 1 0 00-.8-.107l-3.173 1.136 1.14-3.173a1 1 0 00-.107-.8A9.957 9.957 0 012 12C2 6.486 6.486 2 12 2s10 4.486 10 10-4.486 10-10 10z"/>
                          </svg>
                          {property.sold ? 'Vendido' : 'Falar'}
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>
              </SwiperSlide>
            ))}
          </Swiper>

          {/* Controles customizados */}
          <div className="flex justify-center items-center gap-5 mt-8">
            <button className="custom-prev w-12 h-12 border-2 border-[#253342] bg-white text-[#253342] rounded-lg flex items-center justify-center hover:bg-[#253342] hover:text-white transition-all duration-300 hover:-translate-y-1 shadow-lg">
              <ChevronLeft className="w-6 h-6" />
            </button>
            
            <div className="custom-pagination flex gap-2"></div>
            
            <button className="custom-next w-12 h-12 border-2 border-[#253342] bg-white text-[#253342] rounded-lg flex items-center justify-center hover:bg-[#253342] hover:text-white transition-all duration-300 hover:-translate-y-1 shadow-lg">
              <ChevronRight className="w-6 h-6" />
            </button>
          </div>
        </div>
      ) : (
        <div className="text-center py-8">
          <p className="text-gray-600">
            Nenhum imóvel encontrado com os filtros selecionados.
          </p>
        </div>
      )}

      <style jsx>{`
        .property-swiper .swiper-slide {
          height: auto;
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
    </div>
  );
};

export default PropertyCarousel;
