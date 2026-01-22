import { apiClient } from '@/shared/lib/axios';
import type { UpdateProfileImageResponse, User } from '../types/user';



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

export const updateProfileImage = async (formData: FormData): Promise<UpdateProfileImageResponse> => {
  const res = await apiClient.patch<UpdateProfileImageResponse>('/users/me/profile/image', formData);
  return res.data;
};


