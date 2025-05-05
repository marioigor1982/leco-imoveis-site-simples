
import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/components/ui/sonner';
import { Home } from 'lucide-react';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    // Check if user is already logged in
    const checkSession = async () => {
      const { data } = await supabase.auth.getSession();
      if (data.session) {
        navigate('/admin');
      }
    };
    
    checkSession();
  }, [navigate]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password
      });
      
      if (error) {
        toast.error('Erro ao fazer login', {
          description: error.message
        });
      } else if (data.user) {
        if (data.user.email === 'leandro@dharmaimoveis.com.br') {
          toast.success('Login realizado com sucesso');
          navigate('/admin');
        } else {
          toast.error('Acesso não autorizado');
          await supabase.auth.signOut();
        }
      }
    } catch (error) {
      toast.error('Erro ao fazer login');
      console.error('Login error:', error);
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
            Faça login para gerenciar seus imóveis
          </CardDescription>
        </CardHeader>
        <form onSubmit={handleLogin}>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input 
                id="email" 
                type="email" 
                placeholder="seu@email.com" 
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">Senha</Label>
              <Input 
                id="password" 
                type="password" 
                placeholder="••••••••" 
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>
          </CardContent>
          <CardFooter>
            <Button 
              type="submit" 
              className="w-full bg-[#5e9188] hover:bg-[#3e5954]"
              disabled={loading}
            >
              {loading ? 'Entrando...' : 'Entrar'}
            </Button>
          </CardFooter>
        </form>
      </Card>
    </div>
  );
}
