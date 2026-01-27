import { apiClient } from "@/shared/lib/axios";
import type { FriendRequest } from "../types/friendRequest";
import { FriendSearchResult } from "../types/friendSearch";

export const sendFriendRequest = async (friendUserId: number) => {
  const res = await apiClient.post('/friend_requests', { friendUserId});
  return res.data;
};

export const getReceivedFriendRequests = async (): Promise<FriendRequest[]> => {
  const res = await apiClient.get("/friend_requests/received");
  return res.data;
};

export const getSentFriendRequests = async (): Promise<FriendRequest[]> => {
  const res = await apiClient.get("/friend_requests/sent");
  return res.data;
}


export const acceptFriendRequest = async (requestId: number) => {
  const res = await apiClient.patch(`/friend_requests/${requestId}/accept`);
  return res.data;
};

export const rejectFriendRequest = async (requestId: number) => {
  const res = await apiClient.patch(`/friend_requests/${requestId}/reject`);
  return res.data;
};

export const searchUserByNickname = async ( nickname: string): Promise<FriendSearchResult[]> => {
  const res = await apiClient.get("/friend_requests/search", {
    params: { nickname },
  });
  return res.data;

};

export const cancelFriendRequest = async (requestId: number) => {
  const res = await apiClient.delete(`/friend_requests/${requestId}/cancel`);
  return res.data;
};
