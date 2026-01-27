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

  /* ===================== TAB CHANGE FETCH ===================== */

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
    if (friends.some((f) => f.friendId === userId)) {
      return 'FRIEND';
    }

    if (sent.some((r) => r.friendUser?.id === userId)) {
      return 'SENT';
    }

    if (received.some((r) => r.user?.id === userId)) {
      return 'RECEIVED';
    }

    return 'NONE';
  };

  /* ===================== MUTATIONS ===================== */

  const searchMutation = useMutation({
    mutationFn: searchUserByNickname,
    onSuccess: (data) => {
      setSearchResult(data);
      setHasSearched(true);
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

  const deleteFriend = useMutation({
    mutationFn: removeFriend,
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ['friends'] });
    },
  });

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

  const handleSearch = () => {
    const keyword = nickname.trim();
    if (!keyword) return;
    searchMutation.mutate(keyword);
  };

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
                onClick={() => {
                  setTab(t.key as Tab);
                  setNickname('');
                  setSearchResult([]);
                  setHasSearched(false);
                }}
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

          {/* ================= FRIENDS TAB ================= */}
          {tab === 'friends' && (
            <>
              {/* 검색 */}
              <div className="mb-5 flex gap-2">
                <input
                  value={nickname}
                  onChange={(e) => {
                    const v = e.target.value;
                    setNickname(v);
                    if (v.trim() === '') {
                      setSearchResult([]);
                      setHasSearched(false);
                    }
                  }}
                  onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
                  placeholder="닉네임으로 검색"
                  className="flex-1 h-11 rounded-xl border bg-gray-50 px-4 text-sm"
                />
                <button
                  onClick={handleSearch}
                  className="h-11 w-20 rounded-xl bg-primary text-white text-sm"
                >
                  검색
                </button>
              </div>

              {/* 검색 결과 */}
              {hasSearched && (
                <div className="mb-6 space-y-3 border-b pb-4">
                  {searchResult.length === 0 ? (
                    <p className="py-4 text-center text-sm text-gray-400">
                      검색 결과가 없습니다.
                    </p>
                  ) : (
                    searchResult
                      .filter((u) => u.id !== user?.id) 
                      .map((u) => {
                        const relation = getRelation(u.id);

                        return (
                          <div
                            key={u.id}
                            className="flex justify-between  rounded-xl border p-3"
                          >
                            <div className="flex gap-3">
                              <img
                                src={u.profileImgUrl || '/default-avatar.png'}
                                className="h-10 w-10 rounded-full"
                              />
                              <div>
                                <p className="font-medium">{u.nickname}</p>
                                <p className="text-xs text-gray-400">{u.username}</p>
                              </div>
                            </div>

                         {relation === 'FRIEND' && (
                          <span className="px-3 py-1  h-8 flex  items-center rounded-full text-xs bg-amber-200 text-black">
                            이미 친구
                          </span>
                        )}

                            {relation === 'SENT' && (
                              <span className="text-xs text-gray-400">요청 보냄</span>
                            )}

                            {relation === 'RECEIVED' && (
                              <button
                                onClick={() => {
                                  const req = received.find(
                                    (r) => r.user?.id === u.id
                                  );
                                  if (!req) return;
                                  setConfirm({
                                    title: '친구 요청 수락',
                                    onConfirm: () => {
                                      accept.mutate(req.id);
                                      setConfirm(null);
                                    },
                                  });
                                }}
                                className="bg-primary text-white px-3 py-1 rounded-full text-xs"
                              >
                                수락
                              </button>
                            )}

                            {relation === 'NONE' && (
                              <button
                                onClick={() => sendMutation.mutate(u.id)}
                                className="bg-primary text-white px-3 py-1 rounded-full text-xs"
                              >
                                친구 추가
                              </button>
                            )}
                          </div>
                        );
                      })
                  )}
                </div>
              )}

              {/* 친구 목록 */}
              {friends.length === 0 ? (
                <p className="py-6 text-center text-sm text-gray-400">
                  아직 친구가 없습니다.
                </p>
              ) : (
                <ul className="space-y-3">
                  {friends.map((f) => (
                    <li
                      key={f.id}
                      className="flex justify-between rounded-xl border p-3"
                    >
                      <div className="flex gap-3">
                        <img
                          src={f.profileImgUrl || '/default-avatar.png'}
                          className="h-9 w-9 rounded-full"
                        />
                        <span>{f.nickname}</span>
                      </div>

                      <div className="flex gap-2">
                        <button
                          onClick={() => router.push(`/chat/${f.friendId}`)}
                          className="text-primary text-xs"
                        >
                          대화
                        </button>
                        <button
                          onClick={() =>
                            setConfirm({
                              title: '친구 삭제',
                              description: `${f.nickname}님을 삭제할까요?`,
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
                      </div>
                    </li>
                  ))}
                </ul>
              )}
            </>
          )}

          {/* RECEIVED TAB */}
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
                        <button
                          onClick={() =>
                            setConfirm({
                              title: '요청 수락',
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

                        <button
                          onClick={() =>
                            setConfirm({
                              title: '요청 거절',
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

          {/* SENT TAB */}
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
