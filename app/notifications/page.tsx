'use client';

import { useQuery } from '@tanstack/react-query';
import { getNotifications } from '@/shared/api/notifications.api';
import type { Notification } from '@/shared/types/notification';
import { formatRelativeTime } from '@/shared/utils/time';
import { notificationUIMap } from '@/shared/constants/notificationUI';

export default function NotificationsPage() {
  const { data: notifications = [] } = useQuery<Notification[]>({
    queryKey: ['notifications'],
    queryFn: getNotifications,
  });

  return (
    <main className="mx-auto max-w-2xl px-3 sm:px-4 py-6 sm:py-8">
      <h1 className="mb-5 sm:mb-6 text-xl sm:text-2xl font-bold">
        알림 리스트
      </h1>

      {notifications.length === 0 && (
        <div className="mt-16 sm:mt-24 text-center">
          <p className="text-sm text-text-secondary">
            아직 받은 알림이 없습니다.
          </p>
        </div>
      )}

      {notifications.length > 0 && (
        <ul className="space-y-3">
          {notifications.map((n) => {
            const ui = notificationUIMap[n.type];

            return (
              <li
                key={n.id}
                className={[
                  'rounded-2xl border px-4 py-3 sm:px-5 sm:py-4 transition',
                  n.isRead
                    ? 'bg-surface hover:bg-surface-muted'
                    : 'bg-primary-soft/40 hover:bg-primary-soft/60',
                ].join(' ')}
              >
                <div className="flex gap-3">
                  {!n.isRead && (
                    <span
                      className={`mt-1.5 h-2.5 w-2.5 rounded-full ${ui.dotClass}`}
                    />
                  )}

                  <div className="flex-1">
                    <div className="flex flex-wrap items-center gap-x-2 gap-y-1">
                      <span
                        className={`text-xs font-semibold ${ui.textClass}`}
                      >
                        {ui.label}
                      </span>

                      {!n.isRead && (
                        <span className="rounded-full bg-primary px-2 py-0.5 text-[10px] font-bold text-white">
                          NEW
                        </span>
                      )}
                    </div>

                    <p className="mt-1 text-sm leading-relaxed text-text-primary">
                      {n.message}
                    </p>

                    <p className="mt-2 text-xs text-text-secondary">
                      {formatRelativeTime(n.createdAt)}
                    </p>
                  </div>
                </div>
              </li>
            );
          })}
        </ul>
      )}
    </main>
  );
}
