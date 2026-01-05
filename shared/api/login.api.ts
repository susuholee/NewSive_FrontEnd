import { apiClient } from "../lib/axios";
import type { LoginRequest, LoginResponse } from "../types/login";

export async function login(data: LoginRequest): Promise<LoginResponse> {
  const res = await apiClient.post<LoginResponse>('/auth/login',data);
  return res.data;
}
