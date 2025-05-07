
import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/components/ui/sonner';
import { Home, AlertCircle, User, LogIn, Google } from 'lucide-react';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";

// Lista de e-mails autorizados
const AUTHORIZED_EMAILS = ['leandro@dharmaimoveis.com.br', 'admin@dharmaimoveis.com.br'];

// Validation schemas
const loginSchema = z.object({
  email: z.string().email("E-mail inválido"),
  password: z.string().min(6, "A senha deve ter pelo menos 6 caracteres")
});

const registerSchema = z.object({
  name: z.string().min(2, "Nome deve ter pelo menos 2 caracteres"),
  email: z.string().email("E-mail inválido"),
  password: z.string().min(6, "A senha deve ter pelo menos 6 caracteres"),
  confirmPassword: z.string().min(6, "A senha deve ter pelo menos 6 caracteres")
}).refine((data) => data.password === data.confirmPassword, {
  message: "As senhas não coincidem",
  path: ["confirmPassword"],
});

export default function Login() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<string>("login");
  const navigate = useNavigate();

  // Forms
  const loginForm = useForm<z.infer<typeof loginSchema>>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: ""
    },
  });

  const registerForm = useForm<z.infer<typeof registerSchema>>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      name: "",
      email: "",
      password: "",
      confirmPassword: ""
    },
  });

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

  const handleGoogleLogin = async () => {
    setLoading(true);
    setError(null);
    try {
      const { error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: `${window.location.origin}/auth-callback`,
          queryParams: {
            access_type: 'offline',
            prompt: 'consent',
          }
        }
      });
      
      if (error) {
        console.error('Google login error:', error);
        if (error.message.includes('provider is not enabled')) {
          setError('O provedor Google não está habilitado no Supabase. Por favor, habilite-o no dashboard do Supabase e configure as credenciais do OAuth.');
        } else if (error.message.includes('requested path is invalid')) {
          setError('URL de redirecionamento inválido. Verifique se as URLs de Site e Redirecionamento estão configuradas no Supabase.');
        } else {
          setError(`Erro ao fazer login com Google: ${error.message}`);
        }
        toast.error('Erro ao fazer login com Google', {
          description: error.message
        });
      }
    } catch (error: any) {
      setError(`Erro ao fazer login com Google: ${error.message}`);
      toast.error('Erro ao fazer login com Google');
      console.error('Google login error:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleEmailLogin = async (values: z.infer<typeof loginSchema>) => {
    setLoading(true);
    setError(null);
    
    try {
      const { error } = await supabase.auth.signInWithPassword({
        email: values.email,
        password: values.password,
      });
      
      if (error) {
        if (error.message.includes('Invalid login credentials')) {
          setError('E-mail ou senha incorretos');
        } else {
          setError(`Erro ao fazer login: ${error.message}`);
        }
        toast.error('Erro ao fazer login');
      } else {
        toast.success('Login realizado com sucesso');
        navigate('/auth-callback');
      }
    } catch (error: any) {
      setError(`Erro ao fazer login: ${error.message}`);
      toast.error('Erro ao fazer login');
    } finally {
      setLoading(false);
    }
  };

  const handleRegister = async (values: z.infer<typeof registerSchema>) => {
    setLoading(true);
    setError(null);
    
    try {
      const { error } = await supabase.auth.signUp({
        email: values.email,
        password: values.password,
        options: {
          data: {
            name: values.name,
          },
          emailRedirectTo: `${window.location.origin}/auth-callback`,
        }
      });
      
      if (error) {
        if (error.message.includes('already registered')) {
          setError('Este e-mail já está cadastrado');
        } else {
          setError(`Erro ao cadastrar: ${error.message}`);
        }
        toast.error('Erro ao cadastrar');
      } else {
        toast.success('Cadastro realizado com sucesso', {
          description: 'Verifique seu e-mail para confirmar o cadastro'
        });
        setActiveTab("login");
        registerForm.reset();
      }
    } catch (error: any) {
      setError(`Erro ao cadastrar: ${error.message}`);
      toast.error('Erro ao cadastrar');
    } finally {
      setLoading(false);
    }
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

          <Tabs value={activeTab} onValueChange={setActiveTab}>
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
              <Form {...loginForm}>
                <form onSubmit={loginForm.handleSubmit(handleEmailLogin)} className="space-y-4">
                  <FormField
                    control={loginForm.control}
                    name="email"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>E-mail</FormLabel>
                        <FormControl>
                          <Input placeholder="seu@email.com" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={loginForm.control}
                    name="password"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Senha</FormLabel>
                        <FormControl>
                          <Input type="password" placeholder="••••••" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <Button 
                    type="submit" 
                    className="w-full"
                    disabled={loading}
                  >
                    {loading ? 'Entrando...' : 'Entrar'}
                  </Button>
                </form>
              </Form>

              <div className="relative mt-6">
                <div className="absolute inset-0 flex items-center">
                  <span className="w-full border-t" />
                </div>
                <div className="relative flex justify-center text-xs uppercase">
                  <span className="bg-white px-2 text-gray-500">ou continue com</span>
                </div>
              </div>

              <Button 
                type="button" 
                className="w-full mt-4 flex items-center justify-center space-x-2 bg-white border text-gray-700 hover:bg-gray-100"
                onClick={handleGoogleLogin}
                disabled={loading}
              >
                <svg width="20" height="20" viewBox="0 0 24 24">
                  <path
                    d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                    fill="#4285F4"
                  />
                  <path
                    d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                    fill="#34A853"
                  />
                  <path
                    d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z"
                    fill="#FBBC05"
                  />
                  <path
                    d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                    fill="#EA4335"
                  />
                </svg>
                <span className="ml-2">{loading ? 'Entrando...' : 'Entrar com Google'}</span>
              </Button>
            </TabsContent>
            
            <TabsContent value="register">
              <Form {...registerForm}>
                <form onSubmit={registerForm.handleSubmit(handleRegister)} className="space-y-4">
                  <FormField
                    control={registerForm.control}
                    name="name"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Nome completo</FormLabel>
                        <FormControl>
                          <Input placeholder="Seu nome completo" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={registerForm.control}
                    name="email"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>E-mail</FormLabel>
                        <FormControl>
                          <Input placeholder="seu@email.com" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={registerForm.control}
                    name="password"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Senha</FormLabel>
                        <FormControl>
                          <Input type="password" placeholder="••••••" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={registerForm.control}
                    name="confirmPassword"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Confirmar senha</FormLabel>
                        <FormControl>
                          <Input type="password" placeholder="••••••" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <Button 
                    type="submit" 
                    className="w-full"
                    disabled={loading}
                  >
                    {loading ? 'Cadastrando...' : 'Cadastrar'}
                  </Button>
                </form>
              </Form>
            </TabsContent>
          </Tabs>
        </CardContent>
        <CardFooter>
          <div className="w-full text-center text-xs text-gray-500 space-y-4">
            <p>Apenas corretores autorizados têm permissão para acessar a área administrativa</p>
            
            <div className="text-sm border p-3 rounded-md bg-gray-50">
              <p className="font-semibold">Configuração do login com Google:</p>
              <ol className="list-decimal text-left mx-4 mt-2 space-y-1 text-xs">
                <li>Acesse o dashboard do Supabase</li>
                <li>Vá para Authentication → Providers</li>
                <li>Habilite o provedor Google</li>
                <li>Configure as credenciais OAuth do Google</li>
                <li>Configure as URLs de redirecionamento em Authentication → URL Configuration</li>
              </ol>
            </div>
          </div>
        </CardFooter>
      </Card>
    </div>
  );
}
