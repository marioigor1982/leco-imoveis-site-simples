
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import PropertyFormFields from './property/PropertyFormFields';
import PropertyStatusToggle from './property/PropertyStatusToggle';
import PropertyImageUploader from './property/PropertyImageUploader';
import { usePropertyForm } from './property/usePropertyForm';

type PropertyFormProps = {
  property?: any; // Existing property data for editing
  onComplete: () => void;
};

export default function PropertyForm({ property, onComplete }: PropertyFormProps) {
  const {
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
  } = usePropertyForm(property, onComplete);
  
  return (
    <Card>
      <CardContent className="pt-6">
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <PropertyFormFields 
              formData={formData} 
              handleChange={handleChange} 
            />
            
            <PropertyStatusToggle 
              sold={formData.sold} 
              onSoldChange={handleSoldChange}
              likes={formData.likes} 
            />
            
            <PropertyImageUploader 
              images={images}
              setImages={setImages}
              imagePreview={imagePreview}
              featuredImageIndex={featuredImageIndex}
              setFeaturedImageIndex={setFeaturedImageIndex}
              currentImages={currentImages}
              propertyImageUrl={formData.image_url}
            />
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
