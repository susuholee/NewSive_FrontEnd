import { apiClient } from "../lib/axios";
import type { User } from "../types/user";

export async function getMe() : Promise<User> {
    try {
        const res = await apiClient.get<User>('/auth/me');
        return res.data;
    } catch (error) {
       console.log("로그인 요청 오류", error);
       throw new Error("알 수 없는 오류가 발생했습니다.");
    }
}