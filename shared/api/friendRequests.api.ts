import { apiClient } from "@/shared/lib/axios";
import type { FriendRequest } from "../types/friendRequest";

export const getReceivedFriendRequests = async (): Promise<FriendRequest[]> => {
  const res = await apiClient.get("/friend_requests/received");
  return res.data;
};

export const acceptFriendRequest = async (requestId: number) => {
  return apiClient.post(`/friend_requests/${requestId}/accept`);
};

export const rejectFriendRequest = async (requestId: number) => {
  return apiClient.post(`/friend_requests/${requestId}/reject`);
};
