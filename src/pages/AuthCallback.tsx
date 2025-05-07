
import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/components/ui/sonner';

// Lista de e-mails autorizados
const AUTHORIZED_EMAILS = ['leandro@dharmaimoveis.com.br', 'admin@dharmaimoveis.com.br'];

export default function AuthCallback() {
  const navigate = useNavigate();

  useEffect(() => {
    const handleAuthCallback = async () => {
      const { data, error } = await supabase.auth.getSession();
      
      if (error) {
        toast.error('Erro na autenticação');
        navigate('/login');
        return;
      }
      
      if (data.session) {
        const userEmail = data.session.user.email;
        
        if (AUTHORIZED_EMAILS.includes(userEmail || '')) {
          toast.success('Login realizado com sucesso');
          navigate('/admin');
        } else {
          toast.error('Acesso não autorizado');
          await supabase.auth.signOut();
          navigate('/login');
        }
      } else {
        navigate('/login');
      }
    };
    
    handleAuthCallback();
  }, [navigate]);

  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#5e9188] mx-auto"></div>
        <p className="mt-4">Autenticando...</p>
      </div>
    </div>
  );
}
