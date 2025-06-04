import React, { useEffect, useState } from 'react';
import { ArrowRight, Loader2, Heart } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/components/ui/sonner';
import { Property } from '@/types/database';

export default function PropertiesShowcase() {
  const [properties, setProperties] = useState<Property[]>([]);
  const [loading, setLoading] = useState(true);
  const [likedProperties, setLikedProperties] = useState<Record<string, boolean>>({});

  useEffect(() => {
    fetchProperties();
    const likedProps = JSON.parse(localStorage.getItem('likedProperties') || '{}');
    setLikedProperties(likedProps);
  }, []);

  const fetchProperties = async () => {
    try {
      const { data, error } = await supabase
        .from('properties')
        .select('*')
        .order('created_at', { ascending: false });
        
      if (error) {
        throw error;
      }
      
      // Set default values for properties that might not have likes or sold status
      const propertiesWithDefaults = data?.map(prop => ({
        ...prop,
        likes: prop.likes || 0,
        sold: prop.sold || false,
        images: prop.images || []
      })) || [];
      
      setProperties(propertiesWithDefaults);
    } catch (error) {
      console.error('Error fetching properties:', error);
    } finally {
      setLoading(false);
    }
  };

  const sendWhatsAppMessage = (property: Property) => {
    const message = `Olá Leandro, estou interessado no imóvel: ${property.title} - ${property.ref} no valor de ${property.price}. Gostaria de mais informações.`;
    const encodedMessage = encodeURIComponent(message);
    window.open(`https://wa.me/5511991866739?text=${encodedMessage}`, '_blank');
  };

  const handleLike = async (propertyId: string) => {
    try {
      // Check if already liked
      const wasLiked = likedProperties[propertyId];
      
      // Update local state
      const newLikedProperties = { ...likedProperties };
      newLikedProperties[propertyId] = !wasLiked;
      setLikedProperties(newLikedProperties);
      
      // Store in localStorage
      localStorage.setItem('likedProperties', JSON.stringify(newLikedProperties));
      
      // Get current property
      const property = properties.find(p => p.id === propertyId);
      if (!property) return;
      
      const currentLikes = property.likes || 0;
      const newLikes = wasLiked ? Math.max(0, currentLikes - 1) : currentLikes + 1;
      
      // Update in database
      const { error } = await supabase
        .from('properties')
        .update({ likes: newLikes })
        .eq('id', propertyId);
        
      if (error) {
        throw error;
      }
      
      // Refresh properties to get updated likes count
      fetchProperties();
      
    } catch (error) {
      console.error('Error updating likes:', error);
    }
  };

  if (loading) {
    return (
      <div className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-[#253342] mb-4">
              Imóveis em Destaque
            </h2>
            <div className="flex justify-center mt-8">
              <Loader2 className="h-8 w-8 animate-spin text-[#5e9188]" />
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (properties.length === 0) {
    return (
      <div className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-[#253342] mb-4">
              Imóveis em Destaque
            </h2>
            <p className="text-gray-600 max-w-3xl mx-auto">
              Em breve, novos imóveis disponíveis.
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="py-16 bg-gray-50">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-[#253342] mb-4">
            Imóveis em Destaque
          </h2>
          <p className="text-gray-600 max-w-3xl mx-auto">
            Conheça alguns dos melhores imóveis disponíveis na região do ABC.
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {properties.map(property => (
            <div key={property.id} className="bg-white rounded-xl overflow-hidden shadow-md hover:shadow-xl transition-shadow duration-300 relative">
              <div className="relative h-56">
                {property.image_url ? (
                  <div className="relative w-full h-full">
                    <img 
                      src={property.image_url} 
                      alt={property.title}
                      className="w-full h-full object-cover"
                    />
                    {property.sold && (
                      <div className="absolute inset-0 flex items-center justify-center">
                        <div className="bg-green-500/80 text-white font-bold py-2 px-6 transform -rotate-45 text-xl w-full text-center">
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
                <div className="absolute top-3 left-3 bg-[#253342] text-white text-xs font-semibold px-2 py-1 rounded">
                  {property.type}
                </div>
                <div className="absolute bottom-3 right-3 bg-[#5e9188] text-white text-xs font-semibold px-2 py-1 rounded">
                  Ref: {property.ref}
                </div>
              </div>
              <div className="p-5">
                <h3 className="text-xl font-semibold text-gray-900 mb-2">
                  {property.title}
                </h3>
                <p className="text-gray-600 mb-1 flex items-center">
                  <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" />
                  </svg>
                  {property.location}
                </p>
                <p className="text-gray-600 mb-3">
                  {property.details}
                </p>
                <div className="flex justify-between items-center mt-4">
                  <span className="text-lg font-bold text-[#253342]">
                    {property.price}
                  </span>
                  
                  <div className="flex items-center space-x-2">
                    <Button
                      onClick={() => handleLike(property.id)}
                      size="sm"
                      variant="ghost"
                      className="flex items-center gap-1 hover:bg-pink-50"
                    >
                      <Heart
                        className={`w-5 h-5 ${likedProperties[property.id] ? 'fill-red-500 text-red-500' : 'text-gray-400'}`}
                      />
                      <span className="text-sm font-medium">{property.likes || 0}</span>
                    </Button>
                    
                    <Button
                      onClick={() => sendWhatsAppMessage(property)}
                      className="bg-green-600 hover:bg-green-700 text-white flex items-center font-medium px-4 py-2"
                      disabled={property.sold}
                    >
                      <svg className="w-4 h-4 mr-2" fill="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                        <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z"/>
                        <path d="M12 0C5.373 0 0 5.373 0 12c0 2.583.823 5.077 2.364 7.142L.236 23.656A1 1 0 001 25c.148 0 .294-.032.429-.097l4.677-2.131A11.969 11.969 0 0012 24c6.627 0 12-5.373 12-12S18.627 0 12 0zm0 22c-1.86 0-3.668-.556-5.2-1.593a1 1 0 00-.8-.107l-3.173 1.136 1.14-3.173a1 1 0 00-.107-.8A9.957 9.957 0 012 12C2 6.486 6.486 2 12 2s10 4.486 10 10-4.486 10-10 10z"/>
                      </svg>
                      {property.sold ? 'Imóvel vendido' : 'Falar com Corretor'}
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="text-center mt-12">
          <a 
            href="https://wa.me/5511991866739"
            target="_blank"
            rel="noopener noreferrer" 
            className="inline-flex items-center bg-[#5e9188] hover:bg-[#3e5954] text-white px-6 py-3 rounded-lg font-medium transition-colors"
          >
            Ver mais imóveis
            <ArrowRight className="ml-2 w-5 h-5" />
          </a>
        </div>
      </div>
    </div>
  );
}
