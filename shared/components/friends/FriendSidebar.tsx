'use client';

import { useState, useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useRouter } from 'next/navigation';

import FriendAuthGuard from '@/shared/components/friends/FriendAuthGuard';
import { useAuthStore } from '@/shared/store/authStore';

import { getFriends, removeFriend } from '@/shared/api/friends.api';
import {
  sendFriendRequest,
  getReceivedFriendRequests,
  getSentFriendRequests,
  acceptFriendRequest,
  rejectFriendRequest,
  cancelFriendRequest,
  searchUserByNickname,
} from '@/shared/api/friendRequests.api';

import type { Friend } from '@/shared/types/friend';
import type { FriendRequest } from '@/shared/types/friendRequest';
import type { FriendSearchResult } from '@/shared/types/friendSearch';

import { ConfirmModal } from '@/shared/components/ConfirmModal';

type Tab = 'friends' | 'received' | 'sent';
type Relation = 'FRIEND' | 'SENT' | 'RECEIVED' | 'NONE';

export default function FriendsSidebar() {
  const queryClient = useQueryClient();
  const router = useRouter();
  const { user } = useAuthStore();

  const [tab, setTab] = useState<Tab>('friends');
  const [nickname, setNickname] = useState('');
  const [searchResult, setSearchResult] = useState<FriendSearchResult[]>([]);
  const [hasSearched, setHasSearched] = useState(false);

  const [confirm, setConfirm] = useState<{
    title: string;
    description?: string;
    onConfirm: () => void;
  } | null>(null);

  /* ===================== QUERIES ===================== */

  const { data: friends = [] } = useQuery<Friend[]>({
    queryKey: ['friends'],
    queryFn: getFriends,
    enabled: !!user,
  });

  const { data: received = [] } = useQuery<FriendRequest[]>({
    queryKey: ['friendRequests', 'received'],
    queryFn: getReceivedFriendRequests,
    enabled: !!user,
  });

  const { data: sent = [] } = useQuery<FriendRequest[]>({
    queryKey: ['friendRequests', 'sent'],
    queryFn: getSentFriendRequests,
    enabled: !!user,
  });

  useEffect(() => {
    if (!user) return;

    if (tab === 'friends') {
      queryClient.invalidateQueries({ queryKey: ['friends'] });
    }
    if (tab === 'received') {
      queryClient.invalidateQueries({ queryKey: ['friendRequests', 'received'] });
    }
    if (tab === 'sent') {
      queryClient.invalidateQueries({ queryKey: ['friendRequests', 'sent'] });
    }
  }, [tab, user, queryClient]);

  const getRelation = (userId: number): Relation => {
    if (friends.some((f) => f.friendId === userId)) return 'FRIEND';
    if (sent.some((r) => r.friendUser?.id === userId)) return 'SENT';
    if (received.some((r) => r.user?.id === userId)) return 'RECEIVED';
    return 'NONE';
  };

  /* ===================== MUTATIONS ===================== */

  const accept = useMutation({
    mutationFn: acceptFriendRequest,
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ['friends'] });
      await queryClient.invalidateQueries({ queryKey: ['friendRequests', 'received'] });
    },
  });

  const reject = useMutation({
    mutationFn: rejectFriendRequest,
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ['friendRequests', 'received'] });
    },
  });

  const cancel = useMutation({
    mutationFn: cancelFriendRequest,
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ['friendRequests', 'sent'] });
    },
  });

  const deleteFriend = useMutation({
    mutationFn: removeFriend,
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ['friends'] });
    },
  });

  const sendMutation = useMutation({
    mutationFn: sendFriendRequest,
    retry: false,
    onSuccess: async () => {
      setNickname('');
      setSearchResult([]);
      setHasSearched(false);
      await queryClient.invalidateQueries({ queryKey: ['friendRequests', 'sent'] });
    },
  });

  const handleSearch = () => {
    const keyword = nickname.trim();
    if (!keyword) return;
    searchMutation.mutate(keyword);
  };

  const searchMutation = useMutation({
    mutationFn: searchUserByNickname,
    onSuccess: (data) => {
      setSearchResult(data);
      setHasSearched(true);
    },
  });

  /* ===================== UI ===================== */

  return (
    <FriendAuthGuard>
      <>
        <div className="rounded-2xl bg-white p-5 shadow-md">
          {/* Tabs */}
          <div className="mb-4 flex gap-6 border-b text-sm font-medium">
            {[
              { key: 'friends', label: `친구 ${friends.length}` },
              { key: 'received', label: `받은 요청 ${received.length}` },
              { key: 'sent', label: `보낸 요청 ${sent.length}` },
            ].map((t) => (
              <button
                key={t.key}
                onClick={() => setTab(t.key as Tab)}
                className={`relative pb-3 ${
                  tab === t.key ? 'text-primary' : 'text-gray-400 hover:text-gray-600'
                }`}
              >
                {t.label}
                {tab === t.key && (
                  <span className="absolute -bottom-[1px] left-0 right-0 h-[2px] bg-primary" />
                )}
              </button>
            ))}
          </div>

          {tab === 'friends' && (
  <>
    {friends.length === 0 ? (
      <p className="py-6 text-center text-sm text-gray-400">
        친구가 없습니다.
      </p>
    ) : (
      <ul className="space-y-3">
        {friends.map((f) => (
          <li
            key={f.id}
            className="flex items-center gap-3 rounded-xl border p-3"
          >
            <img
              src={f.profileImgUrl || '/default-avatar.png'}
              className="h-10 w-10 rounded-full"
            />

            <div className="flex-1">
              <p>{f.nickname}</p>
              <p className="text-sm text-gray-400">{f.username}</p>
            </div>

            {/* 대화하기 */}
            <button
              onClick={() => router.push(`/chat/${f.friendId}`)}
              className="bg-primary text-white px-3 py-1 text-xs rounded-lg"
            >
              대화하기
            </button>

            {/* 친구 삭제 */}
            <button
              onClick={() =>
                setConfirm({
                  title: '친구 삭제',
                  description: `${f.nickname}님을 친구 목록에서 삭제할까요?`,
                  onConfirm: () => {
                    deleteFriend.mutate(f.friendId);
                    setConfirm(null);
                  },
                })
              }
              className="text-red-500 text-xs"
            >
              삭제
            </button>
          </li>
        ))}
      </ul>
    )}
  </>
)}


     
          {tab === 'received' && (
            <>
              {received.length === 0 ? (
                <p className="py-6 text-center text-sm text-gray-400">
                  받은 요청이 없습니다.
                </p>
              ) : (
                <ul className="space-y-3">
                  {received.map((r) => (
                    <li key={r.id} className="flex gap-3 rounded-xl border p-3">
                      <img
                        src={r.user?.profileImgUrl || '/default-avatar.png'}
                        className="h-10 w-10 rounded-full"
                      />

                      <div className="flex-1">
                        <p>{r.user?.nickname}</p>
                        <p className="text-sm text-gray-400">{r.user?.username}</p>
                      </div>

                      <div className="flex gap-2">
                        {/* 수락 */}
                        <button
                          onClick={() =>
                            setConfirm({
                              title: '요청 수락',
                              description: `${r.user?.nickname}님의 친구 요청을 수락할까요?`,
                              onConfirm: () => {
                                accept.mutate(r.id);
                                setConfirm(null);
                              },
                            })
                          }
                          className="bg-primary text-white px-3 py-1 text-xs rounded-lg"
                        >
                          수락
                        </button>

                        {/* 거절 */}
                        <button
                          onClick={() =>
                            setConfirm({
                              title: '요청 거절',
                              description: `${r.user?.nickname}님의 친구 요청을 거절할까요?`,
                              onConfirm: () => {
                                reject.mutate(r.id);
                                setConfirm(null);
                              },
                            })
                          }
                          className="bg-gray-100 px-3 py-1 text-xs rounded-lg"
                        >
                          거절
                        </button>
                      </div>
                    </li>
                  ))}
                </ul>
              )}
            </>
          )}

          {/* ================= SENT TAB ================= */}
          {tab === 'sent' && (
            <>
              {sent.length === 0 ? (
                <p className="py-6 text-center text-sm text-gray-400">
                  보낸 요청이 없습니다.
                </p>
              ) : (
                <ul className="space-y-3">
                  {sent.map((r) => (
                    <li key={r.id} className="flex gap-3 rounded-xl border p-3">
                      <img
                        src={r.friendUser?.profileImgUrl || '/default-avatar.png'}
                        className="h-10 w-10 rounded-full"
                      />

                      <div className="flex-1">
                        <p>{r.friendUser?.nickname}</p>
                        <p className="text-sm text-gray-400">
                          {r.friendUser?.username}
                        </p>
                      </div>

                      <button
                        onClick={() =>
                          setConfirm({
                            title: '요청 취소',
                            description: `${r.friendUser?.nickname}님에게 보낸 요청을 취소할까요?`,
                            onConfirm: () => {
                              cancel.mutate(r.id);
                              setConfirm(null);
                            },
                          })
                        }
                        className="text-red-500 text-xs"
                      >
                        취소
                      </button>
                    </li>
                  ))}
                </ul>
              )}
            </>
          )}
        </div>

        {confirm && (
          <ConfirmModal
            title={confirm.title}
            description={confirm.description}
            onConfirm={confirm.onConfirm}
            onCancel={() => setConfirm(null)}
          />
        )}
      </>
    </FriendAuthGuard>
  );
}
