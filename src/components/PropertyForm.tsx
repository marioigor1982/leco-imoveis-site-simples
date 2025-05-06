
import React, { useState } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/components/ui/sonner';
import { Card, CardContent } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { Heart } from 'lucide-react';

type PropertyFormProps = {
  property?: any; // Existing property data for editing
  onComplete: () => void;
};

export default function PropertyForm({ property, onComplete }: PropertyFormProps) {
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
  
  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const filesArray = Array.from(e.target.files);
      
      if (filesArray.length > 20) {
        toast.error('Máximo de 20 imagens permitidas');
        return;
      }
      
      setImages(filesArray);
      
      // Create preview for first image
      if (filesArray.length > 0) {
        const reader = new FileReader();
        reader.onloadend = () => {
          setImagePreview(reader.result as string);
        };
        reader.readAsDataURL(filesArray[0]);
      }
    }
  };

  const setFeaturedImage = (index: number) => {
    setFeaturedImageIndex(index);
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
      
      const propertyData = {
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
  
  return (
    <Card>
      <CardContent className="pt-6">
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <Label htmlFor="title">Título do Imóvel</Label>
              <Input
                id="title"
                name="title"
                value={formData.title}
                onChange={handleChange}
                placeholder="Apartamento em São Bernardo do Campo"
                required
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="location">Localização</Label>
              <Input
                id="location"
                name="location"
                value={formData.location}
                onChange={handleChange}
                placeholder="São Bernardo do Campo, SP"
                required
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="type">Tipo</Label>
              <Input
                id="type"
                name="type"
                value={formData.type}
                onChange={handleChange}
                placeholder="Apartamento, Casa, Sobrado, etc."
                required
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="price">Valor (R$)</Label>
              <Input
                id="price"
                name="price"
                value={formData.price}
                onChange={handleChange}
                placeholder="R$ 000.000"
                required
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="ref">Referência</Label>
              <Input
                id="ref"
                name="ref"
                value={formData.ref}
                onChange={handleChange}
                placeholder="REF000123"
                required
              />
            </div>
            
            <div className="space-y-2 flex items-center">
              <div className="flex flex-col space-y-2">
                <Label htmlFor="sold">Marcar como vendido</Label>
                <div className="flex items-center space-x-2">
                  <Switch 
                    id="sold" 
                    checked={formData.sold} 
                    onCheckedChange={handleSoldChange}
                  />
                  <span className={formData.sold ? 'text-green-600 font-medium' : 'text-gray-500'}>
                    {formData.sold ? 'VENDIDO' : 'DISPONÍVEL'}
                  </span>
                </div>
              </div>
              <div className="flex items-center ml-8">
                <div className="flex items-center space-x-2">
                  <Heart className="w-5 h-5 text-red-500" />
                  <span className="text-gray-700 font-medium">
                    {formData.likes || 0} curtidas
                  </span>
                </div>
              </div>
            </div>
            
            <div className="space-y-2 md:col-span-2">
              <Label htmlFor="images">Imagens (máx. 20)</Label>
              <Input
                id="images"
                type="file"
                accept="image/*"
                multiple
                onChange={handleImageChange}
                className="cursor-pointer"
              />
              <p className="text-xs text-gray-500">Selecione até 20 imagens. A primeira imagem será usada como destaque.</p>
              
              {images.length > 0 && (
                <div className="mt-2">
                  <Label>Escolha a imagem principal</Label>
                  <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-2 mt-2">
                    {images.map((file, index) => (
                      <div key={index} className={`relative border-2 rounded-md overflow-hidden ${index === featuredImageIndex ? 'border-[#5e9188]' : 'border-gray-200'}`}>
                        <img
                          src={URL.createObjectURL(file)}
                          alt={`Preview ${index + 1}`}
                          className="w-full h-24 object-cover"
                        />
                        <button
                          type="button"
                          onClick={() => setFeaturedImage(index)}
                          className={`absolute inset-0 flex items-center justify-center bg-black bg-opacity-40 text-white text-sm ${index === featuredImageIndex ? 'opacity-100' : 'opacity-0 hover:opacity-100'} transition-opacity`}
                        >
                          {index === featuredImageIndex ? 'Principal' : 'Definir como principal'}
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              )}
              
              {imagePreview && !images.length && (
                <div className="mt-2">
                  <img
                    src={imagePreview}
                    alt="Preview"
                    className="w-full h-48 object-cover rounded-md"
                  />
                </div>
              )}
            </div>
            
            <div className="space-y-2 md:col-span-2">
              <Label htmlFor="details">Detalhes</Label>
              <Textarea
                id="details"
                name="details"
                value={formData.details}
                onChange={handleChange}
                placeholder="3 dormitórios, 2 banheiros, 1 vaga"
                rows={4}
                required
              />
            </div>
          </div>
          
          <div className="flex justify-end space-x-4">
            <Button
              type="button"
              variant="outline"
              onClick={onComplete}
              disabled={loading}
            >
              Cancelar
            </Button>
            <Button
              type="submit"
              className="bg-[#5e9188] hover:bg-[#3e5954]"
              disabled={loading}
            >
              {loading ? 'Salvando...' : property ? 'Atualizar Imóvel' : 'Adicionar Imóvel'}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}
