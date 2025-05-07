
import React from 'react';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';

type FormData = {
  title: string;
  location: string;
  type: string;
  price: string;
  details: string;
  ref: string;
};

type PropertyFormFieldsProps = {
  formData: FormData;
  handleChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
};

const PropertyFormFields = ({ formData, handleChange }: PropertyFormFieldsProps) => {
  return (
    <>
      <div className="space-y-2">
        <Label htmlFor="title">Título do Imóvel</Label>
        <Input
          id="title"
          name="title"
          value={formData.title}
          onChange={handleChange}
          placeholder="Apartamento em São Bernardo do Campo"
          required
        />
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="location">Localização</Label>
        <Input
          id="location"
          name="location"
          value={formData.location}
          onChange={handleChange}
          placeholder="São Bernardo do Campo, SP"
          required
        />
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="type">Tipo</Label>
        <Input
          id="type"
          name="type"
          value={formData.type}
          onChange={handleChange}
          placeholder="Apartamento, Casa, Sobrado, etc."
          required
        />
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="price">Valor (R$)</Label>
        <Input
          id="price"
          name="price"
          value={formData.price}
          onChange={handleChange}
          placeholder="R$ 000.000"
          required
        />
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="ref">Referência</Label>
        <Input
          id="ref"
          name="ref"
          value={formData.ref}
          onChange={handleChange}
          placeholder="REF000123"
          required
        />
      </div>
      
      <div className="space-y-2 md:col-span-2">
        <Label htmlFor="details">Detalhes</Label>
        <Textarea
          id="details"
          name="details"
          value={formData.details}
          onChange={handleChange}
          placeholder="3 dormitórios, 2 banheiros, 1 vaga"
          rows={4}
          required
        />
      </div>
    </>
  );
};

export default PropertyFormFields;
