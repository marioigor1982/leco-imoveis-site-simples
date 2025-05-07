
import React from 'react';
import { Search, Home, Heart } from 'lucide-react';

type DashboardStatsProps = {
  totalProperties: number;
  availableProperties: number;
  soldProperties: number;
  totalLikes: number;
};

const DashboardStats = ({ 
  totalProperties, 
  availableProperties, 
  soldProperties, 
  totalLikes 
}: DashboardStatsProps) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
      <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100">
        <div className="flex justify-between items-start">
          <div>
            <p className="text-gray-500 text-sm">Total de Imóveis</p>
            <h3 className="text-3xl font-bold mt-1">{totalProperties}</h3>
          </div>
          <div className="bg-blue-100 p-3 rounded-full">
            <Search className="h-6 w-6 text-blue-600" />
          </div>
        </div>
      </div>
      
      <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100">
        <div className="flex justify-between items-start">
          <div>
            <p className="text-gray-500 text-sm">Imóveis Disponíveis</p>
            <h3 className="text-3xl font-bold mt-1">{availableProperties}</h3>
          </div>
          <div className="bg-green-100 p-3 rounded-full">
            <Home className="h-6 w-6 text-green-600" />
          </div>
        </div>
      </div>
      
      <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100">
        <div className="flex justify-between items-start">
          <div>
            <p className="text-gray-500 text-sm">Imóveis Vendidos</p>
            <h3 className="text-3xl font-bold mt-1">{soldProperties}</h3>
          </div>
          <div className="bg-green-100 p-3 rounded-full">
            <Home className="h-6 w-6 text-green-600" />
          </div>
        </div>
      </div>
      
      <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100">
        <div className="flex justify-between items-start">
          <div>
            <p className="text-gray-500 text-sm">Total de Curtidas</p>
            <h3 className="text-3xl font-bold mt-1">{totalLikes}</h3>
          </div>
          <div className="bg-red-100 p-3 rounded-full">
            <Heart className="h-6 w-6 text-red-500" />
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardStats;
