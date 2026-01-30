export type NotificationType =
  | 'FRIEND_REQUEST'
  | 'FRIEND_ACCEPTED'

export type Notification = {
  id: number;
  type: NotificationType;
  message: string;
  link?: string | null;
  isRead: boolean;
  createdAt: string; 
};