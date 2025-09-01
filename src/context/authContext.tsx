'use client';

import { createContext, useContext, useEffect, useState } from "react";
import { useNavigate } from 'react-router-dom';

type AuthContextType = {
  isAuthenticated: boolean;
  authToken: string | undefined;
  logout: () => void;   // expose logout here
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [authToken, setAuthToken] = useState<string>();
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem('auth_token');
    if (token) {
      setIsAuthenticated(true);
      setAuthToken(token);
    }
  }, []);

  const logout = () => {
    localStorage.clear();
    setIsAuthenticated(false);
    setAuthToken(undefined);
    navigate("/");   // safe because we're inside a component
  };

  return (
    <AuthContext.Provider value={{ isAuthenticated, authToken, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within an AuthProvider');
  return context;
};
