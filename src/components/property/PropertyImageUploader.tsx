
import React, { useState } from 'react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { toast } from '@/components/ui/sonner';
import { supabase } from '@/integrations/supabase/client';
import { Trash2, Upload, CheckCircle, AlertCircle } from 'lucide-react';

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
  const [uploadStatus, setUploadStatus] = useState<'idle' | 'testing' | 'success' | 'error'>('idle');

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
      
      if (filesArray.length > 20) {
        toast.error('Máximo de 20 imagens permitidas');
        e.target.value = '';
        return;
      }
      
      const validFiles = filesArray.filter(validateFile);
      
      if (validFiles.length !== filesArray.length) {
        e.target.value = '';
        return;
      }
      
      setImages(validFiles);
      setUploadStatus('idle');
      toast.success(`${validFiles.length} imagem(ns) selecionada(s) com sucesso`);
    }
  };

  const uploadToSupabase = async (file: File): Promise<string> => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        throw new Error('Usuário não autenticado para upload');
      }

      const fileExt = file.name.split('.').pop();
      const fileName = `${user.id}/${Date.now()}-${Math.random().toString(36).substring(2)}.${fileExt}`;

      console.log('Uploading file:', fileName, 'Size:', file.size);

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
    setUploadStatus('testing');
    
    try {
      const firstImage = images[0];
      console.log('Testing upload with:', firstImage.name);
      
      const url = await uploadToSupabase(firstImage);
      setUploadStatus('success');
      toast.success('✅ Teste de upload bem-sucedido! As imagens estão funcionando corretamente.');
      
      // Testar se a URL é acessível
      const img = new Image();
      img.onload = () => {
        console.log('Image URL is accessible:', url);
      };
      img.onerror = () => {
        console.warn('Image URL may not be immediately accessible:', url);
      };
      img.src = url;
      
    } catch (error: any) {
      console.error('Test upload failed:', error);
      setUploadStatus('error');
      toast.error(`❌ Teste de upload falhou: ${error.message}`);
    } finally {
      setUploading(false);
    }
  };

  const removeImage = (index: number) => {
    const newImages = images.filter((_, i) => i !== index);
    setImages(newImages);
    
    if (index === featuredImageIndex && newImages.length > 0) {
      setFeaturedImageIndex(0);
    } else if (index < featuredImageIndex) {
      setFeaturedImageIndex(featuredImageIndex - 1);
    }
    
    setUploadStatus('idle');
    toast.success('Imagem removida');
  };

  const setFeaturedImage = (index: number) => {
    setFeaturedImageIndex(index);
    toast.success('Imagem principal definida');
  };

  const getStatusIcon = () => {
    switch (uploadStatus) {
      case 'testing':
        return <div className="animate-spin w-4 h-4 border-2 border-blue-500 border-t-transparent rounded-full" />;
      case 'success':
        return <CheckCircle className="w-4 h-4 text-green-500" />;
      case 'error':
        return <AlertCircle className="w-4 h-4 text-red-500" />;
      default:
        return <Upload className="w-4 h-4" />;
    }
  };

  const getStatusText = () => {
    switch (uploadStatus) {
      case 'testing':
        return 'Testando...';
      case 'success':
        return 'Sucesso!';
      case 'error':
        return 'Erro no teste';
      default:
        return 'Testar Upload';
    }
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
            className={`flex items-center gap-2 ${
              uploadStatus === 'success' ? 'border-green-500 text-green-600' :
              uploadStatus === 'error' ? 'border-red-500 text-red-600' : ''
            }`}
          >
            {getStatusIcon()}
            {getStatusText()}
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
      
      <div className="text-xs text-gray-500 space-y-1">
        <p>Selecione até 20 imagens, cada uma com no máximo 5MB.</p>
        <p>Formatos aceitos: JPEG, PNG, WebP, GIF.</p>
        {uploadStatus === 'success' && (
          <p className="text-green-600 font-medium">✅ Sistema de upload funcionando corretamente!</p>
        )}
      </div>
      
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
                    ? 'border-[#5e9188] shadow-lg ring-2 ring-[#5e9188]/30' 
                    : 'border-gray-200 hover:border-gray-300'
                }`}
              >
                <img
                  src={URL.createObjectURL(file)}
                  alt={`Preview ${index + 1}`}
                  className="w-full h-24 object-cover"
                />
                
                <div className="absolute bottom-0 left-0 right-0 bg-black/70 text-white text-xs p-1">
                  <div className="flex justify-between items-center">
                    <span>{(file.size / (1024 * 1024)).toFixed(1)}MB</span>
                    {index === featuredImageIndex && (
                      <span className="bg-[#5e9188] px-1 rounded text-xs">Principal</span>
                    )}
                  </div>
                </div>
                
                <div className="absolute top-1 right-1">
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
                
                {index !== featuredImageIndex && (
                  <button
                    type="button"
                    onClick={() => setFeaturedImage(index)}
                    className="absolute inset-0 bg-black/40 text-white text-xs flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity duration-200"
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
    </div>
  );
};

export default PropertyImageUploader;
