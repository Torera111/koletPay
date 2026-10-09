'use client';

import { createContext, useContext, useEffect, useState, type ReactNode } from 'react';
import { apiFetch } from './api';

export type AuthUser = {
  id: string;
  name: string;
  email: string;
  phoneNumber: string;
  currentRole: 'MERCHANT';
};

type AuthContextValue = {
  user: AuthUser | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<AuthUser>;
  register: (input: { name: string; email: string; phoneNumber: string; password: string }) => Promise<AuthUser>;
  logout: () => Promise<void>;
  refresh: () => Promise<AuthUser | null>;
};

const Context = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [loading, setLoading] = useState(true);

  const refresh = async () => {
    try {
      const nextUser = await apiFetch<AuthUser>('/api/v1/auth/session');
      setUser(nextUser);
      return nextUser;
    } catch {
      setUser(null);
      return null;
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    void refresh();
    const unauthorized = () => setUser(null);
    window.addEventListener('koletpay:unauthorized', unauthorized);
    return () => window.removeEventListener('koletpay:unauthorized', unauthorized);
  }, []);

  const login = async (email: string, password: string) => {
    const nextUser = await apiFetch<AuthUser>('/api/v1/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    });
    setUser(nextUser);
    return nextUser;
  };

  const register = async (input: { name: string; email: string; phoneNumber: string; password: string }) => {
    const nextUser = await apiFetch<AuthUser>('/api/v1/auth/register', {
      method: 'POST',
      body: JSON.stringify(input),
    });
    setUser(nextUser);
    return nextUser;
  };

  const logout = async () => {
    try {
      await apiFetch('/api/v1/auth/logout', { method: 'POST' });
    } finally {
      setUser(null);
    }
  };

  return <Context.Provider value={{ user, loading, login, register, logout, refresh }}>{children}</Context.Provider>;
}

export function useAuth() {
  const value = useContext(Context);
  if (!value) throw new Error('AuthProvider is missing');
  return value;
}