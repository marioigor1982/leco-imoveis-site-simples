
import React, { createContext, useContext, useState, useEffect } from 'react';
import { User, Session } from '@supabase/supabase-js';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/components/ui/sonner';
import { UserMetadata } from '@/types/auth';

interface AuthContextType {
  user: User | null;
  session: Session | null;
  userMetadata: UserMetadata | null;
  isAuthenticated: boolean;
  isApproved: boolean;
  isAdmin: boolean;
  login: (email: string, password: string) => Promise<boolean>;
  register: (email: string, password: string) => Promise<boolean>;
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
  const [userMetadata, setUserMetadata] = useState<UserMetadata | null>(null);
  const [loading, setLoading] = useState(true);

  const fetchUserMetadata = async (userId: string) => {
    try {
      const { data, error } = await supabase
        .from('users_metadata')
        .select('*')
        .eq('user_id', userId)
        .single();
      
      if (error && error.code !== 'PGRST116') {
        console.error('Error fetching user metadata:', error);
        return null;
      }
      
      return data;
    } catch (error) {
      console.error('Exception fetching user metadata:', error);
      return null;
    }
  };

  useEffect(() => {
    console.log('AuthContext - Setting up auth state listener');
    
    const getInitialSession = async () => {
      try {
        const { data: { session }, error } = await supabase.auth.getSession();
        if (error) {
          console.error('Error getting initial session:', error);
        } else {
          setSession(session);
          setUser(session?.user ?? null);
          
          if (session?.user) {
            const metadata = await fetchUserMetadata(session.user.id);
            setUserMetadata(metadata);
          }
        }
      } catch (error) {
        console.error('Exception getting initial session:', error);
      } finally {
        setLoading(false);
      }
    };

    getInitialSession();

    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        console.log('Auth state changed:', event, session?.user?.email || 'No user');
        setSession(session);
        setUser(session?.user ?? null);
        
        if (session?.user) {
          setTimeout(async () => {
            const metadata = await fetchUserMetadata(session.user.id);
            setUserMetadata(metadata);
          }, 0);
        } else {
          setUserMetadata(null);
        }
        
        setLoading(false);
      }
    );

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  const login = async (email: string, password: string): Promise<boolean> => {
    console.log('AuthContext - Login attempt for:', email);
    
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password
      });

      if (error) {
        console.error('Login error:', error);
        if (error.message.includes('Invalid login credentials')) {
          toast.error('Email ou senha incorretos');
        } else {
          toast.error('Erro no login: ' + error.message);
        }
        return false;
      }

      if (data.user && data.session) {
        // Verificar se o usuário está aprovado
        const metadata = await fetchUserMetadata(data.user.id);
        
        if (!metadata) {
          toast.error('Erro ao verificar dados do usuário');
          await supabase.auth.signOut();
          return false;
        }
        
        if (!metadata.is_approved) {
          toast.error('Seu acesso está aguardando aprovação do administrador');
          await supabase.auth.signOut();
          return false;
        }
        
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

  const register = async (email: string, password: string): Promise<boolean> => {
    console.log('AuthContext - Register attempt for:', email);
    
    try {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          emailRedirectTo: `${window.location.origin}/`
        }
      });

      if (error) {
        console.error('Register error:', error);
        if (error.message.includes('already registered')) {
          toast.error('Este email já está cadastrado');
        } else {
          toast.error('Erro no cadastro: ' + error.message);
        }
        return false;
      }

      if (data.user) {
        console.log('Registration successful for:', data.user.email);
        toast.success('Cadastro realizado! Aguarde a aprovação do administrador para fazer login.');
        return true;
      }

      return false;
    } catch (error: any) {
      console.error('Register exception:', error);
      toast.error('Erro inesperado no cadastro');
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

  const isAuthenticated = !!session && !!user && !!userMetadata?.is_approved;
  const isApproved = !!userMetadata?.is_approved;
  const isAdmin = user?.email === 'mario.igor1982@gmail.com';

  return (
    <AuthContext.Provider value={{ 
      user, 
      session, 
      userMetadata,
      isAuthenticated, 
      isApproved,
      isAdmin,
      login, 
      register,
      logout, 
      loading 
    }}>
      {children}
    </AuthContext.Provider>
  );
};
