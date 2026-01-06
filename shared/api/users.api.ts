import { apiClient } from '@/shared/lib/axios';
import type { User } from '../types/user';
import type { SignupRequest } from '@/shared/types/auth';

export const signup = async (data: SignupRequest) => {
  try {
    const res = await apiClient.post('/users', data);
    return res.data;
  } catch (error) {
    console.log("회원가입 요청 오류",error)
    throw error;
  }
}

export const getMe = async (): Promise<User> => {
  const res = await apiClient.get<User>('/users/me');
  return res.data;
};

export const changeNickname  =  async (nickname: string) => {
  const res = await apiClient.put('/users/me/nickname', { nickname });
  return res.data;
}

export const changePassword = async (currentPassword: string, newPassword: string)  =>{
  const res = await apiClient.put('/users/me/password', { currentPassword,newPassword });
  return res.data;
}

export const deleteUser = async ()  => {
  const res = await apiClient.delete('/users/me');
  return res.data;
}

export const checkUsernameAvailability = async (username: string) => {
  const res = await apiClient.get('/users/availability', {
    params: { username },
  });
  return res.data as { available: boolean };
};


