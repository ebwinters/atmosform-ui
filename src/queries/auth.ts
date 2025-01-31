import { useMutation } from '@tanstack/react-query';
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
