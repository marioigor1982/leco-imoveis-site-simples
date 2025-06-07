
import React, { createContext, useContext, useState, useEffect } from 'react';
import { User, Session } from '@supabase/supabase-js';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/components/ui/sonner';

interface AuthContextType {
  user: User | null;
  session: Session | null;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<boolean>;
  logout: () => Promise<void>;
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
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);

  // Credenciais de teste
  const TEST_CREDENTIALS = {
    username: 'Leandrocorretor',
    password: 'Ndrake22'
  };

  useEffect(() => {
    console.log('AuthContext - Setting up auth state listener');
    
    // Get initial session
    const getInitialSession = async () => {
      try {
        const { data: { session }, error } = await supabase.auth.getSession();
        if (error) {
          console.error('Error getting initial session:', error);
        } else {
          console.log('Initial session:', session?.user?.email || 'No session');
          setSession(session);
          setUser(session?.user ?? null);
        }
      } catch (error) {
        console.error('Exception getting initial session:', error);
      } finally {
        setLoading(false);
      }
    };

    getInitialSession();

    // Set up auth state listener
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        console.log('Auth state changed:', event, session?.user?.email || 'No user');
        setSession(session);
        setUser(session?.user ?? null);
        setLoading(false);
      }
    );

    return () => {
      console.log('Cleaning up auth subscription');
      subscription.unsubscribe();
    };
  }, []);

  const login = async (email: string, password: string): Promise<boolean> => {
    console.log('AuthContext - Login attempt for:', email);
    
    // Verificar credenciais de teste primeiro
    if (email === TEST_CREDENTIALS.username && password === TEST_CREDENTIALS.password) {
      console.log('Test credentials matched, creating mock session');
      
      // Criar uma sessão mock para o usuário de teste
      const mockUser = {
        id: 'test-user-id',
        email: 'leandrocorretor@teste.com',
        aud: 'authenticated',
        role: 'authenticated',
        email_confirmed_at: new Date().toISOString(),
        phone: '',
        confirmation_sent_at: null,
        confirmed_at: new Date().toISOString(),
        recovery_sent_at: null,
        last_sign_in_at: new Date().toISOString(),
        app_metadata: {},
        user_metadata: {},
        identities: [],
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      } as User;

      const mockSession = {
        access_token: 'mock-access-token',
        refresh_token: 'mock-refresh-token',
        expires_in: 3600,
        expires_at: Math.floor(Date.now() / 1000) + 3600,
        token_type: 'bearer',
        user: mockUser
      } as Session;

      setUser(mockUser);
      setSession(mockSession);
      toast.success('Login realizado com sucesso!');
      return true;
    }
    
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password
      });

      if (error) {
        console.error('Login error:', error);
        toast.error('Erro no login: ' + error.message);
        return false;
      }

      if (data.user && data.session) {
        console.log('Login successful for:', data.user.email);
        toast.success('Login realizado com sucesso!');
        return true;
      }

      return false;
    } catch (error: any) {
      console.error('Login exception:', error);
      toast.error('Erro inesperado no login');
      return false;
    }
  };

  const logout = async () => {
    console.log('AuthContext - Logout');
    try {
      const { error } = await supabase.auth.signOut();
      if (error) {
        console.error('Logout error:', error);
        toast.error('Erro no logout');
      } else {
        console.log('Logout successful');
        toast.success('Logout realizado com sucesso');
        setSession(null);
        setUser(null);
      }
    } catch (error) {
      console.error('Logout exception:', error);
      toast.error('Erro inesperado no logout');
    }
  };

  const isAuthenticated = !!session && !!user;

  return (
    <AuthContext.Provider value={{ 
      user, 
      session, 
      isAuthenticated, 
      login, 
      logout, 
      loading 
    }}>
      {children}
    </AuthContext.Provider>
  );
};
