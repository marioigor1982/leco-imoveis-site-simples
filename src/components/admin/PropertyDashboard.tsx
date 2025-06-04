
import React, { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Download, FileText, FileSpreadsheet } from 'lucide-react';
import { toast } from '@/components/ui/sonner';
import { Property } from '@/types/database';

const PropertyDashboard = () => {
  const [properties, setProperties] = useState<Property[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<'all' | 'available' | 'sold'>('all');

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
        
      if (error) throw error;
      
      setProperties(data || []);
    } catch (error) {
      console.error('Error fetching properties:', error);
      toast.error('Erro ao buscar imóveis');
    } finally {
      setLoading(false);
    }
  };

  const filteredProperties = properties.filter((property) => {
    if (filter === 'all') return true;
    if (filter === 'available') return !property.sold;
    if (filter === 'sold') return property.sold;
    return true;
  });

  const exportToCSV = () => {
    const csvContent = [
      ['Título do Imóvel', 'Tipo', 'Localização', 'Valor (R$)', 'Status'],
      ...filteredProperties.map(property => [
        property.title,
        property.type,
        property.location,
        property.price,
        property.sold ? 'VENDIDO' : 'DISPONÍVEL'
      ])
    ].map(row => row.join(',')).join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = `imoveis_${filter}_${new Date().toISOString().split('T')[0]}.csv`;
    link.click();
    toast.success('Arquivo CSV exportado com sucesso!');
  };

  const exportToPDF = () => {
    // Criar uma tabela HTML simples para impressão
    const printWindow = window.open('', '_blank');
    if (printWindow) {
      const htmlContent = `
        <html>
          <head>
            <title>Relatório de Imóveis</title>
            <style>
              body { font-family: Arial, sans-serif; margin: 20px; }
              table { width: 100%; border-collapse: collapse; margin-top: 20px; }
              th, td { border: 1px solid #ddd; padding: 8px; text-align: left; }
              th { background-color: #f2f2f2; font-weight: bold; }
              h1 { color: #5e9188; text-align: center; }
              .summary { margin-bottom: 20px; }
            </style>
          </head>
          <body>
            <h1>Relatório de Imóveis - ${filter === 'all' ? 'TODOS' : filter === 'available' ? 'DISPONÍVEIS' : 'VENDIDOS'}</h1>
            <div class="summary">
              <p><strong>Data do Relatório:</strong> ${new Date().toLocaleDateString('pt-BR')}</p>
              <p><strong>Total de Imóveis:</strong> ${filteredProperties.length}</p>
            </div>
            <table>
              <thead>
                <tr>
                  <th>Título do Imóvel</th>
                  <th>Tipo</th>
                  <th>Localização</th>
                  <th>Valor (R$)</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                ${filteredProperties.map(property => `
                  <tr>
                    <td>${property.title}</td>
                    <td>${property.type}</td>
                    <td>${property.location}</td>
                    <td>${property.price}</td>
                    <td>${property.sold ? 'VENDIDO' : 'DISPONÍVEL'}</td>
                  </tr>
                `).join('')}
              </tbody>
            </table>
          </body>
        </html>
      `;
      
      printWindow.document.write(htmlContent);
      printWindow.document.close();
      printWindow.print();
      toast.success('Relatório PDF preparado para impressão!');
    }
  };

  if (loading) {
    return (
      <div className="text-center py-8">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#5e9188] mx-auto"></div>
        <p className="mt-4">Carregando dashboard...</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap justify-between items-center gap-4">
        <h2 className="text-2xl font-bold text-gray-800">Dashboard de Imóveis</h2>
        
        <div className="flex flex-wrap gap-2">
          <Button
            onClick={exportToCSV}
            variant="outline"
            size="sm"
            className="flex items-center gap-2"
          >
            <FileSpreadsheet size={16} />
            Exportar Excel
          </Button>
          <Button
            onClick={exportToPDF}
            variant="outline"
            size="sm"
            className="flex items-center gap-2"
          >
            <FileText size={16} />
            Exportar PDF
          </Button>
        </div>
      </div>

      {/* Filtros */}
      <div className="flex flex-wrap gap-2">
        <Button
          variant={filter === 'all' ? 'default' : 'outline'}
          onClick={() => setFilter('all')}
          size="sm"
          className={filter === 'all' ? 'bg-[#5e9188] hover:bg-[#3e5954]' : ''}
        >
          TODOS ({properties.length})
        </Button>
        <Button
          variant={filter === 'available' ? 'default' : 'outline'}
          onClick={() => setFilter('available')}
          size="sm"
          className={filter === 'available' ? 'bg-blue-600 hover:bg-blue-700' : ''}
        >
          DISPONÍVEL ({properties.filter(p => !p.sold).length})
        </Button>
        <Button
          variant={filter === 'sold' ? 'default' : 'outline'}
          onClick={() => setFilter('sold')}
          size="sm"
          className={filter === 'sold' ? 'bg-green-600 hover:bg-green-700' : ''}
        >
          VENDIDO ({properties.filter(p => p.sold).length})
        </Button>
      </div>

      {/* Tabela Simplificada */}
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Título do Imóvel
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Tipo
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Localização
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Valor (R$)
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredProperties.length > 0 ? (
                filteredProperties.map((property) => (
                  <tr key={property.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">{property.title}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">{property.type}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">{property.location}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">{property.price}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {property.sold ? (
                        <span className="inline-flex px-2 py-1 text-xs font-semibold rounded-full bg-green-100 text-green-800">
                          VENDIDO
                        </span>
                      ) : (
                        <span className="inline-flex px-2 py-1 text-xs font-semibold rounded-full bg-blue-100 text-blue-800">
                          DISPONÍVEL
                        </span>
                      )}
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={5} className="px-6 py-4 text-center text-sm text-gray-500">
                    {filter === 'all' 
                      ? 'Nenhum imóvel cadastrado' 
                      : `Nenhum imóvel ${filter === 'available' ? 'disponível' : 'vendido'} encontrado`
                    }
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Resumo */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-blue-50 p-4 rounded-lg">
          <h3 className="text-lg font-semibold text-blue-800">Total de Imóveis</h3>
          <p className="text-2xl font-bold text-blue-600">{properties.length}</p>
        </div>
        <div className="bg-green-50 p-4 rounded-lg">
          <h3 className="text-lg font-semibold text-green-800">Disponíveis</h3>
          <p className="text-2xl font-bold text-green-600">{properties.filter(p => !p.sold).length}</p>
        </div>
        <div className="bg-red-50 p-4 rounded-lg">
          <h3 className="text-lg font-semibold text-red-800">Vendidos</h3>
          <p className="text-2xl font-bold text-red-600">{properties.filter(p => p.sold).length}</p>
        </div>
      </div>
    </div>
  );
};

export default PropertyDashboard;
