"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { getReceivedFriendRequests,acceptFriendRequest,rejectFriendRequest} from "@/shared/api/friendRequests.api";
import type { FriendRequest } from "@/shared/types/friendRequest";
import { ConfirmModal } from "@/shared/components/ConfirmModal";
import { useState } from "react";

type ConfirmState = {
  title: string;
  description?: string;
  onConfirm: () => void;
};

export default function FriendRequestsPage() {
  const queryClient = useQueryClient();
  const [confirm, setConfirm] = useState<ConfirmState | null>(null);

  const { data = [], isLoading } = useQuery<FriendRequest[]>({
    queryKey: ["friendRequests", "received"],
    queryFn: getReceivedFriendRequests,
  });

  const acceptMutation = useMutation({
    mutationFn: acceptFriendRequest,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["friendRequests", "received"] });
      queryClient.invalidateQueries({ queryKey: ["friends"] });
    },
  });

  const rejectMutation = useMutation({
    mutationFn: rejectFriendRequest,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["friendRequests", "received"] });
    },
  });

  if (isLoading) {
    return <p className="p-4 text-text-secondary">로딩 중...</p>;
  }

  return (
    <>
      <main className="mx-auto max-w-2xl px-4 py-8">
        <h1 className="mb-6 text-2xl font-bold">친구 요청</h1>

        {data.length === 0 ? (
          <p className="text-sm text-text-secondary">
            받은 친구 요청이 없습니다.
          </p>
        ) : (
          <ul className="space-y-3">
            {data.map((req) => (
              <li
                key={req.id}
                className="flex items-center justify-between rounded-md bg-surface-muted px-4 py-3"
              >
                <div>
                  <p className="font-medium">{req.user.nickname}</p>
                  <p className="text-xs text-text-secondary">
                    @{req.user.username}
                  </p>
                </div>

                <div className="flex gap-2">
                  <button
                    onClick={() =>
                      setConfirm({
                        title: "친구 요청 수락",
                        description: "이 친구 요청을 수락하시겠습니까?",
                        onConfirm: () => {
                          acceptMutation.mutate(req.id);
                          setConfirm(null);
                        },
                      })
                    }
                    className="rounded bg-primary px-3 py-1.5 text-sm text-white"
                  >
                    수락
                  </button>

                  <button
                    onClick={() =>
                      setConfirm({
                        title: "친구 요청 거절",
                        description: "이 친구 요청을 거절하시겠습니까?",
                        onConfirm: () => {
                          rejectMutation.mutate(req.id);
                          setConfirm(null);
                        },
                      })
                    }
                    className="rounded border px-3 py-1.5 text-sm text-text-secondary"
                  >
                    거절
                  </button>
                </div>
              </li>
            ))}
          </ul>
        )}
      </main>

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
