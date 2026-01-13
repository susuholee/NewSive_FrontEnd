import { apiClient } from "@/shared/lib/axios";
import type { FriendRequest } from "../types/friendRequest";

export const sendFriendRequestByNickname = async (nickname: string) => {
  return apiClient.post('/friend_requests/nickname', { nickname });
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
