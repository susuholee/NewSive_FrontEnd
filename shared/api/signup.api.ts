import { apiClient } from '../lib/axios';
import type { SignupRequest } from '@/shared/types/auth';

export async function signup(data: SignupRequest) {
  try {
    const res = await apiClient.post('/users', data);
    return res.data;
  } catch (error) {
    console.log("회원가입 요청 오류",error)
  }
}
