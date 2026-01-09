"use client";

import { useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import type { AxiosError } from "axios";

import { getFriends, removeFriend, sendFriendRequestByNickname } from "../../../shared/api/friends.api";
import type { Friend } from "../../../shared/types/friend";
import { ConfirmModal } from "@/shared/components/ConfirmModal";

type ConfirmState = {
  title: string;
  description?: string;
  onConfirm: () => void;
};

type ErrorResponse = {
  message: string;
};

export default function FriendsPage() {
  const [friendNickname, setFriendNickname] = useState("");
  const [confirmState, setConfirmState] = useState<ConfirmState | null>(null);


  const { data: friends = [], isLoading } = useQuery<Friend[]>({
    queryKey: ["friends"],
    queryFn: getFriends,
  });


  const sendRequestMutation = useMutation<
    unknown,
    AxiosError<ErrorResponse>,
    string
  >({
    mutationFn: (nickname) => sendFriendRequestByNickname(nickname),
    onSuccess: () => {
      setFriendNickname("");
      setConfirmState({
        title: "친구 요청 전송",
        description: "친구 요청을 보냈습니다.",
        onConfirm: () => setConfirmState(null),
      });
    },
    onError: (error) => {
      setConfirmState({
        title: "요청 실패",
        description:
          error.response?.data?.message ??
          "친구 요청 중 오류가 발생했습니다.",
        onConfirm: () => setConfirmState(null),
      });
    },
  });


  const deleteFriendMutation = useMutation({
    mutationFn: (friendUserId: number) => removeFriend(friendUserId),
    onSuccess: () => {
    },
  });

  const handleSendRequest = () => {
    if (!friendNickname.trim()) {
      setConfirmState({
        title: "입력 오류",
        description: "친구 닉네임을 입력하세요.",
        onConfirm: () => setConfirmState(null),
      });
      return;
    }

    sendRequestMutation.mutate(friendNickname);
  };

  const handleDeleteFriend = (friendUserId: number) => {
    setConfirmState({
      title: "친구 삭제",
      description: "정말 이 친구를 삭제하시겠습니까?",
      onConfirm: () => {
        deleteFriendMutation.mutate(friendUserId);
        setConfirmState(null);
      },
    });
  };

  return (
    <>
      <main className="mx-auto max-w-2xl px-4 py-8">
        <h1 className="mb-6 text-2xl font-bold">친구 관리</h1>

      
        <section className="mb-8 rounded-lg bg-surface p-4 shadow-sm">
          <h2 className="mb-2 font-semibold">친구 요청 보내기</h2>
          <div className="flex gap-2">
            <input
              value={friendNickname}
              onChange={(e) => setFriendNickname(e.target.value)}
              placeholder="친구 닉네임 입력"
              className="flex-1 rounded-md border px-3 py-2"
            />
            <button
              onClick={handleSendRequest}
              disabled={sendRequestMutation.isPending}
              className="rounded-md bg-primary px-4 py-2 text-white"
            >
              요청 보내기
            </button>
          </div>
        </section>

      
        <section className="rounded-lg bg-surface p-4 shadow-sm">
          <h2 className="mb-4 font-semibold">친구 목록</h2>

          {isLoading ? (
            <p>로딩 중...</p>
          ) : friends.length === 0 ? (
            <p>등록된 친구가 없습니다.</p>
          ) : (
            <ul className="space-y-3">
              {friends.map((friend) => (
                <li key={friend.id} className="flex justify-between">
                  <div>
                    <p>{friend.nickname}</p>
                    <p className="text-xs">@{friend.username}</p>
                  </div>
                  <button
                    onClick={() => handleDeleteFriend(friend.userId)}
                    className="text-sm text-danger"
                  >
                    삭제
                  </button>
                </li>
              ))}
            </ul>
          )}
        </section>
      </main>

      {confirmState && (
        <ConfirmModal
          title={confirmState.title}
          description={confirmState.description}
          onConfirm={confirmState.onConfirm}
          onCancel={() => setConfirmState(null)}
        />
      )}
    </>
  );
}
