
import React from 'react';
import AdminHeader from '@/components/admin/AdminHeader';
import AdminNavTabs from '@/components/admin/AdminNavTabs';
import PropertyManagement from '@/components/admin/PropertyManagement';
import Analytics from '@/components/admin/Analytics';
import { useAdminDashboard } from '@/hooks/useAdminDashboard';

export default function Admin() {
  const {
    loading,
    session,
    showForm,
    setShowForm,
    editingProperty,
    setEditingProperty,
    currentDateTime,
    tab,
    setTab,
    totalProperties,
    availableProperties,
    soldProperties,
    totalLikes,
    topLikedProperties,
    handleSignOut,
    fetchDashboardData,
    formatDateTime
  } = useAdminDashboard();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#5e9188] mx-auto"></div>
          <p className="mt-4">Carregando...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <AdminHeader 
        currentDateTime={currentDateTime} 
        onSignOut={handleSignOut}
        formatDateTime={formatDateTime}
      />
      
      <AdminNavTabs 
        activeTab={tab}
        onTabChange={setTab}
        onAnalyticsClick={fetchDashboardData}
      />
      
      {tab === 'analytics' ? (
        <Analytics 
          totalProperties={totalProperties}
          availableProperties={availableProperties}
          soldProperties={soldProperties}
          totalLikes={totalLikes}
          topLikedProperties={topLikedProperties}
        />
      ) : (
        <PropertyManagement 
          showForm={showForm}
          setShowForm={setShowForm}
          editingProperty={editingProperty}
          setEditingProperty={setEditingProperty}
          onUpdateComplete={fetchDashboardData}
        />
      )}
    </div>
  );
}
