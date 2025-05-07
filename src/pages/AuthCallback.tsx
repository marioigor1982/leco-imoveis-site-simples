
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/components/ui/sonner';
import { Alert, AlertDescription } from '@/components/ui/alert';

// Lista de e-mails autorizados
const AUTHORIZED_EMAILS = ['leandro@dharmaimoveis.com.br', 'admin@dharmaimoveis.com.br'];

export default function AuthCallback() {
  const navigate = useNavigate();
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const handleAuthCallback = async () => {
      try {
        const { data, error } = await supabase.auth.getSession();
        
        if (error) {
          console.error("Authentication error:", error);
          setError(`Erro na autenticação: ${error.message}`);
          toast.error('Erro na autenticação');
          setTimeout(() => navigate('/login'), 5000);
          return;
        }
        
        if (data.session) {
          const userEmail = data.session.user.email;
          
          if (AUTHORIZED_EMAILS.includes(userEmail || '')) {
            toast.success('Login realizado com sucesso');
            navigate('/admin');
          } else {
            setError(`E-mail não autorizado: ${userEmail}`);
            toast.error('Acesso não autorizado');
            await supabase.auth.signOut();
            setTimeout(() => navigate('/login'), 5000);
          }
        } else {
          setError('Sessão não encontrada');
          navigate('/login');
        }
      } catch (err: any) {
        console.error("Error during auth callback:", err);
        setError(`Erro durante autenticação: ${err.message}`);
        setTimeout(() => navigate('/login'), 5000);
      }
    };
    
    handleAuthCallback();
  }, [navigate]);

  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="text-center max-w-md p-6 bg-white rounded-lg shadow-lg">
        {error ? (
          <div className="space-y-4">
            <Alert variant="destructive">
              <AlertDescription>{error}</AlertDescription>
            </Alert>
            <p className="mt-4">Redirecionando para página de login em 5 segundos...</p>
          </div>
        ) : (
          <div>
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#5e9188] mx-auto"></div>
            <p className="mt-4">Autenticando...</p>
          </div>
        )}
      </div>
    </div>
  );
}
