
import React, { useState } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/components/ui/sonner';
import { Card, CardContent } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';

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
  });
  
  const [image, setImage] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const [imagePreview, setImagePreview] = useState<string | null>(property?.image_url || null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };
  
  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setImage(file);
      
      // Create preview
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      let image_url = formData.image_url;
      
      // Upload image if selected
      if (image) {
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
          
        image_url = publicUrlData.publicUrl;
      }
      
      const propertyData = {
        ...formData,
        image_url
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
      
      toast.success(property ? 'Imóvel atualizado com sucesso' : 'Imóvel adicionado com sucesso');
      onComplete();
      
    } catch (error) {
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
              <Label htmlFor="price">Preço</Label>
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
            
            <div className="space-y-2">
              <Label htmlFor="image">Imagem</Label>
              <Input
                id="image"
                type="file"
                accept="image/*"
                onChange={handleImageChange}
                className="cursor-pointer"
              />
              {imagePreview && (
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
