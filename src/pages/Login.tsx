
import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Home, AlertCircle, User, LogIn } from 'lucide-react';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/components/ui/sonner';

// Import our new components
import LoginForm from '@/components/auth/LoginForm';
import RegisterForm from '@/components/auth/RegisterForm';
import GoogleLoginButton from '@/components/auth/GoogleLoginButton';
import AuthSetupInstructions from '@/components/auth/AuthSetupInstructions';

// Lista de e-mails autorizados
const AUTHORIZED_EMAILS = ['leandro@dharmaimoveis.com.br', 'admin@dharmaimoveis.com.br'];

export default function Login() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<string>("login");
  const navigate = useNavigate();

  useEffect(() => {
    // Check if user is already logged in
    const checkSession = async () => {
      const { data } = await supabase.auth.getSession();
      if (data.session) {
        const userEmail = data.session.user.email;
        if (AUTHORIZED_EMAILS.includes(userEmail || '')) {
          navigate('/admin');
        } else {
          await supabase.auth.signOut();
          toast.error('Acesso não autorizado');
        }
      }
    };
    
    checkSession();
  }, [navigate]);

  const handleTabChange = (value: string) => {
    setActiveTab(value);
    setError(null); // Clear any errors when switching tabs
  };

  const handleLoginSuccess = () => {
    navigate('/auth-callback');
  };

  const handleRegisterSuccess = () => {
    setActiveTab("login");
  };

  return (
    <div 
      className="min-h-screen flex items-center justify-center p-4"
      style={{
        backgroundImage: "url('https://imgs.search.brave.com/JJD01FDbiTKtGlutmVK2fCdPvCVqSOg1aK4-S3nfKUI/rs:fit:860:0:0:0/g:ce/aHR0cHM6Ly9zdGF0/aWMtaW1hZ2VzLmxv/cGVzLmNvbS5ici9l/eHRlcm5hbC1saW5r/L3NodXR0ZXJzdG9j/a18yMzQ3Nzg4MDYz/LmpwZWc')",
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundRepeat: "no-repeat"
      }}
    >
      <Card className="w-full max-w-md shadow-lg bg-white/95 backdrop-blur-sm">
        <CardHeader className="space-y-1">
          <div className="flex justify-between items-center">
            <Link to="/" className="flex items-center text-gray-600 hover:text-[#5e9188] transition-colors">
              <Home className="mr-1 h-5 w-5" />
              <span>Voltar ao site</span>
            </Link>
          </div>
          <CardTitle className="text-2xl font-bold text-center">Área do Corretor</CardTitle>
          <CardDescription className="text-center">
            Acesse sua conta ou cadastre-se para gerenciar imóveis
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {error && (
            <Alert variant="destructive" className="mb-4 text-left">
              <AlertCircle className="h-4 w-4 mr-2" />
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          <Tabs value={activeTab} onValueChange={handleTabChange}>
            <TabsList className="grid w-full grid-cols-2 mb-4">
              <TabsTrigger value="login" className="flex items-center gap-1">
                <LogIn className="h-4 w-4" />
                Entrar
              </TabsTrigger>
              <TabsTrigger value="register" className="flex items-center gap-1">
                <User className="h-4 w-4" />
                Cadastrar
              </TabsTrigger>
            </TabsList>
            
            <TabsContent value="login">
              <LoginForm onSuccess={handleLoginSuccess} setError={setError} />

              <div className="relative mt-6">
                <div className="absolute inset-0 flex items-center">
                  <span className="w-full border-t" />
                </div>
                <div className="relative flex justify-center text-xs uppercase">
                  <span className="bg-white px-2 text-gray-500">ou continue com</span>
                </div>
              </div>

              <div className="mt-4">
                <GoogleLoginButton setError={setError} />
              </div>
            </TabsContent>
            
            <TabsContent value="register">
              <RegisterForm onSuccess={handleRegisterSuccess} setError={setError} />
            </TabsContent>
          </Tabs>
        </CardContent>
        <CardFooter>
          <div className="w-full text-center text-xs text-gray-500 space-y-4">
            <p>Apenas corretores autorizados têm permissão para acessar a área administrativa</p>
            
            <AuthSetupInstructions />
          </div>
        </CardFooter>
      </Card>
    </div>
  );
}
