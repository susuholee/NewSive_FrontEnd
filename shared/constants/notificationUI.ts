import type { NotificationType } from '../types/notification';

export const notificationUIMap: Record<
  NotificationType,
  {
    label: string;
    textClass: string;
    dotClass: string;
  }
> = {
  FRIEND_REQUEST: {
    label: '친구 요청',
    textClass: 'text-info',
    dotClass: 'bg-info',
  },
  FRIEND_ACCEPTED: {
    label: '친구 수락',
    textClass: 'text-success',
    dotClass: 'bg-success',
  },
};
