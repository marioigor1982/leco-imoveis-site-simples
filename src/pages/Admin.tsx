
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/components/ui/sonner';
import PropertyForm from '@/components/PropertyForm';
import PropertiesTable from '@/components/PropertiesTable';
import { Button } from '@/components/ui/button';

export default function Admin() {
  const [session, setSession] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingProperty, setEditingProperty] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setLoading(false);
      if (!session) {
        navigate('/login');
      } else if (session.user.email !== 'leandro@dharmaimoveis.com.br') {
        toast.error('Acesso não autorizado');
        handleSignOut();
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

    return () => {
      authListener?.subscription?.unsubscribe();
    };
  }, [navigate]);

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    navigate('/login');
  };

  const handleEditProperty = (property) => {
    setEditingProperty(property);
    setShowForm(true);
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
      <div className="flex justify-between items-center mb-6">
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
      
      {!showForm ? (
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
              Adicionar Novo Imóvel
            </Button>
          </div>
          <PropertiesTable onEdit={handleEditProperty} />
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
            }}
          />
        </div>
      )}
    </div>
  );
}
