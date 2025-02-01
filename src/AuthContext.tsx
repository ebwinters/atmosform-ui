import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCheckSessionQuery } from './queries/auth';

interface AuthProviderProps {
  children: ReactNode; 
}

type AuthContextType = {
  authState: AuthState | null;
  setAuthState: React.Dispatch<React.SetStateAction<AuthState | null>>;
} | null;

const AuthContext = createContext<AuthContextType>(null);


export const useAuth = () => {
  const context = useContext(AuthContext);
  
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }

  return context;
};

export type AuthState = { handle: string, did: string, isLoggedIn: boolean };

export const AuthProvider = ({ children }: AuthProviderProps) => {
  const [authState, setAuthState] = useState<AuthState | null>(null);
  const navigate = useNavigate();

  const { data, error } = useCheckSessionQuery();

  useEffect(() => {
    if (data) {
      setAuthState({ handle: data.handle, did: data.did, isLoggedIn: true });
    } else {
      setAuthState({ did: '', handle: '', isLoggedIn: false });
      navigate('/login');
    }
  }, [data, error, navigate]);

  return (
    <AuthContext.Provider value={{ authState, setAuthState }}>
      {children}
    </AuthContext.Provider>
  );
};
