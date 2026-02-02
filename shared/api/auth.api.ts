import { apiClient } from "../lib/axios";
import type { LoginRequest, LoginResponse } from "../types/login";
import type { SignupRequest, SignupResponse } from "../types/auth";


export const signup = async (formData: FormData): Promise<SignupResponse> => {
  const res = await apiClient.post<SignupResponse>(
    '/auth/signup',
    formData
  );

  return res.data;
};


export const login = async (data: LoginRequest): Promise<LoginResponse> => {
  const res = await apiClient.post<LoginResponse>('/auth/login', data);
  return res.data;
};


export const logout = async () => {
    try {
        const res = await apiClient.post('/auth/logout');
        return res.data;
    } catch (error) {
        throw error;
    }
}
