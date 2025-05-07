
import React, { useState } from 'react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Heart } from 'lucide-react';
import { toast } from '@/components/ui/sonner';

type PropertyImageUploaderProps = {
  images: File[];
  setImages: React.Dispatch<React.SetStateAction<File[]>>;
  imagePreview: string | null;
  featuredImageIndex: number;
  setFeaturedImageIndex: React.Dispatch<React.SetStateAction<number>>;
  currentImages: string[];
  propertyImageUrl?: string | null;
};

const PropertyImageUploader = ({
  images,
  setImages,
  imagePreview,
  featuredImageIndex,
  setFeaturedImageIndex,
  currentImages,
  propertyImageUrl
}: PropertyImageUploaderProps) => {
  
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
          // This will be handled by the parent component
          // as it manages the imagePreview state
        };
        reader.readAsDataURL(filesArray[0]);
      }
    }
  };

  const setFeaturedImage = (index: number) => {
    setFeaturedImageIndex(index);
  };
  
  return (
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
  );
};

export default PropertyImageUploader;
