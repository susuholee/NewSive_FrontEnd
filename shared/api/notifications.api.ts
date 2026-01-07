import { apiClient } from '@/shared/lib/axios';
import type { Notification } from '../types/notification';


export const getNotifications = async (): Promise<Notification[]> => {
  const res = await apiClient.get<Notification[]>('/notifications');
  return res.data;
};

export const getUnreadCount = async (): Promise<{ unreadCount: number }> => {
  const res = await apiClient.get('/notifications/unread');
  return res.data;
};

export const readNotification = async (id: number) => {
  const res = await apiClient.patch(`/notifications/${id}/read`);
  return res.data;
};

export const readAllNotifications = async () => {
  const res = await apiClient.patch('/notifications/read_all');
  return res.data;
};
