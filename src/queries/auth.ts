import { useMutation, useQuery } from '@tanstack/react-query';
import { baseUrl } from './common';
import { AuthState } from '../AuthContext';

const signOut = async () => {
  const response = await fetch(`${baseUrl}logout`, {
    method: 'POST',
    credentials: 'include',
  });

  if (!response.ok) {
    throw new Error('Sign-out failed');
  }
};

export const useSignOut = () => {
  return useMutation({
    mutationFn: () => signOut()
  });
};

const checkSession = async () => {
  const response = await fetch(`${baseUrl}check-session`, {
    method: 'GET',
    credentials: 'include'
  });

  if (!response.ok) {
    throw new Error('Session check failed');
  }
  const data = await response.json();
  return data as AuthState;
};

export const useCheckSessionQuery = () => {
  return useQuery({
    queryKey: ['check-session'],
    queryFn: () => checkSession(),
    staleTime: 60 * 1000, // 5 minutes
    placeholderData: (prev) => prev,
    retry: false,
  });
};

const login = async (handle: string) => {
  const response = await fetch(`${baseUrl}login`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ handle }),
  });

  if (!response.ok) {
    throw new Error("Failed to fetch OAuth URL");
  }

  const { oauthUrl } = await response.json();
  window.location.href = oauthUrl;
};

export const useLoginMutation = () => {
  return useMutation({
    mutationFn: login,
  });
};
