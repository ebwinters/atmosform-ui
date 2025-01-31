import { useMutation, useQuery } from '@tanstack/react-query';
import { baseUrl } from './common';

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
  return response.json();
};

export const useCheckSessionQuery = () => {
  return useQuery({
    queryKey: ['check-session'],
    queryFn: () => checkSession(),
    staleTime: 60 * 1000, // 5 minutes
    placeholderData: (prev) => prev,
  });
};
