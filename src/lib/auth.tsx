'use client';

import { createContext, useContext, useEffect, useState, type ReactNode } from 'react';
import { apiFetch } from './api';
import { useDemoSession } from './demo-session';

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
  register: (input: { name: string; email: string; phoneNumber: string; password: string; businessName?: string }) => Promise<AuthUser>;
  logout: () => Promise<void>;
  refresh: () => Promise<AuthUser | null>;
};

const Context = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [loading, setLoading] = useState(true);
  const demoMode = process.env.NEXT_PUBLIC_ENABLE_DEMO_MODE === 'true';
  const { ready: demoReady, identity, enterDemo, exitDemo } = useDemoSession();
  const demoUser = identity
    ? {
        id: 'demo-merchant',
        name: identity.displayName,
        email: identity.email,
        phoneNumber: '',
        currentRole: 'MERCHANT' as const,
      }
    : null;

  const refresh = async () => {
    if (demoMode) {
      setUser(demoUser);
      setLoading(!demoReady);
      return demoUser;
    }
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
    if (demoMode && !demoReady) return;
    void refresh();
    if (demoMode) return;
    const unauthorized = () => setUser(null);
    window.addEventListener('koletpay:unauthorized', unauthorized);
    return () => window.removeEventListener('koletpay:unauthorized', unauthorized);
  }, [demoMode, demoReady, identity]);

  const login = async (email: string, password: string) => {
    if (demoMode) {
      const nextUser = {
        id: 'demo-merchant',
        name: email.trim() || 'Demo merchant',
        email: email.trim(),
        phoneNumber: '',
        currentRole: 'MERCHANT' as const,
      };
      enterDemo({ displayName: nextUser.name, businessName: 'Demo business', email: nextUser.email });
      setUser(nextUser);
      return nextUser;
    }
    const nextUser = await apiFetch<AuthUser>('/api/v1/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    });
    setUser(nextUser);
    return nextUser;
  };

  const register = async (input: { name: string; email: string; phoneNumber: string; password: string; businessName?: string }) => {
    if (demoMode) {
      const nextUser = {
        id: 'demo-merchant',
        name: input.name,
        email: input.email,
        phoneNumber: input.phoneNumber,
        currentRole: 'MERCHANT' as const,
      };
      enterDemo({ displayName: input.name, businessName: input.businessName || 'Demo business', email: input.email });
      setUser(nextUser);
      return nextUser;
    }
    const nextUser = await apiFetch<AuthUser>('/api/v1/auth/register', {
      method: 'POST',
      body: JSON.stringify({ name: input.name, email: input.email, phoneNumber: input.phoneNumber, password: input.password }),
    });
    setUser(nextUser);
    return nextUser;
  };

  const logout = async () => {
    if (demoMode) {
      exitDemo();
      setUser(null);
      return;
    }
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