'use client';

import {
  useQuery,
  useMutation,
  useQueryClient,
} from '@tanstack/react-query';

import {
  getNotificationSetting,
  updateNotificationSetting,
} from '@/shared/api/notifications.settings.api';
import type { NotificationSetting } from '@/shared/types/notification';
import { ConfirmModal } from '@/shared/components/ConfirmModal';
import { useState } from 'react';

export default function NotificationSettingsPage() {
  const queryClient = useQueryClient();

  const { data: setting, isLoading } =
    useQuery<NotificationSetting>({
      queryKey: ['notification-setting'],
      queryFn: getNotificationSetting,
    });

  const [modal, setModal] = useState<{
    title: string;
    description?: string;
  } | null>(null);

  const { mutate: saveSetting } = useMutation({
    mutationFn: updateNotificationSetting,

    onMutate: async (next) => {
      await queryClient.cancelQueries({
        queryKey: ['notification-setting'],
      });

      const previous =
        queryClient.getQueryData<NotificationSetting>([
          'notification-setting',
        ]);

      queryClient.setQueryData(['notification-setting'], {
        ...previous,
        ...next,
      });

      return { previous };
    },

    onError: (_err, _next, context) => {
      if (context?.previous) {
        queryClient.setQueryData(
          ['notification-setting'],
          context.previous,
        );
      }

      setModal({
        title: '저장 실패',
        description:
          '알림 설정 저장 중 오류가 발생했습니다.',
      });
    },

    onSuccess: (data) => {
      queryClient.setQueryData(
        ['notification-setting'],
        data,
      );
    },
  });

  if (isLoading || !setting) {
    return (
      <p className="p-10 text-center text-text-secondary">
        로딩 중...
      </p>
    );
  }

  return (
    <>
      <main className="mx-auto max-w-3xl px-4 py-10 text-text-primary">
        <h1 className="mb-8 text-2xl font-bold">
          알림 설정
        </h1>

        <div className="rounded-xl bg-surface p-6 space-y-8">
          <section>
            <h2 className="text-lg font-semibold">
              알림 수신
            </h2>
            <p className="mt-1 text-sm text-text-secondary">
              전체 알림 수신 여부를 설정합니다.
            </p>

            <label className="mt-4 flex items-center gap-3 text-sm">
              <input
                type="checkbox"
                className="h-4 w-4 accent-primary"
                checked={setting.allowNotification}
                onChange={(e) => {
                  saveSetting({
                    allowNotification: e.target.checked,
                  });
                }}
              />
              전체 알림 받기
            </label>
          </section>

          <hr className="border-surface-muted" />

        
          <section>
            <h2 className="text-lg font-semibold">
              뉴스 알림
            </h2>
            <p className="mt-1 text-sm text-text-secondary">
              주요 뉴스 속보 알림을 받을 수 있습니다.
            </p>

            <label className="mt-4 flex items-center gap-3 text-sm">
              <input
                type="checkbox"
                className="h-4 w-4 accent-primary"
                checked={setting.allowBreakingNews}
                disabled={!setting.allowNotification}
                onChange={(e) => {
                  saveSetting({
                    allowBreakingNews: e.target.checked,
                  });
                }}
              />
              뉴스 속보 알림 받기
            </label>

            {!setting.allowNotification && (
              <p className="mt-2 text-xs text-text-secondary">
                전체 알림이 꺼져 있어 뉴스 알림을 받을 수 없습니다.
              </p>
            )}
          </section>

          <hr className="border-surface-muted" />

          <section>
            <h2 className="text-lg font-semibold">
              관심 키워드
            </h2>
            <p className="mt-1 text-sm text-text-secondary">
              관심 키워드 기반 알림 수신 여부를 설정합니다.
            </p>

            <label className="mt-4 flex items-center gap-3 text-sm">
              <input
                type="checkbox"
                className="h-4 w-4 accent-primary"
                checked={setting.allowKeywordAlert}
                disabled={!setting.allowNotification}
                onChange={(e) => {
                  saveSetting({
                    allowKeywordAlert: e.target.checked,
                  });
                }}
              />
              키워드 알림 받기
            </label>

            {!setting.allowNotification && (
              <p className="mt-2 text-xs text-text-secondary">
                전체 알림이 꺼져 있어 키워드 알림을 받을 수 없습니다.
              </p>
            )}
          </section>
        </div>
      </main>

      {modal && (
        <ConfirmModal
          title={modal.title}
          description={modal.description}
          confirmText="확인"
          onConfirm={() => setModal(null)}
          onCancel={() => setModal(null)}
        />
      )}
    </>
  );
}
