import { apiClient } from "../lib/axios";
import type { LoginRequest, LoginResponse } from "../types/login";

export async function login(data: LoginRequest): Promise<LoginResponse> {
  try {
    const res = await apiClient.post<LoginResponse>('/auth/login',data);
    return res.data;
  } catch (error) {
    console.log("로그인 요청 오류", error);
    throw new Error("알 수 없는 오류가 발생했습니다.");
  }
}
