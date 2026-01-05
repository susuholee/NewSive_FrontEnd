import { apiClient } from '../lib/axios';
import type { SignupRequest } from '@/shared/types/auth';

export async function signup(data: SignupRequest) {
  const res = await apiClient.post('/users', data);
  return res.data;
}
