
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/components/ui/sonner';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { AlertCircle } from 'lucide-react';

// Lista de e-mails autorizados
const AUTHORIZED_EMAILS = ['leandro@dharmaimoveis.com.br', 'admin@dharmaimoveis.com.br'];

export default function AuthCallback() {
  const navigate = useNavigate();
  const [error, setError] = useState<string | null>(null);
  const [errorDetails, setErrorDetails] = useState<string | null>(null);

  useEffect(() => {
    const handleAuthCallback = async () => {
      try {
        // Check URL for error params from OAuth provider
        const url = new URL(window.location.href);
        const errorParam = url.searchParams.get('error');
        const errorDescriptionParam = url.searchParams.get('error_description');
        
        if (errorParam) {
          setError(`Erro na autenticação: ${errorParam}`);
          setErrorDetails(errorDescriptionParam || 'Detalhes não disponíveis');
          toast.error('Erro na autenticação OAuth');
          setTimeout(() => navigate('/login'), 5000);
          return;
        }
        
        const { data, error } = await supabase.auth.getSession();
        
        if (error) {
          console.error("Authentication error:", error);
          setError(`Erro na autenticação: ${error.message}`);
          
          if (error.message.includes('invalid site url')) {
            setErrorDetails("Site URL não configurada corretamente no Supabase. Verifique as configurações de Authentication > URL Configuration.");
          } else if (error.message.includes('requested path is invalid')) {
            setErrorDetails("URL de redirecionamento inválido. Verifique se as URLs de Site e Redirecionamento estão configuradas no Supabase.");
          } else {
            setErrorDetails(error.message);
          }
          
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
            setErrorDetails('Apenas e-mails específicos têm permissão para acessar esta área. Entre em contato com o administrador.');
            toast.error('Acesso não autorizado');
            await supabase.auth.signOut();
            setTimeout(() => navigate('/login'), 5000);
          }
        } else {
          setError('Sessão não encontrada');
          setErrorDetails('A autenticação não retornou uma sessão válida. Tente novamente.');
          navigate('/login');
        }
      } catch (err: any) {
        console.error("Error during auth callback:", err);
        setError(`Erro durante autenticação`);
        setErrorDetails(err.message || 'Erro desconhecido');
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
              <AlertCircle className="h-4 w-4 mr-2" />
              <AlertTitle className="font-medium">Erro de Autenticação</AlertTitle>
              <AlertDescription>
                <p className="font-medium">{error}</p>
                {errorDetails && <p className="mt-2 text-sm">{errorDetails}</p>}
              </AlertDescription>
            </Alert>
            <p className="mt-4">Redirecionando para página de login em 5 segundos...</p>
            <a 
              href="/login" 
              className="text-blue-600 hover:underline block mt-2"
            >
              Voltar ao login agora
            </a>
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
