import React, { createContext, useContext, useState, useEffect } from 'react';

interface AuthContextType {
  token: string | null;
  refreshToken: string | null;
  memberLogin: (email: string, password: string) => Promise<boolean>;
  register: (fullName: string, email: string, phone: string, password: string) => Promise<boolean>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [token, setToken] = useState<string | null>(null);
  const [refreshToken, setRefreshToken] = useState<string | null>(null);

  const API_URL = '/api/v1';

  useEffect(() => {
    // Hydrate tokens on mount
    const storedToken = localStorage.getItem('access_token');
    const storedRefreshToken = localStorage.getItem('refresh_token');
    if (storedToken) {
      setToken(storedToken);
      setRefreshToken(storedRefreshToken);
    }
  }, []);

  const memberLogin = async (email: string, password: string): Promise<boolean> => {
    try {
      const res = await fetch(`${API_URL}/client/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ email, password })
      });

      const data = await res.json();
      if (res.ok && data.success) {
        setToken(data.data.accessToken);
        setRefreshToken(data.data.refreshToken);
        localStorage.setItem('access_token', data.data.accessToken);
        localStorage.setItem('refresh_token', data.data.refreshToken);
        localStorage.setItem('user_role', 'client');
        localStorage.setItem('user_info', JSON.stringify(data.data.user));
        return true;
      }
      return false;
    } catch (error) {
      console.error('Member Login Error', error);
      return false;
    }
  };

  const register = async (fullName: string, email: string, phone: string, password: string): Promise<boolean> => {
    try {
      const res = await fetch(`${API_URL}/client/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ fullName, email, phone, password })
      });

      const data = await res.json();
      if (res.ok && data.success) {
        setToken(data.data.accessToken);
        setRefreshToken(data.data.refreshToken);
        localStorage.setItem('access_token', data.data.accessToken);
        localStorage.setItem('refresh_token', data.data.refreshToken);
        localStorage.setItem('user_role', 'client');
        localStorage.setItem('user_info', JSON.stringify(data.data.user));
        return true;
      }
      return false;
    } catch (error) {
      console.error('Register Error', error);
      return false;
    }
  };

  const logout = () => {
    setToken(null);
    setRefreshToken(null);
    localStorage.removeItem('access_token');
    localStorage.removeItem('refresh_token');
    localStorage.removeItem('user_role');
    localStorage.removeItem('user_info');
  };

  return (
    <AuthContext.Provider value={{ token, refreshToken, memberLogin, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}