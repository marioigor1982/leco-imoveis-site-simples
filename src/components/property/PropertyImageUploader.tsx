
import React, { useState } from 'react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { toast } from '@/components/ui/sonner';
import { supabase } from '@/integrations/supabase/client';
import { Trash2, Upload } from 'lucide-react';

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
  const [uploading, setUploading] = useState(false);

  const validateFile = (file: File): boolean => {
    const maxSize = 5 * 1024 * 1024; // 5MB
    const validTypes = ['image/jpeg', 'image/png', 'image/webp', 'image/gif'];
    
    if (!validTypes.includes(file.type)) {
      toast.error(`Tipo de arquivo inválido: ${file.name}. Use apenas JPEG, PNG, WebP ou GIF.`);
      return false;
    }
    
    if (file.size > maxSize) {
      toast.error(`Arquivo muito grande: ${file.name}. Tamanho máximo: 5MB.`);
      return false;
    }
    
    return true;
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const filesArray = Array.from(e.target.files);
      
      // Verificar limite de quantidade
      if (filesArray.length > 20) {
        toast.error('Máximo de 20 imagens permitidas');
        e.target.value = '';
        return;
      }
      
      // Validar cada arquivo
      const validFiles = filesArray.filter(validateFile);
      
      if (validFiles.length !== filesArray.length) {
        e.target.value = '';
        return;
      }
      
      setImages(validFiles);
      toast.success(`${validFiles.length} imagem(ns) selecionada(s) com sucesso`);
      
      // Log dos tamanhos dos arquivos
      const fileSizes = validFiles.map(file => 
        `${file.name}: ${(file.size / (1024 * 1024)).toFixed(2)}MB`
      );
      console.log('Arquivos selecionados:', fileSizes);
    }
  };

  const uploadToSupabase = async (file: File): Promise<string> => {
    try {
      // Verificar autenticação
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        throw new Error('Usuário não autenticado para upload');
      }

      // Gerar nome único para o arquivo
      const fileExt = file.name.split('.').pop();
      const fileName = `${user.id}/${Date.now()}-${Math.random().toString(36).substring(2)}.${fileExt}`;

      console.log('Uploading file:', fileName, 'Size:', file.size);

      // Fazer upload
      const { error } = await supabase.storage
        .from('property_images')
        .upload(fileName, file, {
          cacheControl: '3600',
          upsert: false
        });

      if (error) {
        console.error('Upload error:', error);
        throw new Error(`Erro no upload: ${error.message}`);
      }

      // Obter URL pública
      const { data: { publicUrl } } = supabase.storage
        .from('property_images')
        .getPublicUrl(fileName);

      console.log('Upload successful, URL:', publicUrl);
      return publicUrl;

    } catch (error) {
      console.error('Upload failed:', error);
      throw error;
    }
  };

  const testUpload = async () => {
    if (images.length === 0) {
      toast.error('Selecione pelo menos uma imagem para testar');
      return;
    }

    setUploading(true);
    try {
      const firstImage = images[0];
      console.log('Testing upload with:', firstImage.name);
      
      const url = await uploadToSupabase(firstImage);
      toast.success(`Teste de upload bem-sucedido! URL: ${url.substring(0, 50)}...`);
      
    } catch (error: any) {
      console.error('Test upload failed:', error);
      toast.error(`Teste de upload falhou: ${error.message}`);
    } finally {
      setUploading(false);
    }
  };

  const removeImage = (index: number) => {
    const newImages = images.filter((_, i) => i !== index);
    setImages(newImages);
    
    // Ajustar índice da imagem principal se necessário
    if (index === featuredImageIndex && newImages.length > 0) {
      setFeaturedImageIndex(0);
    } else if (index < featuredImageIndex) {
      setFeaturedImageIndex(featuredImageIndex - 1);
    }
    
    toast.success('Imagem removida');
  };

  const setFeaturedImage = (index: number) => {
    setFeaturedImageIndex(index);
    toast.success('Imagem principal definida');
  };
  
  return (
    <div className="space-y-4 md:col-span-2">
      <div className="flex items-center justify-between">
        <Label htmlFor="images">Imagens (máx. 20 | máx. 5MB cada)</Label>
        {images.length > 0 && (
          <Button
            type="button"
            onClick={testUpload}
            disabled={uploading}
            variant="outline"
            size="sm"
            className="flex items-center gap-2"
          >
            <Upload className="w-4 h-4" />
            {uploading ? 'Testando...' : 'Testar Upload'}
          </Button>
        )}
      </div>
      
      <Input
        id="images"
        type="file"
        accept="image/jpeg,image/png,image/webp,image/gif"
        multiple
        onChange={handleImageChange}
        className="cursor-pointer"
      />
      
      <p className="text-xs text-gray-500">
        Selecione até 20 imagens, cada uma com no máximo 5MB. Formatos aceitos: JPEG, PNG, WebP, GIF.
      </p>
      
      {images.length > 0 && (
        <div className="mt-4">
          <Label className="text-sm font-medium">
            Escolha a imagem principal ({images.length} selecionadas)
          </Label>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3 mt-3">
            {images.map((file, index) => (
              <div 
                key={index} 
                className={`relative border-2 rounded-lg overflow-hidden transition-all duration-200 ${
                  index === featuredImageIndex 
                    ? 'border-[#5e9188] shadow-lg' 
                    : 'border-gray-200 hover:border-gray-300'
                }`}
              >
                <img
                  src={URL.createObjectURL(file)}
                  alt={`Preview ${index + 1}`}
                  className="w-full h-24 object-cover"
                />
                
                {/* Info overlay */}
                <div className="absolute bottom-0 left-0 right-0 bg-black bg-opacity-70 text-white text-xs p-1">
                  <div className="flex justify-between items-center">
                    <span>{(file.size / (1024 * 1024)).toFixed(1)}MB</span>
                    {index === featuredImageIndex && (
                      <span className="bg-[#5e9188] px-1 rounded">Principal</span>
                    )}
                  </div>
                </div>
                
                {/* Action buttons */}
                <div className="absolute top-1 right-1 flex gap-1">
                  <Button
                    type="button"
                    onClick={() => removeImage(index)}
                    size="sm"
                    variant="destructive"
                    className="w-6 h-6 p-0"
                  >
                    <Trash2 className="w-3 h-3" />
                  </Button>
                </div>
                
                {/* Click to set as featured */}
                {index !== featuredImageIndex && (
                  <button
                    type="button"
                    onClick={() => setFeaturedImage(index)}
                    className="absolute inset-0 bg-black bg-opacity-40 text-white text-xs flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity duration-200"
                  >
                    Definir como principal
                  </button>
                )}
              </div>
            ))}
          </div>
        </div>
      )}
      
      {imagePreview && !images.length && (
        <div className="mt-4">
          <Label className="text-sm font-medium">Imagem atual</Label>
          <div className="mt-2">
            <img
              src={imagePreview}
              alt="Current preview"
              className="w-full max-w-xs h-48 object-cover rounded-lg border"
            />
          </div>
        </div>
      )}

      {/* Debug info */}
      {images.length > 0 && (
        <div className="mt-2 p-2 bg-gray-50 rounded text-xs">
          <p><strong>Debug:</strong> {images.length} arquivo(s) selecionado(s)</p>
          <p><strong>Principal:</strong> {images[featuredImageIndex]?.name}</p>
          <p><strong>Tamanho total:</strong> {(images.reduce((total, file) => total + file.size, 0) / (1024 * 1024)).toFixed(2)}MB</p>
        </div>
      )}
    </div>
  );
};

export default PropertyImageUploader;
