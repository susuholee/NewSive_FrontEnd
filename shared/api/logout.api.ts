import { apiClient } from "../lib/axios";

export async function logout() {
    try {
        const res = await apiClient.post('/auth/logout');
        return res.data;
    } catch (error) {
        console.log("로그아웃 요청 오류", error)
        throw error;
    }
}