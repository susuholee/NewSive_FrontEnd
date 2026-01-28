'use client';

import { useQuery } from '@tanstack/react-query';
import { getNotifications } from '@/shared/api/notifications.api';
import type { Notification } from '@/shared/types/notification';
import { formatRelativeTime } from '@/shared/utils/time';

export default function NotificationsPage() {
  const { data: notifications = [] } = useQuery<Notification[]>({
    queryKey: ['notifications'],
    queryFn: getNotifications,
  });

  return (
    <main className="mx-auto max-w-2xl px-4 py-8">
      <h1 className="mb-6 text-2xl font-bold">알림</h1>

      {notifications.length === 0 && (
        <p className="mt-20 text-center text-sm text-gray-400">
          아직 받은 알림이 없습니다.
        </p>
      )}

      {notifications.length > 0 && (
        <ul className="rounded-xl border divide-y">
          {notifications.map((n) => (
            <li key={n.id} className="px-5 py-4">
              <p className="text-sm">{n.message}</p>
              <p className="mt-1 text-xs text-gray-500">
                {formatRelativeTime(n.createdAt)}
              </p>
            </li>
          ))}
        </ul>
      )}
    </main>
  );
}
