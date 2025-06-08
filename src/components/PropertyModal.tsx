
import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Property } from '@/types/database';
import ImageResizer from './ImageResizer';
import { Heart, MapPin } from 'lucide-react';
import { Button } from './ui/button';

type PropertyModalProps = {
  property: Property | null;
  isOpen: boolean;
  onClose: () => void;
  isLiked: boolean;
  onLike: (propertyId: string) => void;
};

const PropertyModal = ({ property, isOpen, onClose, isLiked, onLike }: PropertyModalProps) => {
  if (!property) return null;

  const sendWhatsAppMessage = (property: Property) => {
    const message = `Olá Leandro, estou interessado no imóvel: ${property.title} - ${property.ref} no valor de ${property.price}. Gostaria de mais informações.`;
    const encodedMessage = encodeURIComponent(message);
    window.open(`https://wa.me/5511991866739?text=${encodedMessage}`, '_blank');
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold text-[#253342]">
            {property.title}
          </DialogTitle>
        </DialogHeader>
        
        <div className="space-y-4">
          {/* Imagem Principal */}
          <div className="relative rounded-lg overflow-hidden">
            {property.image_url ? (
              <div className="relative">
                <ImageResizer
                  src={property.image_url}
                  alt={property.title}
                  className="w-full"
                  fallbackText="Imagem indisponível"
                  width={730}
                  height={479}
                />
                {property.sold && (
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="bg-green-500/90 text-white font-bold py-2 px-6 transform -rotate-45 text-lg w-full text-center">
                      VENDIDO
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <div className="w-full h-64 bg-gray-200 flex items-center justify-center">
                <p className="text-gray-500">Sem imagem</p>
              </div>
            )}
          </div>

          {/* Informações do Imóvel */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center text-gray-600">
                <MapPin className="w-4 h-4 mr-1" />
                <span>{property.location}</span>
              </div>
              <div className="flex items-center space-x-2">
                <span className="bg-[#253342] text-white text-xs font-semibold px-2 py-1 rounded">
                  {property.type}
                </span>
                <span className="bg-[#5e9188] text-white text-xs font-semibold px-2 py-1 rounded">
                  Ref: {property.ref}
                </span>
              </div>
            </div>

            <div className="text-2xl font-bold text-[#253342]">
              {property.price}
            </div>

            <div className="text-gray-700">
              <h4 className="font-semibold mb-2">Detalhes:</h4>
              <p className="leading-relaxed">{property.details}</p>
            </div>

            {/* Galeria de Imagens (se existir) */}
            {property.images && property.images.length > 1 && (
              <div>
                <h4 className="font-semibold mb-2 text-gray-700">Galeria:</h4>
                <div className="grid grid-cols-2 gap-2">
                  {property.images.slice(1, 5).map((imageUrl, index) => (
                    <div key={index} className="rounded overflow-hidden">
                      <ImageResizer
                        src={imageUrl}
                        alt={`${property.title} - Imagem ${index + 2}`}
                        className="w-full"
                        fallbackText="Imagem indisponível"
                        width={365}
                        height={239}
                      />
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Ações */}
            <div className="flex items-center justify-between pt-4 border-t">
              <Button
                onClick={() => onLike(property.id)}
                variant="ghost"
                className="flex items-center gap-2 hover:bg-pink-50"
              >
                <Heart
                  className={`w-5 h-5 ${isLiked ? 'fill-red-500 text-red-500' : 'text-gray-400'}`}
                />
                <span className="font-medium">{property.likes || 0} curtidas</span>
              </Button>
              
              <Button
                onClick={() => sendWhatsAppMessage(property)}
                className="bg-green-600 hover:bg-green-700 text-white flex items-center font-medium px-4 py-2"
                disabled={property.sold}
              >
                <svg className="w-4 h-4 mr-2" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z"/>
                  <path d="M12 0C5.373 0 0 5.373 0 12c0 2.583.823 5.077 2.364 7.142L.236 23.656A1 1 0 001 25c.148 0 .294-.032.429-.097l4.677-2.131A11.969 11.969 0 0012 24c6.627 0 12-5.373 12-12S18.627 0 12 0zm0 22c-1.86 0-3.668-.556-5.2-1.593a1 1 0 00-.8-.107l-3.173 1.136 1.14-3.173a1 1 0 00-.107-.8A9.957 9.957 0 012 12C2 6.486 6.486 2 12 2s10 4.486 10 10-4.486 10-10 10z"/>
                </svg>
                {property.sold ? 'Vendido' : 'Entrar em contato'}
              </Button>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default PropertyModal;
