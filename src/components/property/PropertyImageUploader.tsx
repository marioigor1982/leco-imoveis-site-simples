
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
      
      // Verificar limite de quantidade
      if (filesArray.length > 20) {
        toast.error('Máximo de 20 imagens permitidas');
        return;
      }
      
      // Verificar tamanho de cada arquivo (5MB = 5 * 1024 * 1024 bytes)
      const maxSize = 5 * 1024 * 1024; // 5MB
      const oversizedFiles = filesArray.filter(file => file.size > maxSize);
      
      if (oversizedFiles.length > 0) {
        const fileNames = oversizedFiles.map(file => file.name).join(', ');
        toast.error(`As seguintes imagens excedem o limite de 5MB: ${fileNames}`);
        // Limpar o input
        e.target.value = '';
        return;
      }
      
      // Mostrar informação sobre tamanhos dos arquivos válidos
      const fileSizes = filesArray.map(file => `${file.name}: ${(file.size / (1024 * 1024)).toFixed(2)}MB`);
      console.log('Arquivos selecionados:', fileSizes);
      
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
      
      toast.success(`${filesArray.length} imagem(ns) selecionada(s) com sucesso`);
    }
  };

  const setFeaturedImage = (index: number) => {
    setFeaturedImageIndex(index);
  };
  
  return (
    <div className="space-y-2 md:col-span-2">
      <Label htmlFor="images">Imagens (máx. 20 | máx. 5MB cada)</Label>
      <Input
        id="images"
        type="file"
        accept="image/*"
        multiple
        onChange={handleImageChange}
        className="cursor-pointer"
      />
      <p className="text-xs text-gray-500">
        Selecione até 20 imagens, cada uma com no máximo 5MB. A primeira imagem será usada como destaque.
      </p>
      
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
                <div className="absolute bottom-0 left-0 right-0 bg-black bg-opacity-50 text-white text-xs p-1">
                  {(file.size / (1024 * 1024)).toFixed(2)}MB
                </div>
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
