
import React from 'react';
import { LayoutDashboard, Heart } from 'lucide-react';

type AdminNavTabsProps = {
  activeTab: 'properties' | 'analytics';
  onTabChange: (tab: 'properties' | 'analytics') => void;
  onAnalyticsClick: () => void;
};

const AdminNavTabs = ({ activeTab, onTabChange, onAnalyticsClick }: AdminNavTabsProps) => {
  return (
    <div className="flex border-b mb-6">
      <button
        onClick={() => onTabChange('properties')}
        className={`px-4 py-2 font-medium ${
          activeTab === 'properties'
            ? 'text-[#5e9188] border-b-2 border-[#5e9188]'
            : 'text-gray-500'
        }`}
      >
        <div className="flex items-center gap-2">
          <LayoutDashboard size={20} />
          <span>Gerenciar Imóveis</span>
        </div>
      </button>
      <button
        onClick={() => {
          onTabChange('analytics');
          onAnalyticsClick();
        }}
        className={`px-4 py-2 font-medium ${
          activeTab === 'analytics'
            ? 'text-[#5e9188] border-b-2 border-[#5e9188]'
            : 'text-gray-500'
        }`}
      >
        <div className="flex items-center gap-2">
          <Heart size={20} />
          <span>Estatísticas</span>
        </div>
      </button>
    </div>
  );
};

export default AdminNavTabs;
