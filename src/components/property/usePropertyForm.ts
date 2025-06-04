
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
    console.log('Validating form with data:', formData);
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
    console.log('Form validation passed');
    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Form submission started');
    
    if (!validateForm()) {
      console.log('Form validation failed');
      return;
    }
    
    setLoading(true);
    
    try {
      let image_url = formData.image_url;
      let allImageUrls: string[] = [];
      
      console.log('Starting image upload process, images count:', images.length);
      
      // Upload images if selected
      if (images.length > 0) {
        console.log('Uploading images to storage...');
        const imagePromises = images.map(async (image, index) => {
          console.log(`Uploading image ${index + 1}/${images.length}:`, image.name);
          const filePath = `${uuidv4()}-${image.name}`;
          
          const { data: uploadData, error: uploadError } = await supabase.storage
            .from('property_images')
            .upload(filePath, image);
            
          if (uploadError) {
            console.error('Image upload error:', uploadError);
            throw uploadError;
          }

          console.log('Image uploaded successfully:', uploadData);

          // Get the public URL
          const { data: publicUrlData } = supabase.storage
            .from('property_images')
            .getPublicUrl(filePath);
            
          const imageUrl = publicUrlData.publicUrl;
          console.log('Generated public URL:', imageUrl);
          
          // Set the featured image as the main image_url
          if (index === featuredImageIndex) {
            image_url = imageUrl;
            console.log('Set as featured image URL:', imageUrl);
          }
          
          return imageUrl;
        });
        
        allImageUrls = await Promise.all(imagePromises);
        console.log('All images uploaded successfully:', allImageUrls);
      } else {
        console.log('No new images to upload, using existing images');
        allImageUrls = currentImages;
      }
      
      const propertyData: PropertyInsert = {
        ...formData,
        image_url,
        images: allImageUrls,
      };
      
      console.log('Preparing to save property data:', propertyData);
      
      let response;
      
      if (property) {
        console.log('Updating existing property with ID:', property.id);
        // Update existing property
        response = await supabase
          .from('properties')
          .update(propertyData)
          .eq('id', property.id);
      } else {
        console.log('Inserting new property');
        // Insert new property
        response = await supabase
          .from('properties')
          .insert([propertyData]);
      }
      
      console.log('Database operation response:', response);
      
      if (response.error) {
        console.error('Database operation error:', response.error);
        throw response.error;
      }
      
      console.log('Property saved successfully');
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
      console.error('Error details:', {
        message: error.message,
        code: error.code,
        details: error.details,
        hint: error.hint
      });
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
