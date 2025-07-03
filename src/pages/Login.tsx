
import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from '@/components/ui/sonner';
import { Home } from 'lucide-react';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isSignUp, setIsSignUp] = useState(false);
  const { login, register, isAuthenticated, loading: authLoading } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    console.log('Login - Auth check:', { isAuthenticated, authLoading });
    if (!authLoading && isAuthenticated) {
      console.log('User already authenticated, redirecting to admin');
      navigate('/admin');
    }
  }, [isAuthenticated, authLoading, navigate]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!email || !password) {
      toast.error('Por favor, preencha todos os campos');
      return;
    }

    setIsLoading(true);
    
    try {
      if (isSignUp) {
        console.log('Register form - Attempting register for:', email);
        const success = await register(email, password);
        if (success) {
          setIsSignUp(false);
          setEmail('');
          setPassword('');
        }
      } else {
        console.log('Login form - Attempting login for:', email);
        const success = await login(email, password);
        if (success) {
          console.log('Login successful, redirecting to admin');
          navigate('/admin');
        }
      }
    } catch (error) {
      console.error('Auth form error:', error);
      toast.error('Erro inesperado');
    } finally {
      setIsLoading(false);
    }
  };

  if (authLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#5e9188] mx-auto"></div>
          <p className="mt-4">Carregando...</p>
        </div>
      </div>
    );
  }

  if (isAuthenticated) {
    return null; // Will redirect to admin
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
      <div className="absolute top-4 left-4">
        <Link to="/">
          <Button variant="outline" className="flex items-center gap-2">
            <Home size={18} />
            Voltar ao site
          </Button>
        </Link>
      </div>
      
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl font-bold text-[#253342]">
            {isSignUp ? 'Criar Conta' : 'Área do Corretor'}
          </CardTitle>
          <CardDescription>
            {isSignUp ? 'Cadastre-se para gerenciar imóveis' : 'Faça login para gerenciar seus imóveis'}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="seu@email.com"
                required
                disabled={isLoading}
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="password">Senha</Label>
              <Input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Sua senha"
                required
                disabled={isLoading}
                minLength={isSignUp ? 6 : undefined}
              />
              {isSignUp && (
                <p className="text-xs text-gray-500">Mínimo 6 caracteres</p>
              )}
            </div>
            
            <Button
              type="submit"
              className="w-full bg-[#5e9188] hover:bg-[#3e5954]"
              disabled={isLoading}
            >
              {isLoading ? 
                (isSignUp ? 'Cadastrando...' : 'Entrando...') : 
                (isSignUp ? 'Criar Conta' : 'Entrar')
              }
            </Button>
          </form>
          
          <div className="mt-6 text-center">
            <Button
              variant="ghost"
              onClick={() => {
                setIsSignUp(!isSignUp);
                setEmail('');
                setPassword('');
              }}
              disabled={isLoading}
              className="text-sm"
            >
              {isSignUp ? 'Já tem conta? Fazer login' : 'Não tem conta? Cadastre-se'}
            </Button>
          </div>
          
          {!isSignUp && (
            <div className="mt-4 text-center text-xs text-gray-600">
              <p>Após o cadastro, aguarde aprovação do administrador para acessar o sistema.</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
