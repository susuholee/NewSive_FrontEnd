export type NotificationType =
  | 'FRIEND_REQUEST'
  | 'FRIEND_ACCEPTED'
  | 'NEWS'
  | 'CHAT';

export type Notification = {
  id: number;
  type: NotificationType;
  message: string;
  link?: string | null;
  isRead: boolean;
  createdAt: string; 
};

export type NotificationSetting = {
  allowNotification: boolean;
  allowBreakingNews: boolean;
  allowKeywordAlert: boolean;
  defaultRegion?: string;
};