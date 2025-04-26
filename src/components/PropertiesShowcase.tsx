
import React from 'react';
import { ArrowRight } from 'lucide-react';

export default function PropertiesShowcase() {
  const properties = [
    {
      id: 1,
      type: 'Apartamento',
      title: 'Apartamento em Santo Andre - Vila Linda',
      location: 'Santo André, SP',
      image: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?ixlib=rb-4.0.3&auto=format&fit=crop&w=1920&q=80',
      price: 'R$ 298.000',
    },
    {
      id: 2,
      type: 'Casa',
      title: 'Casa em São Bernardo do Campo - Vila Dayse',
      location: 'São Bernardo do Campo, SP',
      image: 'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?ixlib=rb-4.0.3&auto=format&fit=crop&w=1920&q=80',
      price: 'R$ 430.000',
    },
    {
      id: 3,
      type: 'Apartamento',
      title: 'Apartamento em São Bernardo do Campo - Rudge Ramos',
      location: 'São Bernardo do Campo, SP',
      image: 'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?ixlib=rb-4.0.3&auto=format&fit=crop&w=1920&q=80',
      price: 'R$ 320.000',
    }
  ];

  return (
    <div className="py-16 bg-gray-50">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-[#253342] mb-4">
            Imóveis em Destaque
          </h2>
          <p className="text-gray-600 max-w-3xl mx-auto">
            Conheça alguns dos melhores imóveis disponíveis na região do ABC.
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {properties.map(property => (
            <div key={property.id} className="bg-white rounded-xl overflow-hidden shadow-md hover:shadow-xl transition-shadow duration-300">
              <div className="relative h-56">
                <img 
                  src={property.image} 
                  alt={property.title}
                  className="w-full h-full object-cover"
                />
                <div className="absolute top-3 left-3 bg-[#253342] text-white text-xs font-semibold px-2 py-1 rounded">
                  {property.type}
                </div>
              </div>
              <div className="p-5">
                <h3 className="text-xl font-semibold text-gray-900 mb-2">
                  {property.title}
                </h3>
                <p className="text-gray-600 mb-3 flex items-center">
                  <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" />
                  </svg>
                  {property.location}
                </p>
                <div className="flex justify-between items-center mt-4">
                  <span className="text-lg font-bold text-[#253342]">
                    {property.price}
                  </span>
                  <a
                    href="https://wa.me/5511991866739"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-[#5e9188] hover:text-[#253342] transition-colors flex items-center font-medium"
                  >
                    Detalhes
                    <ArrowRight className="ml-1 w-4 h-4" />
                  </a>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
