import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { useNavigate } from 'react-router-dom';

interface AuthProviderProps {
  children: ReactNode; // Make sure `children` is of type ReactNode
}

type AuthContextType = {
  authState: AuthState | null;
  setAuthState: React.Dispatch<React.SetStateAction<AuthState | null>>;
} | null; // Allow the context to be `null` or the correct type

const AuthContext = createContext<AuthContextType>(null); // Set the default value to `null`


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

  const checkSession = async () => {
    try {
      const response = await fetch('http://127.0.0.1:3333/api/v1/check-session', {
        method: 'GET',
        credentials: 'include'
      });
      const data = await response.json();

      if (response.ok) {
        setAuthState({handle: data.handle, did: data.did, isLoggedIn: true});
      } else {
        setAuthState({did: '', handle: '', isLoggedIn: false});
        navigate('/login');
      }
    } catch (error) {
      console.error('Error checking session:', error);
      setAuthState(null);
      navigate('/login');
    }
  };

  useEffect(() => {
    // Check session on component mount
    const checkSessionFunc = async () => {
      await checkSession();
    };
    checkSessionFunc();
  }, []);

  return (
    <AuthContext.Provider value={{ authState, setAuthState }}>
      {children}
    </AuthContext.Provider>
  );
};
