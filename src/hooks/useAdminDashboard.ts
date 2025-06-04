
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Property } from '@/types/database';

export const useAdminDashboard = () => {
  const [showForm, setShowForm] = useState(false);
  const [editingProperty, setEditingProperty] = useState<Property | null>(null);
  const [currentDateTime, setCurrentDateTime] = useState(new Date());
  const [tab, setTab] = useState<'properties' | 'analytics' | 'dashboard'>('dashboard');
  const [totalProperties, setTotalProperties] = useState(0);
  const [soldProperties, setSoldProperties] = useState(0);
  const [availableProperties, setAvailableProperties] = useState(0);
  const [totalLikes, setTotalLikes] = useState(0);
  const [topLikedProperties, setTopLikedProperties] = useState<Property[]>([]);

  useEffect(() => {
    fetchDashboardData();

    // Update date and time every minute
    const dateTimeInterval = setInterval(() => {
      setCurrentDateTime(new Date());
    }, 60000);

    return () => {
      clearInterval(dateTimeInterval);
    };
  }, []);

  const fetchDashboardData = async () => {
    try {
      // Get total counts
      const { data: allProperties, error: countError } = await supabase
        .from('properties')
        .select('*');
      
      if (countError) throw countError;
      
      const sold = allProperties?.filter(p => p.sold).length || 0;
      const available = allProperties?.filter(p => !p.sold).length || 0;
      
      setTotalProperties(allProperties?.length || 0);
      setSoldProperties(sold);
      setAvailableProperties(available);
      
      // Calculate total likes
      const likesCount = allProperties?.reduce((sum, property) => sum + (property.likes || 0), 0) || 0;
      setTotalLikes(likesCount);
      
      // Get top 5 properties by likes
      const sortedByLikes = [...(allProperties || [])]
        .sort((a, b) => (b.likes || 0) - (a.likes || 0))
        .slice(0, 5);
      
      setTopLikedProperties(sortedByLikes);
      
    } catch (error) {
      console.error("Error fetching dashboard data:", error);
    }
  };

  const formatDateTime = (date: Date) => {
    return new Intl.DateTimeFormat('pt-BR', {
      dateStyle: 'full',
      timeStyle: 'short'
    }).format(date);
  };

  return {
    showForm,
    setShowForm,
    editingProperty,
    setEditingProperty,
    currentDateTime,
    tab,
    setTab,
    totalProperties,
    soldProperties,
    availableProperties,
    totalLikes,
    topLikedProperties,
    fetchDashboardData,
    formatDateTime
  };
};
