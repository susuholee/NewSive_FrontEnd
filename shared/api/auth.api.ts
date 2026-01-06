import { apiClient } from "../lib/axios";
import type { LoginRequest, LoginResponse } from "../types/login";

export const login = async (data: LoginRequest): Promise<LoginResponse> => {
  const res = await apiClient.post<LoginResponse>('/auth/login', data);
  return res.data;
};


export const logout = async () => {
    try {
        const res = await apiClient.post('/auth/logout');
        return res.data;
    } catch (error) {
        console.log("로그아웃 요청 오류", error)
        throw error;
    }
}
