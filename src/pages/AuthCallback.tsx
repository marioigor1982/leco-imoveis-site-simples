
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/components/ui/sonner';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { AlertCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';

// Lista de e-mails autorizados
const AUTHORIZED_EMAILS = ['leandro@dharmaimoveis.com.br', 'admin@dharmaimoveis.com.br'];

export default function AuthCallback() {
  const navigate = useNavigate();
  const [error, setError] = useState<string | null>(null);
  const [errorDetails, setErrorDetails] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const handleAuthCallback = async () => {
      try {
        setLoading(true);
        
        // Check URL for error params from OAuth provider
        const url = new URL(window.location.href);
        const errorParam = url.searchParams.get('error');
        const errorDescriptionParam = url.searchParams.get('error_description');
        
        if (errorParam) {
          console.error("OAuth error:", errorParam, errorDescriptionParam);
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
          } else if (error.message.includes('403')) {
            setErrorDetails("Erro 403 da API do Google. Verifique se o aplicativo OAuth do Google está configurado corretamente e se o Redirect URI está cadastrado no Console do Google Cloud.");
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
      } finally {
        setLoading(false);
      }
    };
    
    handleAuthCallback();
  }, [navigate]);

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-gray-50">
      <div className="max-w-md w-full p-6 bg-white rounded-lg shadow-lg">
        {loading ? (
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#5e9188] mx-auto"></div>
            <p className="mt-4 text-lg font-medium">Autenticando...</p>
            <p className="mt-2 text-gray-500">Aguarde enquanto verificamos suas credenciais</p>
          </div>
        ) : error ? (
          <div className="space-y-4">
            <Alert variant="destructive">
              <AlertCircle className="h-4 w-4 mr-2" />
              <AlertTitle className="font-medium">Erro de Autenticação</AlertTitle>
              <AlertDescription>
                <p className="font-medium">{error}</p>
                {errorDetails && <p className="mt-2 text-sm">{errorDetails}</p>}
              </AlertDescription>
            </Alert>
            
            <div className="mt-6 space-y-4">
              <p>Redirecionando para página de login em 5 segundos...</p>
              <Button 
                variant="outline"
                className="w-full"
                onClick={() => navigate('/login')}
              >
                Voltar ao login agora
              </Button>
              
              <div className="text-sm border p-3 rounded-md bg-gray-50 mt-4">
                <p className="font-semibold mb-2">Possíveis soluções:</p>
                <ol className="list-disc text-left mx-4 space-y-1 text-xs">
                  <li>Verifique se o provedor Google está ativado no Supabase</li>
                  <li>Confira se as credenciais OAuth do Google estão configuradas corretamente</li>
                  <li>Verifique se as URLs de Site e Redirecionamento estão configuradas no Supabase</li>
                  <li>Certifique-se que o domínio do seu site está autorizado no Google Console</li>
                  <li>Verifique se a URI de redirecionamento está cadastrada no Google Console</li>
                </ol>
              </div>
            </div>
          </div>
        ) : (
          <div className="text-center">
            <div className="text-green-500 mb-4 flex justify-center">
              <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
                <polyline points="22 4 12 14.01 9 11.01"></polyline>
              </svg>
            </div>
            <h2 className="text-2xl font-bold">Login bem-sucedido!</h2>
            <p className="mt-2 text-gray-600">Redirecionando para o painel administrativo...</p>
          </div>
        )}
      </div>
    </div>
  );
}
