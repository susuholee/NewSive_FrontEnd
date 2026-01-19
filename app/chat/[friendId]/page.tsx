"use client";

import { useAuthStore } from "@/shared/store/authStore";
import { useRequireAuth } from "@/shared/hooks/useRequireAuth";
import { useEffect, useRef, useState } from "react";
import { useParams } from "next/navigation";
import { getChatSocket, closeChatSocket } from "@/shared/socket/chatSocket";
import type { Socket } from "socket.io-client";
import type { ChatMessage } from "@/shared/types/chat";
import { formatChatTime } from "@/shared/utils/time";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { getChatMessages } from "@/shared/api/chatMessages.api";
import { ConfirmModal } from "@/shared/components/ConfirmModal";

export default function ChatPage() {
  useRequireAuth();

  const user = useAuthStore((state) => state.user);
  const { friendId } = useParams<{ friendId: string }>();
  const queryClient = useQueryClient();

  const [realtimeMessages, setRealtimeMessages] = useState<ChatMessage[]>([]);
  const [messageInput, setMessageInput] = useState("");
  const [isJoining, setIsJoining] = useState(true);
  const [roomId, setRoomId] = useState<string | null>(null);
  const [peerUser, setPeerUser] =
    useState<{ id: number; nickname: string } | null>(null);

  const [deleteTargetId, setDeleteTargetId] = useState<string | null>(null);


  const [editingMessageId, setEditingMessageId] = useState<string | null>(null);
  const [editingContent, setEditingContent] = useState("");

  const socketRef = useRef<Socket | null>(null);
  const bottomRef = useRef<HTMLDivElement | null>(null);
  const roomIdRef = useRef<string | null>(null);



  useEffect(() => {
    if (!user || !friendId) return;

    const peerUserId = Number(friendId);
    if (Number.isNaN(peerUserId)) return;

    const socket = getChatSocket();
    socketRef.current = socket;
    socket.connect();

    socket.on("connect", () => {
      socket.emit("chat:join", { peerUserId });
    });

    socket.on("chat:joined", ({ roomId, peerUser }) => {
      roomIdRef.current = roomId;
      setRoomId(roomId);
      setPeerUser(peerUser);
      setIsJoining(false);
    });

    socket.on("chat:message", (message: ChatMessage) => {
      setRealtimeMessages((prev) => {
        if (prev.some((m) => m.id === message.id)) return prev;
        return [...prev, message];
      });
    });

    
    socket.on("chat:deleted", ({ messageId }: { messageId: string }) => {
      setRealtimeMessages((prev) => prev.map((msg) => msg.id === messageId ? { ...msg, isDeleted: true, content: null }: msg)
      );

      queryClient.setQueryData<ChatMessage[]>(["chatMessages", roomIdRef.current], (old) => old ? old.map((msg) => msg.id === messageId ? { ...msg, isDeleted: true, content: null }: msg): old
      );
    });


    socket.on("chat:updated",({ messageId, newContent, editedAt }) => { setRealtimeMessages((prev) =>
          prev.map((msg) => msg.id === messageId ? { ...msg, content: newContent, editedAt }: msg));

        queryClient.setQueryData<ChatMessage[]>(["chatMessages", roomIdRef.current], (old) => old? old.map((msg) => msg.id === messageId ? { ...msg, content: newContent, editedAt }: msg): old);
      }
    );

    socket.on("chat:error", (err) => {
      alert(err.message);
    });

    return () => {
      socket.off("connect");
      socket.off("chat:joined");
      socket.off("chat:message");
      socket.off("chat:deleted");
      socket.off("chat:updated");
      socket.off("chat:error");
      closeChatSocket();
    };
  }, [user, friendId, queryClient]);



  const { data: history = [], isLoading: isHistoryLoading } = useQuery({
    queryKey: ["chatMessages", roomId],
    queryFn: () => getChatMessages(roomId!, 30),
    enabled: !!roomId,
  });

  const messages = Array.from(
    new Map([...history, ...realtimeMessages].map((msg) => [msg.id, msg])).values()
  );

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages.length]);


  const handleSendMessage = () => {
    if (!messageInput.trim()) return;
    if (!roomIdRef.current) return;

    socketRef.current?.emit("chat:send", {
      roomId: roomIdRef.current,
      content: messageInput,
    });

    setMessageInput("");
  };

  const confirmDeleteMessage = () => {
    if (!deleteTargetId) return;

    socketRef.current?.emit("chat:delete", {
      messageId: deleteTargetId,
    });

    setDeleteTargetId(null);
  };


  const startEditMessage = (msg: ChatMessage) => {
    setEditingMessageId(msg.id);
    setEditingContent(msg.content || "");
  };


  const cancelEditMessage = () => {
    setEditingMessageId(null);
    setEditingContent("");
  };


  const submitEditMessage = (messageId: string) => {
    if (!editingContent.trim()) return;

    socketRef.current?.emit("chat:update", {
      messageId,
      newContent: editingContent,
    });

    setEditingMessageId(null);
    setEditingContent("");
  };



  if (!friendId) {
    return <div className="p-6">잘못된 접근입니다.</div>;
  }

  if (isJoining) {
    return (
      <div className="flex h-screen items-center justify-center bg-background">
        <div className="flex flex-col items-center gap-2 text-text-secondary">
          <div className="h-6 w-6 animate-spin rounded-full border-2 border-primary border-t-transparent" />
          <span className="text-sm">채팅방 입장 중…</span>
        </div>
      </div>
    );
  }

  return (
    <main className="flex h-screen flex-col bg-background">
      <header className="flex items-center gap-3 border-b bg-surface px-4 py-3">
        <span className="text-sm font-semibold text-text-primary">
          {peerUser ? `${peerUser.nickname} 님과 대화중` : "대화 중"}
        </span>
      </header>

      <section className="flex-1 space-y-3 overflow-y-auto px-4 py-4">
        {isHistoryLoading && (
          <div className="text-center text-sm text-text-secondary">
            이전 메시지를 불러오는 중...
          </div>
        )}

        {messages.map((msg) => {
          const isMe = msg.senderId === user?.id;

          return (
            <div
              key={msg.id}
              className={`flex ${isMe ? "justify-end" : "justify-start"}`}
            >
              <div
                className={`relative inline-block w-fit max-w-[70%] rounded-2xl px-3 py-2 ${
                  isMe
                    ? "bg-primary text-white"
                    : "bg-surface-muted text-text-primary"
                } ${msg.isDeleted ? "italic text-text-secondary" : ""}`}
              >
                {!isMe && (
                  <p className="mb-1 text-xs font-medium text-primary">
                    {msg.senderNickname}
                  </p>
                )}

         
                {isMe && !msg.isDeleted && (
                  <div className="absolute right-full top-1 mr-1 flex items-center gap-1">
                    <button
                      onClick={() => startEditMessage(msg)}
                      className="whitespace-nowrap rounded px-1 text-xs text-gray-400 hover:text-blue-500"
                    >
                      수정
                    </button>

                    <button
                      onClick={() => setDeleteTargetId(msg.id)}
                      className="whitespace-nowrap rounded px-1 text-xs text-gray-400 hover:text-red-500"
                    >
                      삭제
                    </button>
                  </div>
                )}

            
  {editingMessageId === msg.id ? (
  <div className="relative z-20 w-full max-w-[280px] rounded-xl bg-white p-3 shadow-lg">
    {/* 안내 텍스트 */}
    <p className="mb-1 text-[11px] text-gray-400">메시지 수정</p>

    {/* 입력창 */}
    <input
      value={editingContent}
      onChange={(e) => setEditingContent(e.target.value)}
      onKeyDown={(e) => {
        if (e.key === "Enter") {
          e.preventDefault();
          submitEditMessage(msg.id);
        }
        if (e.key === "Escape") {
          cancelEditMessage();
        }
      }}
      autoFocus
      className="w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm text-black focus:border-primary focus:outline-none"
    />


    <div className="mt-2 flex justify-end gap-3 text-xs">
      <button
        onClick={cancelEditMessage}
        className="text-gray-400 hover:text-gray-600"
      >
        취소
      </button>

        <button
          onClick={() => submitEditMessage(msg.id)}
          disabled={!editingContent.trim()}
          className={`font-medium ${
            editingContent.trim()
              ? "text-primary hover:underline"
              : "cursor-not-allowed text-gray-300"
          }`}
        >
          저장
        </button>

            </div>
          </div>
        ) : (
          <p className="text-sm leading-relaxed">
            {msg.isDeleted ? "삭제된 메시지입니다" : msg.content}
            {!msg.isDeleted && msg.editedAt && (
              <span className="ml-1 text-[11px] opacity-60">(수정됨)</span>
            )}
          </p>
        )}



                <p className="mt-1 text-right text-[11px] opacity-70">
                  {formatChatTime(msg.createdAt)}
                </p>
              </div>
            </div>
          );
        })}

        <div ref={bottomRef} />
      </section>

      <footer className="border-t bg-surface px-4 py-3">
        <div className="flex gap-2">
          <input
            type="text"
            placeholder="메시지를 입력하세요"
            className="flex-1 rounded-xl border bg-background px-4 py-2 text-sm"
            value={messageInput}
            onChange={(e) => setMessageInput(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                e.preventDefault();
                handleSendMessage();
              }
            }}
          />
          <button
            onClick={handleSendMessage}
            disabled={!messageInput.trim()}
            className="rounded-xl bg-primary px-4 py-2 text-sm font-medium text-white"
          >
            전송
          </button>
        </div>
      </footer>

      {deleteTargetId && (
        <ConfirmModal
          title="메시지 삭제"
          description="이 메시지를 삭제하면 되돌릴 수 없습니다."
          confirmText="삭제"
          cancelText="취소"
          onCancel={() => setDeleteTargetId(null)}
          onConfirm={confirmDeleteMessage}
        />
      )}
    </main>
  );
}
