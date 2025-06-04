
import React, { createContext, useContext, useState, useEffect } from 'react';
import { toast } from '@/components/ui/sonner';

interface AuthContextType {
  isAuthenticated: boolean;
  login: (username: string, password: string) => boolean;
  logout: () => void;
  loading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);

  // Credenciais fixas
  const VALID_USERNAME = 'Leandrocorretor';
  const VALID_PASSWORD = 'Ndrake22';

  useEffect(() => {
    console.log('AuthContext - Checking saved auth');
    // Verificar se há uma sessão salva no localStorage
    const savedAuth = localStorage.getItem('corretor_auth');
    if (savedAuth === 'true') {
      console.log('AuthContext - Found saved auth, setting authenticated');
      setIsAuthenticated(true);
    }
    setLoading(false);
  }, []);

  const login = (username: string, password: string): boolean => {
    console.log('AuthContext - Login attempt:', { username, password });
    if (username === VALID_USERNAME && password === VALID_PASSWORD) {
      console.log('AuthContext - Login successful');
      setIsAuthenticated(true);
      localStorage.setItem('corretor_auth', 'true');
      toast.success('Login realizado com sucesso!');
      return true;
    } else {
      console.log('AuthContext - Login failed');
      toast.error('Usuário ou senha incorretos');
      return false;
    }
  };

  const logout = () => {
    console.log('AuthContext - Logout');
    setIsAuthenticated(false);
    localStorage.removeItem('corretor_auth');
    toast.success('Logout realizado com sucesso');
  };

  return (
    <AuthContext.Provider value={{ isAuthenticated, login, logout, loading }}>
      {children}
    </AuthContext.Provider>
  );
};
