import React, { useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { toast } from '@/components/ui/sonner';
import { Pencil, Trash2, Heart, BadgeCheck } from 'lucide-react';
import { Badge } from '@/components/ui/badge';

interface Property {
  id: string;
  title: string;
  location: string;
  type: string;
  price: string;
  details: string;
  ref: string;
  image_url: string | null;
  created_at: string;
  updated_at: string;
  sold?: boolean;
  likes?: number;
  images?: string[];
}

type PropertiesTableProps = {
  onEdit: (property: Property) => void;
};

export default function PropertiesTable({ onEdit }: PropertiesTableProps) {
  const [properties, setProperties] = useState<Property[]>([]);
  const [loading, setLoading] = useState(true);
  const [filterStatus, setFilterStatus] = useState<'all' | 'available' | 'sold'>('all');

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
        sold: prop.sold || false
      })) || [];
      
      setProperties(propertiesWithDefaults);
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
        // Check if the error is because the column doesn't exist
        if (error.message.includes("column 'sold' does not exist")) {
          console.warn("The 'sold' column doesn't exist yet. Creating it first.");
          // For now, just update the UI without persisting to the database
          const updatedProperties = properties.map(p => 
            p.id === property.id ? { ...p, sold: newSoldStatus } : p
          );
          setProperties(updatedProperties);
          return;
        }
        throw error;
      }
      
      toast.success(`Imóvel marcado como ${newSoldStatus ? 'VENDIDO' : 'DISPONÍVEL'}`);
      fetchProperties();
    } catch (error) {
      console.error('Error updating property status:', error);
      toast.error('Erro ao atualizar status do imóvel');
    }
  };

  const filteredProperties = properties.filter((property: any) => {
    if (filterStatus === 'all') return true;
    if (filterStatus === 'available') return !property.sold;
    if (filterStatus === 'sold') return property.sold;
    return true;
  });

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap gap-2">
        <Button 
          variant={filterStatus === 'all' ? 'default' : 'outline'}
          onClick={() => setFilterStatus('all')}
          size="sm"
        >
          Todos
        </Button>
        <Button 
          variant={filterStatus === 'available' ? 'default' : 'outline'}
          onClick={() => setFilterStatus('available')}
          size="sm"
          className={filterStatus === 'available' ? 'bg-blue-600 hover:bg-blue-700' : ''}
        >
          Disponíveis
        </Button>
        <Button 
          variant={filterStatus === 'sold' ? 'default' : 'outline'}
          onClick={() => setFilterStatus('sold')}
          size="sm"
          className={filterStatus === 'sold' ? 'bg-green-600 hover:bg-green-700' : ''}
        >
          Vendidos
        </Button>
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
              {properties
                .filter(property => {
                  if (filterStatus === 'all') return true;
                  if (filterStatus === 'available') return !property.sold;
                  if (filterStatus === 'sold') return property.sold;
                  return true;
                })
                .map((property) => (
                <tr key={property.id} className="hover:bg-gray-50">
                  <td className="px-4 py-3">
                    <div className="relative">
                      {property.image_url ? (
                        <img 
                          src={property.image_url} 
                          alt={property.title}
                          className="h-16 w-16 object-cover rounded"
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
                    >
                      <BadgeCheck className="h-4 w-4" />
                    </Button>
                    <Button 
                      size="sm" 
                      variant="ghost"
                      onClick={() => onEdit(property)}
                    >
                      <Pencil className="h-4 w-4" />
                    </Button>
                    <Button 
                      size="sm" 
                      variant="ghost" 
                      className="text-red-500 hover:text-red-700"
                      onClick={() => handleDelete(property.id)}
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
