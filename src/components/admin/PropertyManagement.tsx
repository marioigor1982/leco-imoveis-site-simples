
import React from 'react';
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';
import PropertyForm from '@/components/PropertyForm';
import PropertiesTable from '@/components/PropertiesTable';

type Property = {
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
  sold: boolean;
  likes: number;
  images?: string[];
};

type PropertyManagementProps = {
  showForm: boolean;
  setShowForm: (show: boolean) => void;
  editingProperty: Property | null;
  setEditingProperty: (property: Property | null) => void;
  onUpdateComplete: () => void;
};

const PropertyManagement = ({ 
  showForm, 
  setShowForm, 
  editingProperty, 
  setEditingProperty,
  onUpdateComplete 
}: PropertyManagementProps) => {
  return (
    <div className="space-y-6">
      {!showForm ? (
        <>
          <div className="flex justify-between items-center">
            <h2 className="text-xl font-semibold">Meus Imóveis</h2>
            <Button 
              onClick={() => {
                setEditingProperty(null);
                setShowForm(true);
              }}
              className="bg-[#5e9188] hover:bg-[#3e5954]"
            >
              <Plus size={18} className="mr-2" />
              Adicionar Novo Imóvel
            </Button>
          </div>
          <PropertiesTable 
            onEdit={setEditingProperty} 
            onUpdateComplete={onUpdateComplete} 
          />
        </>
      ) : (
        <div className="space-y-6">
          <div className="flex justify-between items-center">
            <h2 className="text-xl font-semibold">
              {editingProperty ? 'Editar Imóvel' : 'Novo Imóvel'}
            </h2>
            <Button 
              onClick={() => setShowForm(false)}
              variant="outline"
            >
              Voltar para Lista
            </Button>
          </div>
          <PropertyForm 
            property={editingProperty}
            onComplete={() => {
              setShowForm(false);
              setEditingProperty(null);
              onUpdateComplete();
            }}
          />
        </div>
      )}
    </div>
  );
};

export default PropertyManagement;
