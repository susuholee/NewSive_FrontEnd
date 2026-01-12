'use client';

import { useRouter } from 'next/navigation';
import { useQuery } from '@tanstack/react-query';

import { getFriends } from '@/shared/api/friends.api';
import { getReceivedFriendRequests } from '@/shared/api/friendRequests.api';
import type { Friend } from '@/shared/types/friend';
import type { FriendRequest } from '@/shared/types/friendRequest';

export default function FriendSummaryWidget() {
  const router = useRouter();

  const { data: friends } = useQuery<Friend[]>({
    queryKey: ['friends'],
    queryFn: getFriends,
  });

  const { data: receivedRequests } = useQuery<FriendRequest[]>({
    queryKey: ['friendRequests', 'received'],
    queryFn: getReceivedFriendRequests,
  });

  const totalFriends = friends?.length ?? 0;
  const receivedCount = receivedRequests?.length ?? 0;

  return (
    <button
      onClick={() => router.push('/friends')}
      className="
        w-full
        rounded-xl
        bg-white
        p-4
        text-left
        shadow-sm
        transition
        hover:bg-gray-50
      "
    >
      <h3 className="mb-2 text-sm font-semibold text-gray-900">
        친구
      </h3>

      <div className="space-y-1 text-xs text-gray-600">
        <p>친구 {totalFriends}명</p>

        <p
          className={
            receivedCount > 0
              ? 'font-medium text-primary'
              : 'text-gray-500'
          }
        >
          받은 요청 {receivedCount}건
        </p>
      </div>
    </button>
  );
}
