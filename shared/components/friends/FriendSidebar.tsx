'use client';

import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useRouter } from 'next/navigation';

import { useAuthGuard } from '@/shared/hooks/useAuthGuard';
import LoginRequiredModal from '@/shared/components/LoginRequiredModal';

import { getFriends, removeFriend } from '@/shared/api/friends.api';
import {
  sendFriendRequestByNickname,
  getReceivedFriendRequests,
  getSentFriendRequests,
  acceptFriendRequest,
  rejectFriendRequest,
  searchUserByNickname,
} from '@/shared/api/friendRequests.api';

import type { Friend } from '@/shared/types/friend';
import type { FriendRequest } from '@/shared/types/friendRequest';
import type { FriendSearchResult } from '@/shared/types/friendSearch';

import { ConfirmModal } from '@/shared/components/ConfirmModal';

type Tab = 'friends' | 'received' | 'sent';

export default function FriendsSidebar() {
  const queryClient = useQueryClient();
  const router = useRouter();

  const { isAuthenticated } = useAuthGuard();
  const [showLoginModal, setShowLoginModal] = useState(false);

  const [tab, setTab] = useState<Tab>('friends');
  const [nickname, setNickname] = useState('');
  const [searchResult, setSearchResult] = useState<FriendSearchResult[]>([]);

  const [confirm, setConfirm] = useState<{
    title: string;
    description?: string;
    onConfirm: () => void;
  } | null>(null);

  /* ======================
     Queries (로그인일 때만 호출)
  ====================== */

  const { data: friends = [] } = useQuery<Friend[]>({
    queryKey: ['friends'],
    queryFn: getFriends,
    enabled: isAuthenticated, // ✅ 추가
  });

  const { data: received = [] } = useQuery<FriendRequest[]>({
    queryKey: ['friendRequests', 'received'],
    queryFn: getReceivedFriendRequests,
    enabled: isAuthenticated, // ✅ 추가
  });

  const { data: sent = [] } = useQuery<FriendRequest[]>({
    queryKey: ['friendRequests', 'sent'],
    queryFn: getSentFriendRequests,
    enabled: isAuthenticated, // ✅ 추가
  });

  /* ======================
     Mutations
  ====================== */

  const searchMutation = useMutation({
    mutationFn: searchUserByNickname,
    onSuccess: (data) => setSearchResult(data),
  });

  const sendMutation = useMutation({
    mutationFn: sendFriendRequestByNickname,
    onSuccess: async () => {
      setNickname('');
      setSearchResult([]);
      await queryClient.refetchQueries({ queryKey: ['friendRequests', 'sent'] });
    },
  });

  const deleteFriend = useMutation({
    mutationFn: removeFriend,
    onSuccess: async () => {
      await queryClient.refetchQueries({ queryKey: ['friends'] });
    },
  });

  const accept = useMutation({
    mutationFn: acceptFriendRequest,
    onSuccess: async () => {
      await queryClient.refetchQueries({ queryKey: ['friends'] });
      await queryClient.refetchQueries({ queryKey: ['friendRequests', 'received'] });
    },
  });

  const reject = useMutation({
    mutationFn: rejectFriendRequest,
    onSuccess: async () => {
      await queryClient.refetchQueries({ queryKey: ['friendRequests', 'received'] });
    },
  });

  const requireLogin = () => {
    setShowLoginModal(true);
  };

  return (
    <>
      <div className="rounded-2xl bg-surface p-6 shadow-sm">
        <div className="mb-5 flex gap-4 border-b text-sm">
          {[
            { key: 'friends', label: `친구 (${friends.length})` },
            { key: 'received', label: `받은 요청 (${received.length})` },
            { key: 'sent', label: '보낸 요청' },
          ].map((t) => (
            <button
              key={t.key}
              onClick={() => setTab(t.key as Tab)}
              className={`pb-2 transition ${
                tab === t.key
                  ? 'border-b-2 border-primary font-semibold text-primary'
                  : 'text-text-secondary hover:text-text-primary'
              }`}
            >
              {t.label}
            </button>
          ))}
        </div>

   
        {tab === 'friends' && (
          <>
            <div className="mb-4 flex items-center gap-2">
              <input
                value={nickname}
                onChange={(e) => setNickname(e.target.value)}
                placeholder={isAuthenticated ? '닉네임으로 친구 검색' : '로그인 후 친구 검색 가능'}
                disabled={!isAuthenticated}
                className="flex-1 h-11 rounded-lg border px-3 text-sm disabled:cursor-not-allowed disabled:bg-gray-100"
              />
              <button
                disabled={!isAuthenticated}
                onClick={() => {
                  if (!isAuthenticated) return requireLogin();
                  searchMutation.mutate(nickname);
                }}
                className="h-11 rounded-lg bg-primary px-4 text-sm text-white disabled:cursor-not-allowed disabled:opacity-50"
              >
                검색
              </button>
            </div>

          
            {searchResult.length > 0 && (
              <div className="mb-6 space-y-3 border-b pb-4">
                {searchResult.map((u) => (
                  <div key={u.id} className="flex items-center justify-between rounded-lg border p-3">
                    {/* 프로필 */}
                    <div className="flex items-center gap-3">
                      <img
                        src={u.profileImgUrl || '/default-avatar.png'}
                        className="h-10 w-10 rounded-full object-cover"
                        alt="profile"
                      />
                      <div className="flex flex-col">
                        <span className="font-medium">{u.nickname}</span>
                        <span className="text-xs text-text-secondary">@{u.username}</span>
                      </div>
                    </div>

                    {/* 상태 버튼 */}
                    {u.relation === 'FRIEND' && (
                      <span className="text-xs text-text-secondary">이미 친구</span>
                    )}

                    {u.relation === 'SENT' && (
                      <span className="text-xs text-text-secondary">요청 보냄</span>
                    )}

                    {u.relation === 'RECEIVED' && (
                      <button
                        onClick={() => {
                          if (!isAuthenticated) return requireLogin();

                          const req = received.find((r) => r.user?.id === u.id);
                          if (!req) return;

                          setConfirm({
                            title: '친구 요청 수락',
                            description: `${u.nickname}님의 친구 요청을 수락하시겠습니까?`,
                            onConfirm: () => {
                              accept.mutate(req.id);
                              setConfirm(null);
                            },
                          });
                        }}
                        className="rounded-md bg-primary px-3 py-1 text-xs text-white"
                      >
                        요청 수락
                      </button>
                    )}

                    {u.relation === 'NONE' && (
                      <button
                        onClick={() => {
                          if (!isAuthenticated) return requireLogin();
                          sendMutation.mutate(u.nickname);
                        }}
                        className="rounded-md bg-primary px-3 py-1 text-xs text-white"
                      >
                        친구 추가
                      </button>
                    )}
                  </div>
                ))}
              </div>
            )}

  
            {isAuthenticated && friends.length === 0 ? (
              <p className="text-sm text-text-secondary">친구가 없습니다.</p>
            ) : !isAuthenticated ? (
              <p className="text-sm text-text-secondary">
                친구 기능은 로그인 후 사용할 수 있어요.
              </p>
            ) : (
              <ul className="space-y-3">
                {friends.map((f) => (
                  <li
                    key={f.id}
                    className="flex items-center justify-between gap-3 rounded-lg border p-3 text-sm"
                  >
                    <span>{f.nickname}</span>

                    <div className="flex gap-3">
                      <button
                        onClick={() => router.push(`/chat/${f.friendId}`)}
                        className="text-primary hover:underline"
                      >
                        대화하기
                      </button>

                      <button
                        onClick={() =>
                          setConfirm({
                            title: '친구 삭제',
                            description: `${f.nickname}님을 친구 목록에서 삭제하시겠습니까?`,
                            onConfirm: () => {
                              deleteFriend.mutate(f.friendId);
                              setConfirm(null);
                            },
                          })
                        }
                        className="text-danger hover:underline"
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
            {!isAuthenticated ? (
              <p className="text-sm text-text-secondary">
                받은 요청 확인은 로그인 후 가능합니다.
              </p>
            ) : received.length === 0 ? (
              <p className="text-sm text-text-secondary">받은 요청이 없습니다.</p>
            ) : (
              <ul className="space-y-3">
                {received.map((r) => (
                  <li
                    key={r.id}
                    className="flex items-center justify-between rounded-lg border p-3 text-sm"
                  >
                    <span>{r.user?.nickname}</span>
                    <div className="flex gap-3">
                      <button
                        onClick={() =>
                          setConfirm({
                            title: '친구 요청 수락',
                            description: `${r.user?.nickname}님의 친구 요청을 수락하시겠습니까?`,
                            onConfirm: () => {
                              accept.mutate(r.id);
                              setConfirm(null);
                            },
                          })
                        }
                        className="text-primary hover:underline"
                      >
                        수락
                      </button>

                      <button
                        onClick={() =>
                          setConfirm({
                            title: '친구 요청 거절',
                            description: `${r.user?.nickname}님의 친구 요청을 거절하시겠습니까?`,
                            onConfirm: () => {
                              reject.mutate(r.id);
                              setConfirm(null);
                            },
                          })
                        }
                        className="text-text-secondary hover:underline"
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

        {/* ================= 보낸 요청 ================= */}
        {tab === 'sent' && (
          <>
            {!isAuthenticated ? (
              <p className="text-sm text-text-secondary">
                보낸 요청 확인은 로그인 후 가능합니다.
              </p>
            ) : sent.length === 0 ? (
              <p className="text-sm text-text-secondary">보낸 요청이 없습니다.</p>
            ) : (
              <ul className="space-y-3 text-sm text-text-secondary">
                {sent.map((r) => (
                  <li key={r.id} className="rounded-lg border p-3">
                    {r.friendUser?.nickname}
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

      {showLoginModal && (
        <LoginRequiredModal onClose={() => setShowLoginModal(false)} />
      )}
    </>
  );
}
