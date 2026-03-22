import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { supabase } from '@/integrations/supabase/client';
import type { Session, User } from '@supabase/supabase-js';

interface AdminAuthContextType {
  isAuthenticated: boolean;
  isLoading: boolean;
  user: { name: string; email: string; avatar_url: string } | null;
  session: Session | null;
  login: (email: string, password: string) => Promise<void>;
  loginAdmin: (email: string) => void;
  logout: () => Promise<void>;
  error: string | null;
}

const AdminAuthContext = createContext<AdminAuthContextType | undefined>(undefined);

function mapSupabaseUser(user: User | null): { name: string; email: string; avatar_url: string } | null {
  if (!user) return null;
  return {
    name: user.user_metadata?.full_name || user.email?.split('@')[0] || 'Admin',
    email: user.email || '',
    avatar_url: user.user_metadata?.avatar_url || '',
  };
}

export function AdminAuthProvider({ children }: { children: ReactNode }) {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [user, setUser] = useState<{ name: string; email: string; avatar_url: string } | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const initAuth = async () => {
      try {
        const { data: { session: currentSession } } = await supabase.auth.getSession();
        if (currentSession) {
          setSession(currentSession);
          setUser(mapSupabaseUser(currentSession.user));
          setIsAuthenticated(true);
        }
      } catch {
        // Session check failed, user stays unauthenticated
      } finally {
        setIsLoading(false);
      }
    };

    initAuth();

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, newSession) => {
      setSession(newSession);
      if (newSession) {
        setUser(mapSupabaseUser(newSession.user));
        setIsAuthenticated(true);
      } else {
        setUser(null);
        setIsAuthenticated(false);
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  const login = async (email: string, password: string) => {
    setIsLoading(true);
    setError(null);

    try {
      const { data, error: authError } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (authError) throw authError;

      setSession(data.session);
      setUser(mapSupabaseUser(data.user));
      setIsAuthenticated(true);
    } catch (err) {
      const msg = err instanceof Error ? err.message : 'Login failed';
      setError(msg);
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  const loginAdmin = (_email: string) => {
    // Kept for backwards compatibility; real auth goes through login()
  };

  const logout = async () => {
    await supabase.auth.signOut();
    setSession(null);
    setUser(null);
    setIsAuthenticated(false);
  };

  return (
    <AdminAuthContext.Provider
      value={{
        isAuthenticated,
        isLoading,
        user,
        session,
        login,
        loginAdmin,
        logout,
        error,
      }}
    >
      {!isLoading && children}
    </AdminAuthContext.Provider>
  );
}

export function useAdminAuth() {
  const context = useContext(AdminAuthContext);
  if (context === undefined) {
    throw new Error('useAdminAuth must be used within an AdminAuthProvider');
  }
  return context;
}

