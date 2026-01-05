import { apiClient } from '@/shared/lib/axios';

export const checkUsernameAvailability = async (username: string) => {
  const res = await apiClient.get('/users/availability', {
    params: { username },
  });
  return res.data as { available: boolean };
};
