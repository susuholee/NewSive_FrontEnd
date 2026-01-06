import { useMutation } from '@tanstack/react-query';
import type { AxiosError } from 'axios';
import type { SignupRequest } from '@/shared/types/auth';
import { signup } from '../api/users.api';

type SignupErrorResponse = {
  message?: string;
};

export const useSignupMutation = () => {
  return useMutation<unknown, AxiosError<SignupErrorResponse>,SignupRequest>({
    mutationFn: signup,
  });
};
