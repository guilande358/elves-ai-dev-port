import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

interface DevAuthContextType {
  isAuthenticated: boolean;
  token: string | null;
  login: (token: string) => void;
  logout: () => void;
  validateToken: () => boolean;
}

const DevAuthContext = createContext<DevAuthContextType | undefined>(undefined);

export function DevAuthProvider({ children }: { children: ReactNode }) {
  const [token, setToken] = useState<string | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    const storedToken = sessionStorage.getItem('dev_token');
    if (storedToken && validateTokenExpiry(storedToken)) {
      setToken(storedToken);
      setIsAuthenticated(true);
    } else {
      sessionStorage.removeItem('dev_token');
    }
  }, []);

  const validateTokenExpiry = (tokenToValidate: string): boolean => {
    try {
      const decoded = JSON.parse(atob(tokenToValidate));
      if (decoded.type !== 'dev_access') return false;
      if (Date.now() > decoded.exp) return false;
      return true;
    } catch {
      return false;
    }
  };

  const login = (newToken: string) => {
    sessionStorage.setItem('dev_token', newToken);
    setToken(newToken);
    setIsAuthenticated(true);
  };

  const logout = () => {
    sessionStorage.removeItem('dev_token');
    setToken(null);
    setIsAuthenticated(false);
  };

  const validateToken = (): boolean => {
    if (!token) return false;
    const isValid = validateTokenExpiry(token);
    if (!isValid) {
      logout();
    }
    return isValid;
  };

  return (
    <DevAuthContext.Provider value={{ isAuthenticated, token, login, logout, validateToken }}>
      {children}
    </DevAuthContext.Provider>
  );
}

export function useDevAuth() {
  const context = useContext(DevAuthContext);
  if (context === undefined) {
    throw new Error('useDevAuth must be used within a DevAuthProvider');
  }
  return context;
}
