import { useMutation } from '@tanstack/react-query';
import type { AxiosError } from 'axios';
import { signup } from '../api/auth.api';

type SignupErrorResponse = {
  message?: string;
};

export const useSignupMutation = () => {
  return useMutation<unknown, AxiosError<SignupErrorResponse>, FormData>({
    mutationFn: (formData: FormData) => signup(formData),
  });
};
