
import React from 'react';
import { Button } from '@/components/ui/button';
import { BarChart3, Home, Plus } from 'lucide-react';

type AdminNavTabsProps = {
  activeTab: 'properties' | 'analytics' | 'dashboard';
  onTabChange: (tab: 'properties' | 'analytics' | 'dashboard') => void;
  onAnalyticsClick?: () => void;
};

const AdminNavTabs = ({ activeTab, onTabChange, onAnalyticsClick }: AdminNavTabsProps) => {
  const handleTabClick = (tab: 'properties' | 'analytics' | 'dashboard') => {
    onTabChange(tab);
    if (tab === 'analytics' && onAnalyticsClick) {
      onAnalyticsClick();
    }
  };

  return (
    <div className="flex flex-wrap gap-2 mb-6">
      <Button
        onClick={() => handleTabClick('properties')}
        variant={activeTab === 'properties' ? 'default' : 'outline'}
        className={`flex items-center gap-2 ${activeTab === 'properties' ? 'bg-[#5e9188] hover:bg-[#3e5954]' : ''}`}
      >
        <Plus size={18} />
        Gerenciar Imóveis
      </Button>
      
      <Button
        onClick={() => handleTabClick('dashboard')}
        variant={activeTab === 'dashboard' ? 'default' : 'outline'}
        className={`flex items-center gap-2 ${activeTab === 'dashboard' ? 'bg-[#5e9188] hover:bg-[#3e5954]' : ''}`}
      >
        <Home size={18} />
        Dashboard
      </Button>
      
      <Button
        onClick={() => handleTabClick('analytics')}
        variant={activeTab === 'analytics' ? 'default' : 'outline'}
        className={`flex items-center gap-2 ${activeTab === 'analytics' ? 'bg-[#5e9188] hover:bg-[#3e5954]' : ''}`}
      >
        <BarChart3 size={18} />
        Analytics
      </Button>
    </div>
  );
};

export default AdminNavTabs;
