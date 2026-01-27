import { apiClient } from '@/shared/lib/axios';
import type { Friend } from '../types/friend';


export const getFriends = async (): Promise<Friend[]> => {
    const res = await apiClient.get<Friend[]>('/friends');
    return res.data;
};


export const addFriend = async (friendUserId: number) => {
    const res = await apiClient.post('/friends', { friendUserId });
    return res.data;
};




export const removeFriend = async (friendUserId: number) => {
    return apiClient.delete('/friends', {
        data: { friendUserId },
    });
};
