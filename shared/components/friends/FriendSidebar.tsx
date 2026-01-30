'use client';

import { useState, useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useRouter } from 'next/navigation';

import FriendAuthGuard from '@/shared/components/friends/FriendAuthGuard';
import { useAuthStore } from '@/shared/store/authStore';

import { getFriends, removeFriend } from '@/shared/api/friends.api';
import { sendFriendRequest,getReceivedFriendRequests,getSentFriendRequests, acceptFriendRequest, rejectFriendRequest, cancelFriendRequest, searchUserByNickname} from '@/shared/api/friendRequests.api';

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
    queryClient.invalidateQueries();
  }, [tab, user, queryClient]);


  const getRelation = (userId: number): Relation => {
    if (friends.some((f) => f.friendId === userId)) return 'FRIEND';
    if (sent.some((r) => r.friendUser?.id === userId)) return 'SENT';
    if (received.some((r) => r.user?.id === userId)) return 'RECEIVED';
    return 'NONE';
  };

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

  const accept = useMutation({
    mutationFn: acceptFriendRequest,
    onSuccess: async () => {
      await queryClient.invalidateQueries();
    },
  });

  const reject = useMutation({
    mutationFn: rejectFriendRequest,
    onSuccess: async () => {
      await queryClient.invalidateQueries();
    },
  });

  const cancel = useMutation({
    mutationFn: cancelFriendRequest,
    onSuccess: async () => {
      await queryClient.invalidateQueries();
    },
  });

  const deleteFriend = useMutation({
    mutationFn: removeFriend,
    onSuccess: async () => {
      await queryClient.invalidateQueries();
    },
  });

  const searchMutation = useMutation({
    mutationFn: searchUserByNickname,
    onSuccess: (data) => {
      setSearchResult(data);
      setHasSearched(true);
    },
  });

  const handleSearch = () => {
    const keyword = nickname.trim();
    if (!keyword) return;
    searchMutation.mutate(keyword);
  };


const tabs = [
  { key: 'friends', label: '친구', count: friends.length },
  { key: 'received', label: '받은요청', count: received.length },
  { key: 'sent', label: '보낸요청', count: sent.length },
];


  return (
    <FriendAuthGuard>
      <>
        <div className="rounded-2xl bg-surface p-5 shadow-md">

        <div className="mb-4 flex rounded-xl bg-surface-muted p-1">
       {tabs.map((t) => (
    <button
      key={t.key}
      onClick={() => {
        setTab(t.key as Tab);
        setHasSearched(false);
      }}
      className={`
        flex-1
        rounded-lg
        px-3 py-2
        text-sm font-medium
        transition
        whitespace-nowrap
        ${
          tab === t.key
            ? 'bg-surface text-primary shadow-sm'
            : 'text-text-secondary hover:text-text-primary'
        }
      `}
    >
      <span className="flex items-center justify-center gap-1 whitespace-nowrap">
        <span>{t.label}</span>
        <span className="text-xs text-text-secondary">{t.count}</span>
      </span>
    </button>
  ))}
      </div>



          {tab === 'friends' && (
            <>
    
         <div className="mb-4 flex items-center gap-2 rounded-xl bg-surface-muted p-2 overflow-hidden">
            <input
              value={nickname}
              onChange={(e) => {
                const value = e.target.value;
                setNickname(value);
                if (value.trim() === '') {
                  setSearchResult([]);
                  setHasSearched(false);
                }
              }}
              placeholder="닉네임으로 친구 검색"
              className="
                min-w-0
                flex-1
                rounded-lg
                bg-white
                px-3 py-2
                text-sm
                ring-1 ring-border-soft
                focus:outline-none focus:ring-2 focus:ring-primary/30
              "
              onKeyDown={(e) => {
                if (e.key === 'Enter') handleSearch();
                if (e.key === 'Escape') {
                  setNickname('');
                  setSearchResult([]);
                  setHasSearched(false);
                }
              }}
            />

        <button
          onClick={handleSearch}
          className="
            h-9
            flex-shrink-0
            rounded-lg
            bg-primary
            px-4
            text-sm font-medium text-white
            hover:bg-primary-hover
            whitespace-nowrap
          "
        >
          검색
        </button>
              </div>



              {hasSearched ? (
                searchResult.length === 0 ? (
                  <p className="py-6 text-center text-sm text-text-secondary">
                    검색 결과가 없습니다.
                  </p>
                ) : (
                  <ul className="space-y-3">
                    {searchResult.map((u) => {
                      const relation = getRelation(u.id);

                      return (
                        <li
                          key={u.id}
                          className="
                            flex items-center gap-3 rounded-xl bg-surface p-3
                            ring-1 ring-border-soft transition
                            hover:-translate-y-[2px] hover:shadow-sm
                          "
                        >
                          <img
                            src={u.profileImgUrl || '/default-avatar.png'}
                            className="h-10 w-10 rounded-full"
                          />

                          <div className="flex-1 whitespace-nowrap">
                            <p>{u.nickname}</p>
                            <p className="text-sm text-text-secondary">{u.username}</p>
                          </div>

                          {relation === 'NONE' ? (
                            <button
                              onClick={() =>
                                setConfirm({
                                  title: '친구 요청',
                                  description: `${u.nickname}님에게 친구 요청을 보낼까요?`,
                                  onConfirm: () => {
                                    sendMutation.mutate(u.id);
                                    setConfirm(null);
                                  },
                                })
                              }
                              className="rounded-lg bg-primary px-3 py-1 text-xs text-white hover:bg-primary-hover"
                            >
                              친구 추가
                            </button>
                          ) : (
                            <span className="text-xs text-text-secondary">
                              {relation === 'FRIEND' && '이미 친구'}
                              {relation === 'SENT' && '요청 보냄'}
                              {relation === 'RECEIVED' && '요청 받음'}
                            </span>
                          )}
                        </li>
                      );
                    })}
                  </ul>
                )
              ) : friends.length === 0 ? (
                <p className="py-6 text-center text-sm text-text-secondary">
                  친구가 없습니다.
                </p>
              ) : (
                <ul className="space-y-3">
                  {friends.map((f) => (
                  <li
                  key={f.id}
                  className="
                    rounded-xl
                    bg-surface
                    p-4
                    ring-1 ring-border-soft
                  "
                >
                  <div className="flex gap-4">
                    <img
                      src={f.profileImgUrl || '/default-avatar.png'}
                      className="h-11 w-11 rounded-full flex-shrink-0"
                    />

                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-semibold whitespace-nowrap">
                        {f.nickname}
                      </p>
                      <p className="text-xs text-text-secondary whitespace-nowrap">
                        {f.username}
                      </p>
                    </div>
                  </div>

               
                  <div className="mt-3 flex justify-end gap-2">
                    <button
                      onClick={() => router.push(`/chat/${f.friendId}`)}
                      className="
                        rounded-lg
                        bg-primary
                        px-4 py-1.5
                        text-xs
                        text-white
                        whitespace-nowrap
                      "
                    >
                      대화하기
                    </button>

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
                      className="
                        rounded-lg
                        border border-danger/40
                        px-4 py-1.5
                        text-xs
                        text-danger
                        hover:bg-danger/10
                        transition
                        whitespace-nowrap
                      "
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
          {tab === 'received' && (
            <>
              {received.length === 0 ? (
                <p className="py-6 text-center text-sm text-text-secondary">
                  받은 요청이 없습니다.
                </p>
              ) : (
                <ul className="space-y-3">
                  {received.map((r) => (
                    <li
                      key={r.id}
                      className="flex items-center gap-3 rounded-xl bg-surface p-3 ring-1 ring-border-soft"
                    >
                      <img
                        src={r.user?.profileImgUrl || '/default-avatar.png'}
                        className="h-10 w-10 rounded-full"
                      />

                      <div className="flex-1">
                        <p>{r.user?.nickname}</p>
                        <p className="text-sm text-text-secondary">
                          {r.user?.username}
                        </p>
                      </div>

                      <div className="flex gap-2">
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
                          className="rounded-lg bg-primary px-3 py-1 text-xs text-white"
                        >
                          수락
                        </button>
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
                          className="rounded-lg bg-surface-muted px-3 py-1 text-xs"
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

    
          {tab === 'sent' && (
            <>
              {sent.length === 0 ? (
                <p className="py-6 text-center text-sm text-text-secondary">
                  보낸 요청이 없습니다.
                </p>
              ) : (
                <ul className="space-y-3">
                  {sent.map((r) => (
                    <li
                      key={r.id}
                      className="flex items-center gap-3 rounded-xl bg-surface p-3 ring-1 ring-border-soft"
                    >
                      <img
                        src={r.friendUser?.profileImgUrl || '/default-avatar.png'}
                        className="h-10 w-10 rounded-full"
                      />

                      <div className="flex-1">
                        <p>{r.friendUser?.nickname}</p>
                        <p className="text-sm text-text-secondary">
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
                        className="text-xs text-danger"
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
