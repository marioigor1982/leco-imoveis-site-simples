
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

  const checkAuthAndUser = async () => {
    try {
      console.log('Checking authentication...');
      
      // First check if we have a session
      const { data: { session }, error: sessionError } = await supabase.auth.getSession();
      
      if (sessionError) {
        console.error('Session error:', sessionError);
        throw new Error('Erro ao verificar sessão. Faça login novamente.');
      }

      if (!session) {
        console.error('No session found');
        throw new Error('Usuário não autenticado. Faça login novamente.');
      }

      if (!session.user) {
        console.error('No user in session');
        throw new Error('Sessão inválida. Faça login novamente.');
      }

      console.log('User authenticated:', session.user.email);
      
      // Additional check: verify the session is still valid by making a test call
      const { error: testError } = await supabase.from('properties').select('id').limit(1);
      if (testError && testError.message.includes('JWT')) {
        console.error('Session expired:', testError);
        throw new Error('Sessão expirada. Faça login novamente.');
      }

      return session.user;
    } catch (error: any) {
      console.error('Auth check failed:', error);
      
      // If authentication fails, redirect to login
      if (error.message.includes('não autenticado') || error.message.includes('expirada') || error.message.includes('inválida')) {
        toast.error(error.message, {
          description: 'Redirecionando para a página de login...'
        });
        setTimeout(() => {
          window.location.href = '/login';
        }, 2000);
      }
      
      throw error;
    }
  };

  const uploadImageToStorage = async (image: File): Promise<string> => {
    try {
      const user = await checkAuthAndUser();

      const fileExt = image.name.split('.').pop();
      const fileName = `${user.id}/${Date.now()}-${Math.random().toString(36).substring(2)}.${fileExt}`;
      
      console.log(`Uploading image: ${fileName}`);
      
      const { error: uploadError } = await supabase.storage
        .from('property_images')
        .upload(fileName, image, {
          cacheControl: '3600',
          upsert: false
        });
        
      if (uploadError) {
        console.error('Upload error:', uploadError);
        throw new Error(`Erro no upload: ${uploadError.message}`);
      }

      const { data: { publicUrl } } = supabase.storage
        .from('property_images')
        .getPublicUrl(fileName);
        
      console.log('Generated public URL:', publicUrl);
      return publicUrl;
      
    } catch (error) {
      console.error('Error uploading image:', error);
      throw error;
    }
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
      // Check authentication first
      const user = await checkAuthAndUser();
      console.log('User verified for property creation:', user.email);

      let image_url = formData.image_url;
      let allImageUrls: string[] = [];
      
      console.log('Starting image upload process, images count:', images.length);
      
      if (images.length > 0) {
        console.log('Uploading images to storage...');
        
        const uploadPromises = images.map(async (image, index) => {
          console.log(`Uploading image ${index + 1}/${images.length}:`, image.name);
          
          const imageUrl = await uploadImageToStorage(image);
          
          if (index === featuredImageIndex) {
            image_url = imageUrl;
            console.log('Set as featured image URL:', imageUrl);
          }
          
          return imageUrl;
        });
        
        allImageUrls = await Promise.all(uploadPromises);
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
        response = await supabase
          .from('properties')
          .update(propertyData)
          .eq('id', property.id);
      } else {
        console.log('Inserting new property');
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
      
      if (error.message && (error.message.includes('não autenticado') || error.message.includes('expirada') || error.message.includes('inválida'))) {
        // Already handled in checkAuthAndUser
        return;
      } else {
        toast.error('Erro ao salvar imóvel', {
          description: error.message || 'Erro desconhecido'
        });
      }
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
