import type { NotificationType } from "../types/notification";
export const notificationUIMap: Record<NotificationType,
  {
    label: string;
    color: string;
    dotColor: string;
  } 
  > = {
  FRIEND_REQUEST: {
    label: '친구 요청',
    color: 'text-blue-600',
    dotColor: 'bg-blue-500',
  },
  FRIEND_ACCEPTED: {
    label: '친구 수락',
    color: 'text-green-600',
    dotColor: 'bg-green-500',
  },
  NEWS: {
    label: '뉴스',
    color: 'text-purple-600',
    dotColor: 'bg-purple-500',
  },
  CHAT: {
    label: '채팅',
    color: 'text-orange-600',
    dotColor: 'bg-orange-500',
  },
};
