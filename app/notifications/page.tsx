'use client';

import { useEffect, useState } from 'react';
import { useAuthStore } from '@/shared/store/authStore';
import { getNotifications, readAllNotifications} from '@/shared/api/notifications.api';
import type { Notification } from '@/shared/types/notification';
import { formatRelativeTime } from '@/shared/utils/time';

export default function NotificationsPage() {
  const { user } = useAuthStore();
  const [notifications, setNotifications] = useState<Notification[]>([]);

  useEffect(() => {
    const run = async () => {
      if (!user) {
        setNotifications([]);
        return;
      }

      const data = await getNotifications();
      setNotifications(data);
      await readAllNotifications();
    };

    run();
  }, [user?.id]);



  return (
    <main className="mx-auto max-w-2xl px-4 py-8">
      <h1 className="mb-6 text-2xl font-bold">알림</h1>

      {notifications.length === 0 && (
        <p className="mt-8 text-center text-sm text-gray-500">
          받은 알림이 없습니다.
        </p>
      )}

      <ul className="space-y-3">
        {notifications.map((n) => (
          <li
            key={n.id}
            className={`rounded border p-4 ${
              n.isRead ? 'bg-white' : 'bg-blue-50 border-blue-200'
            }`}
          >
            <p className="text-sm">{n.message}</p>
            <p className="mt-1 text-xs text-gray-500">
              {formatRelativeTime(n.createdAt)}
            </p>
          </li>
        ))}
      </ul>
    </main>
  );
}
