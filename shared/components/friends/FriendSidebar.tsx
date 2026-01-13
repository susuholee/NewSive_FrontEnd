'use client';

import { useState } from 'react';
import {useQuery,useMutation,useQueryClient} from '@tanstack/react-query';
import {getFriends,removeFriend} from '@/shared/api/friends.api';
import {sendFriendRequestByNickname,getReceivedFriendRequests,getSentFriendRequests,acceptFriendRequest,rejectFriendRequest} from '@/shared/api/friendRequests.api';
import type { Friend } from '@/shared/types/friend';
import type { FriendRequest } from '@/shared/types/friendRequest';
import { ConfirmModal } from '@/shared/components/ConfirmModal';

type Tab = 'friends' | 'received' | 'sent';

export default function FriendsSidebar() {
  const queryClient = useQueryClient();

  const [tab, setTab] = useState<Tab>('friends');
  const [nickname, setNickname] = useState('');
  const [confirm, setConfirm] = useState<{title: string; description?: string; onConfirm: () => void;} | null>(null);


  const { data: friends = [] } = useQuery<Friend[]>({
    queryKey: ['friends'],
    queryFn: getFriends,
    refetchOnMount: true,
    refetchOnWindowFocus: true,
  });

  const { data: received = [] } = useQuery<FriendRequest[]>({
    queryKey: ['friendRequests', 'received'],
    queryFn: getReceivedFriendRequests,
    refetchOnMount: true,
    refetchOnWindowFocus: true,
  });

  const { data: sent = [] } = useQuery<FriendRequest[]>({
    queryKey: ['friendRequests', 'sent'],
    queryFn: getSentFriendRequests,
    refetchOnMount: true,
    refetchOnWindowFocus: true,
  });

  /* ======================
     Mutations
  ====================== */

  const sendMutation = useMutation({
    mutationFn: sendFriendRequestByNickname,
    onSuccess: async () => {
      setNickname('');
      await queryClient.refetchQueries({
        queryKey: ['friendRequests', 'sent'],
      });
    },
  });

  const deleteFriend = useMutation({
    mutationFn: removeFriend,
    onSuccess: async () => {
      await queryClient.refetchQueries({
        queryKey: ['friends'],
      });
    },
  });

  const accept = useMutation({
    mutationFn: acceptFriendRequest,
    onSuccess: async () => {
      await queryClient.refetchQueries({
        queryKey: ['friends'],
      });
      await queryClient.refetchQueries({
        queryKey: ['friendRequests', 'received'],
      });
    },
  });

  const reject = useMutation({
    mutationFn: rejectFriendRequest,
    onSuccess: async () => {
      await queryClient.refetchQueries({
        queryKey: ['friendRequests', 'received'],
      });
    },
  });

  return (
    <>
      <div className="rounded-2xl bg-surface p-6 shadow-sm">
        {/* 탭 */}
        <div className="mb-5 flex gap-4 border-b text-sm">
          {[
            { key: 'friends', label: `친구 (${friends.length})` },
            {
              key: 'received',
              label: `받은 요청 (${received.length})`,
            },
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

        {/* 친구 */}
        {tab === 'friends' && (
          <>
           
            <div className="mb-4 flex items-center gap-2">
              <input
                value={nickname}
                onChange={(e) => setNickname(e.target.value)}
                placeholder="닉네임"
                className="
                  flex-1 h-11 rounded-lg
                  border border-text-secondary/25
                  bg-surface
                  px-3 text-sm
                  transition
                  focus:outline-none
                  focus:ring-1 focus:ring-primary/60
                  hover:border-primary-soft
                "
              />
              <button
                onClick={() => sendMutation.mutate(nickname)}
                className="
                  h-11 shrink-0 whitespace-nowrap
                  rounded-lg
                  bg-primary px-4
                  text-sm font-medium text-white
                  transition
                  hover:bg-primary-hover
                "
              >
                추가
              </button>
            </div>

            {friends.length === 0 ? (
              <p className="text-sm text-text-secondary">
                친구가 없습니다.
              </p>
            ) : (
              <ul className="space-y-3">
                {friends.map((f) => (
                  <li
                    key={f.id}
                    className="flex items-center justify-between text-sm"
                  >
                    <span>친구 이름 : {f.nickname}</span>
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
                  </li>
                ))}
              </ul>
            )}
          </>
        )}

        {/* 받은 요청 */}
        {tab === 'received' && (
          <>
            {received.length === 0 ? (
              <p className="text-sm text-text-secondary">
                받은 요청이 없습니다.
              </p>
            ) : (
              <ul className="space-y-3">
                {received.map((r) => (
                  <li
                    key={r.id}
                    className="flex items-center justify-between text-sm"
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

        {/* 보낸 요청 */}
        {tab === 'sent' && (
          <>
            {sent.length === 0 ? (
              <p className="text-sm text-text-secondary">
                보낸 요청이 없습니다.
              </p>
            ) : (
              <ul className="space-y-3 text-sm text-text-secondary">
                {sent.map((r) => (
                  <li key={r.id}>
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
    </>
  );
}
