'use client';

import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';

import {
  getFriends,
  removeFriend,
  sendFriendRequestByNickname,
} from '@/shared/api/friends.api';

import {
  getReceivedFriendRequests,
  getSentFriendRequests,
  acceptFriendRequest,
  rejectFriendRequest,
} from '@/shared/api/friendRequests.api';

import type { Friend } from '@/shared/types/friend';
import type { FriendRequest } from '@/shared/types/friendRequest';
import { ConfirmModal } from '@/shared/components/ConfirmModal';

type Tab = 'friends' | 'received' | 'sent';

export default function FriendsSidebar() {
  const queryClient = useQueryClient();

  const [tab, setTab] = useState<Tab>('friends');
  const [nickname, setNickname] = useState('');
  const [confirm, setConfirm] = useState<{
    title: string;
    description?: string;
    onConfirm: () => void;
  } | null>(null);

  const { data: friends = [] } = useQuery<Friend[]>({
    queryKey: ['friends'],
    queryFn: getFriends,
  });

  const { data: received = [] } = useQuery<FriendRequest[]>({
    queryKey: ['friendRequests', 'received'],
    queryFn: getReceivedFriendRequests,
  });

  const { data: sent = [] } = useQuery<FriendRequest[]>({
    queryKey: ['friendRequests', 'sent'],
    queryFn: getSentFriendRequests,
  });


  const sendMutation = useMutation({
    mutationFn: sendFriendRequestByNickname,
    onSuccess: () => {
      setNickname('');
      queryClient.invalidateQueries({ queryKey: ['friendRequests', 'sent'] });
    },
  });

  const deleteFriend = useMutation({
    mutationFn: removeFriend,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['friends'] });
    },
  });

  const accept = useMutation({
    mutationFn: acceptFriendRequest,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['friends'] });
      queryClient.invalidateQueries({ queryKey: ['friendRequests', 'received'] });
    },
  });

  const reject = useMutation({
    mutationFn: rejectFriendRequest,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['friendRequests', 'received'] });
    },
  });

  /* ---------------- UI ---------------- */
  return (
    <>
      <div className="rounded-xl bg-white p-4 shadow-sm">
        <h3 className="mb-4 text-sm font-semibold">친구</h3>

        {/* Tabs */}
        <div className="mb-4 flex gap-3 border-b text-xs">
          {[
            { key: 'friends', label: `친구 (${friends.length})` },
            { key: 'received', label: `받은 요청 (${received.length})` },
            { key: 'sent', label: '보낸 요청' },
          ].map((t) => (
            <button
              key={t.key}
              onClick={() => setTab(t.key as Tab)}
              className={`pb-2 ${
                tab === t.key
                  ? 'border-b-2 border-primary font-medium text-primary'
                  : 'text-gray-400'
              }`}
            >
              {t.label}
            </button>
          ))}
        </div>

        {/* Friends */}
        {tab === 'friends' && (
          <>
            <div className="mb-3 flex gap-2">
              <input
                value={nickname}
                onChange={(e) => setNickname(e.target.value)}
                placeholder="닉네임"
                className="flex-1 rounded border px-2 py-1 text-xs"
              />
              <button
                onClick={() => sendMutation.mutate(nickname)}
                className="rounded bg-primary px-3 py-1 text-xs text-white"
              >
                추가
              </button>
            </div>

            {friends.length === 0 ? (
              <p className="text-xs text-gray-400">친구가 없습니다.</p>
            ) : (
              <ul className="space-y-2">
                {friends.map((f) => (
                  <li key={f.id} className="flex justify-between text-xs">
                    <span>{f.nickname}</span>
                    <button
                      onClick={() =>
                        setConfirm({
                          title: '친구 삭제',
                          onConfirm: () => {
                            deleteFriend.mutate(f.userId);
                            setConfirm(null);
                          },
                        })
                      }
                      className="text-red-400"
                    >
                      삭제
                    </button>
                  </li>
                ))}
              </ul>
            )}
          </>
        )}

        {/* Received */}
        {tab === 'received' && (
          <ul className="space-y-2">
            {received.length === 0 ? (
              <p className="text-xs text-gray-400">받은 요청 없음</p>
            ) : (
              received.map((r) => (
                <li key={r.id} className="flex justify-between text-xs">
                  <span>{r.user?.nickname}</span>
                  <div className="flex gap-1">
                    <button
                      onClick={() => accept.mutate(r.id)}
                      className="text-primary"
                    >
                      수락
                    </button>
                    <button
                      onClick={() => reject.mutate(r.id)}
                      className="text-gray-400"
                    >
                      거절
                    </button>
                  </div>
                </li>
              ))
            )}
          </ul>
        )}

        {tab === 'sent' && (
          <ul className="space-y-2 text-xs text-gray-500">
            {sent.length === 0
              ? '보낸 요청 없음'
              : sent.map((r) => (
                  <li key={r.id}>{r.friendUser?.nickname}</li>
                ))}
          </ul>
        )}
      </div>

      {confirm && (
        <ConfirmModal
          title={confirm.title}
          onConfirm={confirm.onConfirm}
          onCancel={() => setConfirm(null)}
        />
      )}
    </>
  );
}
