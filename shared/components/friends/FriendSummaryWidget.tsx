'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useQuery } from '@tanstack/react-query';

import { useAuthGuard } from '@/shared/hooks/useAuthGuard';
import LoginRequiredModal from '@/shared/components/LoginRequiredModal';

import { getFriends } from '@/shared/api/friends.api';
import { getReceivedFriendRequests } from '@/shared/api/friendRequests.api';

import type { Friend } from '@/shared/types/friend';
import type { FriendRequest } from '@/shared/types/friendRequest';

export default function FriendSummaryWidget() {
  const router = useRouter();
  const { isAuthenticated } = useAuthGuard();

  const [showLoginModal, setShowLoginModal] = useState(false);

  const { data: friends } = useQuery<Friend[]>({
    queryKey: ['friends'],
    queryFn: getFriends,
    enabled: isAuthenticated,
  });

  const { data: receivedRequests } = useQuery<FriendRequest[]>({
    queryKey: ['friendRequests', 'received'],
    queryFn: getReceivedFriendRequests,
    enabled: isAuthenticated,
  });

  const totalFriends = friends?.length ?? 0;
  const receivedCount = receivedRequests?.length ?? 0;

  return (
    <>
      <button
        onClick={() => {
          if (!isAuthenticated) {
            setShowLoginModal(true);
            return;
          }
          router.push('/friends');
        }}
        className="
          w-full
          rounded-2xl
          bg-surface
          p-5
          text-left
          shadow-sm
          transition
          hover:bg-surface-muted
        "
      >
        <h3 className="mb-2 text-sm font-semibold text-text-primary">
          친구
        </h3>

        <div className="space-y-1 text-sm text-text-secondary">
          <p>친구 {totalFriends}명</p>

          <p className={receivedCount > 0 ? 'font-medium text-primary' : ''}>
            받은 요청 {receivedCount}건
          </p>

          {!isAuthenticated && (
            <p className="pt-1 text-xs text-text-secondary">
              로그인 후 확인할 수 있어요
            </p>
          )}
        </div>
      </button>

      {showLoginModal && (
        <LoginRequiredModal onClose={() => setShowLoginModal(false)} />
      )}
    </>
  );
}
