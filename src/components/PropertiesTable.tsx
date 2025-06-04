
import React, { useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { toast } from '@/components/ui/sonner';
import { Pencil, Trash2, Heart, BadgeCheck } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Property } from '@/types/database';

type PropertiesTableProps = {
  onEdit: (property: Property) => void;
  onUpdateComplete?: () => void;
};

export default function PropertiesTable({ onEdit, onUpdateComplete }: PropertiesTableProps) {
  const [properties, setProperties] = useState<Property[]>([]);
  const [loading, setLoading] = useState(true);
  const [filterStatus, setFilterStatus] = useState<'all' | 'available' | 'sold'>('all');
  const [propertyCount, setPropertyCount] = useState(0);

  useEffect(() => {
    fetchProperties();
  }, []);

  const fetchProperties = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('properties')
        .select('*')
        .order('created_at', { ascending: false });
        
      if (error) {
        throw error;
      }
      
      // Set default values for properties that might not have certain fields
      const propertiesWithDefaults = data?.map(prop => ({
        ...prop,
        likes: prop.likes || 0,
        sold: prop.sold || false,
        images: prop.images || []
      })) || [];
      
      setProperties(propertiesWithDefaults);
      setPropertyCount(propertiesWithDefaults.length);

      if (onUpdateComplete) {
        onUpdateComplete();
      }
    } catch (error) {
      console.error('Error fetching properties:', error);
      toast.error('Erro ao buscar imóveis');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Tem certeza que deseja excluir este imóvel?')) {
      return;
    }
    
    try {
      const { error } = await supabase
        .from('properties')
        .delete()
        .eq('id', id);
        
      if (error) {
        throw error;
      }
      
      toast.success('Imóvel excluído com sucesso');
      fetchProperties();
    } catch (error) {
      console.error('Error deleting property:', error);
      toast.error('Erro ao excluir imóvel');
    }
  };

  const toggleSoldStatus = async (property: Property) => {
    try {
      const newSoldStatus = !property.sold;
      
      const { error } = await supabase
        .from('properties')
        .update({ sold: newSoldStatus })
        .eq('id', property.id);
        
      if (error) {
        throw error;
      }
      
      toast.success(`Imóvel marcado como ${newSoldStatus ? 'VENDIDO' : 'DISPONÍVEL'}`);
      fetchProperties();
    } catch (error) {
      console.error('Error updating property status:', error);
      toast.error('Erro ao atualizar status do imóvel');
    }
  };

  const handleEditClick = (property: Property) => {
    console.log('Edit button clicked for property:', property.id);
    onEdit(property);
  };

  const filteredProperties = properties.filter((property) => {
    if (filterStatus === 'all') return true;
    if (filterStatus === 'available') return !property.sold;
    if (filterStatus === 'sold') return property.sold;
    return true;
  });

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap justify-between items-center">
        <div className="flex flex-wrap gap-2">
          <Button 
            variant={filterStatus === 'all' ? 'default' : 'outline'}
            onClick={() => setFilterStatus('all')}
            size="sm"
          >
            Todos ({properties.length})
          </Button>
          <Button 
            variant={filterStatus === 'available' ? 'default' : 'outline'}
            onClick={() => setFilterStatus('available')}
            size="sm"
            className={filterStatus === 'available' ? 'bg-blue-600 hover:bg-blue-700' : ''}
          >
            Disponíveis ({properties.filter(p => !p.sold).length})
          </Button>
          <Button 
            variant={filterStatus === 'sold' ? 'default' : 'outline'}
            onClick={() => setFilterStatus('sold')}
            size="sm"
            className={filterStatus === 'sold' ? 'bg-green-600 hover:bg-green-700' : ''}
          >
            Vendidos ({properties.filter(p => p.sold).length})
          </Button>
        </div>
        <div className="text-sm text-gray-600 mt-2 md:mt-0">
          {propertyCount >= 200 ? (
            <span className="text-yellow-600 font-medium">
              Limite máximo de 200 imóveis atingido ({propertyCount}/200)
            </span>
          ) : (
            <span>
              Total de imóveis: {propertyCount}/200
            </span>
          )}
        </div>
      </div>
      
      {loading ? (
        <div className="text-center py-8">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#5e9188] mx-auto"></div>
          <p className="mt-4">Carregando imóveis...</p>
        </div>
      ) : properties.length === 0 ? (
        <div className="text-center py-16 bg-gray-50 rounded-lg">
          <h3 className="text-lg font-medium text-gray-600">Nenhum imóvel cadastrado</h3>
          <p className="text-gray-500 mt-2">Clique em "Adicionar Novo Imóvel" para começar.</p>
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left">
            <thead className="bg-gray-100">
              <tr>
                <th className="px-4 py-3">Imagem</th>
                <th className="px-4 py-3">Título</th>
                <th className="px-4 py-3">Local</th>
                <th className="px-4 py-3">Tipo</th>
                <th className="px-4 py-3">Preço</th>
                <th className="px-4 py-3">Status</th>
                <th className="px-4 py-3">Curtidas</th>
                <th className="px-4 py-3 text-right">Ações</th>
              </tr>
            </thead>
            <tbody className="divide-y">
              {filteredProperties.map((property) => (
                <tr key={property.id} className="hover:bg-gray-50">
                  <td className="px-4 py-3">
                    <div className="relative">
                      {property.image_url ? (
                        <img 
                          src={property.image_url} 
                          alt={property.title}
                          className="h-16 w-16 object-cover rounded"
                          onError={(e) => {
                            console.error('Table image load error:', property.image_url);
                            const target = e.target as HTMLImageElement;
                            target.style.display = 'none';
                            const parent = target.parentElement;
                            if (parent) {
                              parent.innerHTML = '<div class="h-16 w-16 bg-gray-200 rounded flex items-center justify-center text-gray-500 text-xs">Erro</div>';
                            }
                          }}
                        />
                      ) : (
                        <div className="h-16 w-16 bg-gray-200 rounded flex items-center justify-center text-gray-500">
                          Sem imagem
                        </div>
                      )}
                      {property.sold && (
                        <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-50 rounded">
                          <span className="text-green-400 font-bold text-xs transform -rotate-45">VENDIDO</span>
                        </div>
                      )}
                    </div>
                  </td>
                  <td className="px-4 py-3 font-medium">{property.title}</td>
                  <td className="px-4 py-3">{property.location}</td>
                  <td className="px-4 py-3">{property.type}</td>
                  <td className="px-4 py-3">{property.price}</td>
                  <td className="px-4 py-3">
                    {property.sold ? (
                      <Badge variant="outline" className="bg-green-100 text-green-800 hover:bg-green-200">
                        VENDIDO
                      </Badge>
                    ) : (
                      <Badge variant="outline" className="bg-blue-100 text-blue-800 hover:bg-blue-200">
                        DISPONÍVEL
                      </Badge>
                    )}
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center">
                      <Heart className="h-4 w-4 text-red-500 mr-1" />
                      <span>{property.likes || 0}</span>
                    </div>
                  </td>
                  <td className="px-4 py-3 text-right space-x-2">
                    <Button 
                      size="sm" 
                      variant="ghost"
                      onClick={() => toggleSoldStatus(property)}
                      className={property.sold ? "text-blue-600 hover:text-blue-800" : "text-green-600 hover:text-green-800"}
                      title={property.sold ? "Marcar como disponível" : "Marcar como vendido"}
                    >
                      <BadgeCheck className="h-4 w-4" />
                    </Button>
                    <Button 
                      size="sm" 
                      variant="ghost"
                      onClick={() => handleEditClick(property)}
                      title="Editar imóvel"
                      className="text-gray-600 hover:text-gray-800"
                    >
                      <Pencil className="h-4 w-4" />
                    </Button>
                    <Button 
                      size="sm" 
                      variant="ghost" 
                      className="text-red-500 hover:text-red-700"
                      onClick={() => handleDelete(property.id)}
                      title="Excluir imóvel"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
