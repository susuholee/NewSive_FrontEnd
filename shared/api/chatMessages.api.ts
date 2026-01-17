import { apiClient } from "../lib/axios";
import type { ChatMessage } from "../types/chat";

export const getChatMessages = async (roomId: string, take = 30) : Promise<ChatMessage[]> => {
    const res = await apiClient.get(`/chat/rooms/${roomId}/messages`, {
        params : { take}
    });
    return res.data;
}
