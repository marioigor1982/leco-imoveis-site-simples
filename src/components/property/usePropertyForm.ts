
import { useState } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/components/ui/sonner';
import { Property, PropertyInsert } from '@/types/database';

export const usePropertyForm = (property: Property | undefined, onComplete: () => void) => {
  const [formData, setFormData] = useState({
    title: property?.title || '',
    location: property?.location || '',
    type: property?.type || '',
    price: property?.price || '',
    details: property?.details || '',
    ref: property?.ref || `REF${Math.floor(Math.random() * 1000000).toString().padStart(6, '0')}`,
    image_url: property?.image_url || '',
    sold: property?.sold || false,
    likes: property?.likes || 0
  });
  
  const [images, setImages] = useState<File[]>([]);
  const [loading, setLoading] = useState(false);
  const [imagePreview, setImagePreview] = useState<string | null>(property?.image_url || null);
  const [featuredImageIndex, setFeaturedImageIndex] = useState<number>(0);
  const [currentImages, setCurrentImages] = useState<string[]>(property?.images || []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSoldChange = (checked: boolean) => {
    setFormData((prev) => ({ ...prev, sold: checked }));
  };

  const validateForm = () => {
    if (!formData.title) {
      toast.error('Por favor, adicione um título');
      return false;
    }
    if (!formData.price) {
      toast.error('Por favor, adicione um valor');
      return false;
    }
    if (!formData.details) {
      toast.error('Por favor, adicione uma descrição');
      return false;
    }
    if (images.length === 0 && !property) {
      toast.error('Por favor, adicione pelo menos uma imagem');
      return false;
    }
    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) return;
    
    setLoading(true);
    
    try {
      let image_url = formData.image_url;
      let allImageUrls: string[] = [];
      
      // Upload images if selected
      if (images.length > 0) {
        const imagePromises = images.map(async (image, index) => {
          const filePath = `${uuidv4()}-${image.name}`;
          const { data: uploadData, error: uploadError } = await supabase.storage
            .from('property_images')
            .upload(filePath, image);
            
          if (uploadError) {
            throw uploadError;
          }

          // Get the public URL
          const { data: publicUrlData } = supabase.storage
            .from('property_images')
            .getPublicUrl(filePath);
            
          const imageUrl = publicUrlData.publicUrl;
          
          // Set the featured image as the main image_url
          if (index === featuredImageIndex) {
            image_url = imageUrl;
          }
          
          return imageUrl;
        });
        
        allImageUrls = await Promise.all(imagePromises);
      } else {
        allImageUrls = currentImages;
      }
      
      const propertyData: PropertyInsert = {
        ...formData,
        image_url,
        images: allImageUrls,
      };
      
      let response;
      
      if (property) {
        // Update existing property
        response = await supabase
          .from('properties')
          .update(propertyData)
          .eq('id', property.id);
      } else {
        // Insert new property
        response = await supabase
          .from('properties')
          .insert([propertyData]);
      }
      
      if (response.error) {
        throw response.error;
      }
      
      toast.success(property ? 'Imóvel atualizado com sucesso' : 'Imóvel adicionado com sucesso', {
        position: 'top-center',
        style: {
          backgroundColor: '#5e9188',
          color: 'white',
          border: '2px solid #3e5954'
        }
      });
      onComplete();
      
    } catch (error: any) {
      console.error('Error saving property:', error);
      toast.error('Erro ao salvar imóvel', {
        description: error.message
      });
    } finally {
      setLoading(false);
    }
  };

  return {
    formData,
    images,
    loading,
    imagePreview,
    featuredImageIndex,
    currentImages,
    setImages,
    setImagePreview,
    setFeaturedImageIndex,
    handleChange,
    handleSoldChange,
    handleSubmit
  };
};
