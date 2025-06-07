
import React, { useEffect, useState } from 'react';
import { ArrowRight, Loader2 } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { Property } from '@/types/database';
import PropertyCarousel from './PropertyCarousel';

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
      console.log('Fetching properties from database...');
      const { data, error } = await supabase
        .from('properties')
        .select('*')
        .order('created_at', { ascending: false });
        
      if (error) {
        console.error('Error fetching properties:', error);
        throw error;
      }
      
      console.log('Properties fetched:', data);
      
      // Set default values for properties that might not have likes or sold status
      const propertiesWithDefaults = data?.map(prop => {
        console.log('Processing property:', prop.title, 'Image URL:', prop.image_url);
        return {
          ...prop,
          likes: prop.likes || 0,
          sold: prop.sold || false,
          images: prop.images || []
        };
      }) || [];
      
      setProperties(propertiesWithDefaults);
    } catch (error) {
      console.error('Error fetching properties:', error);
    } finally {
      setLoading(false);
    }
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

  const handlePropertyClick = (property: Property) => {
    console.log('Property clicked:', property);
    // Pode implementar modal ou navegação aqui se necessário
  };

  if (loading) {
    return (
      <div className="py-12 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-8">
            <h2 className="text-2xl md:text-3xl font-bold text-[#253342] mb-4">
              Imóveis em Destaque
            </h2>
            <div className="flex justify-center mt-6">
              <Loader2 className="h-6 w-6 animate-spin text-[#5e9188]" />
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (properties.length === 0) {
    return (
      <div className="py-12 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-8">
            <h2 className="text-2xl md:text-3xl font-bold text-[#253342] mb-4">
              Imóveis em Destaque
            </h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Em breve, novos imóveis disponíveis.
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="py-12 bg-gray-50">
      <div className="container mx-auto px-4">
        <div className="text-center mb-8">
          <h2 className="text-2xl md:text-3xl font-bold text-[#253342] mb-4">
            Imóveis em Destaque
          </h2>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Conheça alguns dos melhores imóveis disponíveis na região do ABC.
          </p>
        </div>

        <PropertyCarousel 
          properties={properties}
          onLike={handleLike}
          likedProperties={likedProperties}
          onPropertyClick={handlePropertyClick}
        />

        <div className="text-center mt-8">
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
