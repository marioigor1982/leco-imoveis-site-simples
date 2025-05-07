
import React, { useEffect, useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/components/ui/sonner';
import PropertyForm from '@/components/PropertyForm';
import PropertiesTable from '@/components/PropertiesTable';
import { Button } from '@/components/ui/button';
import { Home, LayoutDashboard, Heart, Search, Plus } from 'lucide-react';
import { Badge } from '@/components/ui/badge';

// Lista de e-mails autorizados
const AUTHORIZED_EMAILS = ['leandro@dharmaimoveis.com.br', 'admin@dharmaimoveis.com.br'];

export default function Admin() {
  const [session, setSession] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingProperty, setEditingProperty] = useState(null);
  const [currentDateTime, setCurrentDateTime] = useState(new Date());
  const [tab, setTab] = useState('properties'); // properties, analytics
  const [totalProperties, setTotalProperties] = useState(0);
  const [soldProperties, setSoldProperties] = useState(0);
  const [availableProperties, setAvailableProperties] = useState(0);
  const [totalLikes, setTotalLikes] = useState(0);
  const [topLikedProperties, setTopLikedProperties] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setLoading(false);
      
      if (!session) {
        navigate('/login');
      } else {
        const userEmail = session.user.email;
        if (!AUTHORIZED_EMAILS.includes(userEmail || '')) {
          toast.error('Acesso não autorizado');
          handleSignOut();
        } else {
          fetchDashboardData();
        }
      }
    });

    const { data: authListener } = supabase.auth.onAuthStateChange(
      (event, session) => {
        setSession(session);
        if (!session) {
          navigate('/login');
        }
      }
    );

    // Update date and time every minute
    const dateTimeInterval = setInterval(() => {
      setCurrentDateTime(new Date());
    }, 60000);

    return () => {
      authListener?.subscription?.unsubscribe();
      clearInterval(dateTimeInterval);
    };
  }, [navigate]);

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

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    navigate('/login');
  };

  const handleEditProperty = (property) => {
    setEditingProperty(property);
    setShowForm(true);
  };

  const formatDateTime = (date) => {
    return new Intl.DateTimeFormat('pt-BR', {
      dateStyle: 'full',
      timeStyle: 'short'
    }).format(date);
  };

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
      <div className="flex flex-col gap-4 mb-6">
        <div className="flex justify-between items-center">
          <div>
            <Link to="/">
              <Button variant="outline" className="flex items-center gap-2">
                <Home size={18} />
                Voltar ao site
              </Button>
            </Link>
          </div>
          <div className="text-right text-sm text-gray-600">
            {formatDateTime(currentDateTime)}
          </div>
        </div>
        
        <div className="flex justify-between items-center">
          <h1 className="text-2xl md:text-3xl font-bold text-[#253342]">
            Painel do Corretor
          </h1>
          <Button
            onClick={handleSignOut}
            variant="outline"
            className="border-red-500 text-red-500 hover:bg-red-50"
          >
            Sair
          </Button>
        </div>
      </div>
      
      {/* Dashboard Tabs */}
      <div className="flex border-b mb-6">
        <button
          onClick={() => setTab('properties')}
          className={`px-4 py-2 font-medium ${
            tab === 'properties'
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
            setTab('analytics');
            fetchDashboardData();
          }}
          className={`px-4 py-2 font-medium ${
            tab === 'analytics'
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
      
      {tab === 'analytics' ? (
        <div className="space-y-8">
          {/* Stats Grid */}
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
          
          {/* Most Liked Properties */}
          <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-100">
            <h3 className="text-lg font-medium mb-4">Imóveis Mais Curtidos</h3>
            
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Imóvel
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Localização
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Status
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Curtidas
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {topLikedProperties.length > 0 ? (
                    topLikedProperties.map((property) => (
                      <tr key={property.id}>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center">
                            <div className="flex-shrink-0 h-10 w-10">
                              {property.image_url ? (
                                <img className="h-10 w-10 rounded-full object-cover" src={property.image_url} alt="" />
                              ) : (
                                <div className="h-10 w-10 rounded-full bg-gray-200 flex items-center justify-center text-gray-500">
                                  <Home size={16} />
                                </div>
                              )}
                            </div>
                            <div className="ml-4">
                              <div className="text-sm font-medium text-gray-900">{property.title}</div>
                              <div className="text-sm text-gray-500">{property.price}</div>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-gray-900">{property.location}</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          {property.sold ? (
                            <Badge variant="outline" className="bg-green-100 text-green-800">
                              VENDIDO
                            </Badge>
                          ) : (
                            <Badge variant="outline" className="bg-blue-100 text-blue-800">
                              DISPONÍVEL
                            </Badge>
                          )}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center">
                            <Heart className="h-4 w-4 text-red-500 mr-1" />
                            <span className="text-sm text-gray-900">{property.likes || 0}</span>
                          </div>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan={4} className="px-6 py-4 text-center text-sm text-gray-500">
                        Nenhum imóvel com curtidas encontrado
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      ) : !showForm ? (
        <div className="space-y-6">
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
            onEdit={handleEditProperty} 
            onUpdateComplete={fetchDashboardData} 
          />
        </div>
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
              fetchDashboardData();
            }}
          />
        </div>
      )}
    </div>
  );
}
