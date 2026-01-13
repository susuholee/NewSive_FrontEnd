import { apiClient } from '@/shared/lib/axios';
import type { Friend, FriendApiResponse } from '../types/friend';


export const getFriends = async (): Promise<Friend[]> => {
    const res = await apiClient.get<FriendApiResponse[]>('/friends');

    return res.data.map((item) => ({
        id: item.id,
        friendId : item.friend.id,
        username: item.friend.username,
        nickname: item.friend.nickname,
    }));
};


export const addFriend = async (friendUserId: number) => {
    return apiClient.post('/friends', { friendUserId });
};




export const removeFriend = async (friendUserId: number) => {
    return apiClient.delete('/friends', {
        data: { friendUserId },
    });
};
