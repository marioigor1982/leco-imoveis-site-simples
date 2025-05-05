
import React, { useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { toast } from '@/components/ui/sonner';
import { Pencil, Trash2 } from 'lucide-react';

type PropertiesTableProps = {
  onEdit: (property: any) => void;
};

export default function PropertiesTable({ onEdit }: PropertiesTableProps) {
  const [properties, setProperties] = useState([]);
  const [loading, setLoading] = useState(true);

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
      
      setProperties(data || []);
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

  if (loading) {
    return (
      <div className="text-center py-8">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#5e9188] mx-auto"></div>
        <p className="mt-4">Carregando imóveis...</p>
      </div>
    );
  }

  if (properties.length === 0) {
    return (
      <div className="text-center py-16 bg-gray-50 rounded-lg">
        <h3 className="text-lg font-medium text-gray-600">Nenhum imóvel cadastrado</h3>
        <p className="text-gray-500 mt-2">Clique em "Adicionar Novo Imóvel" para começar.</p>
      </div>
    );
  }

  return (
    <div className="overflow-x-auto">
      <table className="w-full text-sm text-left">
        <thead className="bg-gray-100">
          <tr>
            <th className="px-4 py-3">Imagem</th>
            <th className="px-4 py-3">Título</th>
            <th className="px-4 py-3">Local</th>
            <th className="px-4 py-3">Tipo</th>
            <th className="px-4 py-3">Preço</th>
            <th className="px-4 py-3">Ref.</th>
            <th className="px-4 py-3 text-right">Ações</th>
          </tr>
        </thead>
        <tbody className="divide-y">
          {properties.map((property) => (
            <tr key={property.id} className="hover:bg-gray-50">
              <td className="px-4 py-3">
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
              </td>
              <td className="px-4 py-3 font-medium">{property.title}</td>
              <td className="px-4 py-3">{property.location}</td>
              <td className="px-4 py-3">{property.type}</td>
              <td className="px-4 py-3">{property.price}</td>
              <td className="px-4 py-3">{property.ref}</td>
              <td className="px-4 py-3 text-right space-x-2">
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
  );
}
