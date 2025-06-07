
import React from 'react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

type PropertyFiltersProps = {
  selectedType: string;
  selectedStatus: string;
  onTypeChange: (value: string) => void;
  onStatusChange: (value: string) => void;
  resultCount: number;
};

const PropertyFilters = ({ 
  selectedType, 
  selectedStatus, 
  onTypeChange, 
  onStatusChange, 
  resultCount 
}: PropertyFiltersProps) => {
  const propertyTypes = [
    { value: 'all', label: 'Todos os tipos' },
    { value: 'Casa', label: 'Casa' },
    { value: 'Sobrado', label: 'Sobrado' },
    { value: 'Apartamento', label: 'Apartamento' },
    { value: 'Kitnet', label: 'Kitnet' },
    { value: 'Comercial', label: 'Comercial' },
    { value: 'Terreno', label: 'Terreno' },
    { value: 'Chácara', label: 'Chácara' },
    { value: 'Cobertura', label: 'Cobertura' },
    { value: 'Studio', label: 'Studio' }
  ];

  const statusOptions = [
    { value: 'all', label: 'Todos' },
    { value: 'available', label: 'Disponíveis' },
    { value: 'sold', label: 'Vendidos' }
  ];

  return (
    <>
      {/* Filtros */}
      <div className="mb-6 flex flex-wrap gap-4 justify-center">
        <div className="flex items-center gap-2 bg-white p-3 rounded-lg shadow-sm border">
          <Select value={selectedType} onValueChange={onTypeChange}>
            <SelectTrigger className="w-48 border-0 shadow-none">
              <SelectValue placeholder="Filtrar por tipo" />
            </SelectTrigger>
            <SelectContent>
              {propertyTypes.map((type) => (
                <SelectItem key={type.value} value={type.value}>
                  {type.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="flex items-center gap-2 bg-white p-3 rounded-lg shadow-sm border">
          <Select value={selectedStatus} onValueChange={onStatusChange}>
            <SelectTrigger className="w-48 border-0 shadow-none">
              <SelectValue placeholder="Status do imóvel" />
            </SelectTrigger>
            <SelectContent>
              {statusOptions.map((status) => (
                <SelectItem key={status.value} value={status.value}>
                  {status.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Contador de resultados */}
      <div className="text-center mb-6">
        <p className="text-sm text-gray-600">
          {resultCount} imóvel(is) encontrado(s)
        </p>
      </div>
    </>
  );
};

export default PropertyFilters;
