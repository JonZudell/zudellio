// src/contexts/AuthContext.tsx
import Cookies from 'js-cookie';
import React, { createContext, ReactNode, useContext, useEffect, useState } from 'react';

interface AuthContextProps {
  isAuthenticated: boolean;
  url: string;
  login: () => void;
  logout: () => void;
}

const AuthContext = createContext<AuthContextProps | undefined>(undefined);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [error, setError] = useState<string>("")
  const [url, setUrl] = useState<string>("")

  useEffect(() => {
    const token = localStorage.getItem('user_jwt') || sessionStorage.getItem('user_jwt') || Cookies.get('user_jwt');
    if (token) {
      setIsAuthenticated(true);
    }
  }, []);

  const login = async () => {
    setError("")
    try {
      const response = await fetch('/signout', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
      });
      if (response.ok) {
      } else {
        setError('Sign in failed. Please try again.');
      }
    } catch (error) {
      setError('An error occurred. Please try again.');
    }

  };

  const logout = async () => {

  };

  return (
    <AuthContext.Provider value={{ url, isAuthenticated, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextProps => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};