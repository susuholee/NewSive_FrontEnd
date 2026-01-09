import { apiClient } from '@/shared/lib/axios';
import type { NotificationSetting } from '../types/notification';

export const getNotificationSetting = async (): Promise<NotificationSetting> => {
  const res = await apiClient.get<NotificationSetting>(
    '/users/me/settings/notification',
  );
  return res.data;
};


export const updateNotificationSetting = async (
  payload: Partial<NotificationSetting>,
): Promise<NotificationSetting> => {
  const res = await apiClient.put<NotificationSetting>(
    '/users/me/settings/notification',
    payload,
  );
  return res.data;
};
