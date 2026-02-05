"use client";

import { useAuthStore } from "@/shared/store/authStore";
import { useRequireAuth } from "@/shared/hooks/useRequireAuth";
import { useEffect, useRef, useState } from "react";
import { useSearchParams } from "next/navigation";
import { io, Socket } from "socket.io-client";
import type { ChatMessage } from "@/shared/types/chat";
import { formatChatTime } from "@/shared/utils/time";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { getChatMessages } from "@/shared/api/chatMessages.api";
import { uploadChatMedia } from "@/shared/api/media.api";
import { ConfirmModal } from "@/shared/components/ConfirmModal";

type FilePreview = {
  file: File;
  url: string;
  type: "IMAGE" | "VIDEO";
};

export default function ChatPage() {
  useRequireAuth();

  const user = useAuthStore((state) => state.user);
  const searchParams = useSearchParams();
  const friendId = searchParams.get("friendId");
  const queryClient = useQueryClient();

  const [realtimeMessages, setRealtimeMessages] = useState<ChatMessage[]>([]);
  const [messageInput, setMessageInput] = useState("");

  const [editingMessageId, setEditingMessageId] = useState<string | null>(null);
  const [editingContent, setEditingContent] = useState("");

  const [files, setFiles] = useState<File[]>([]);
  const [filePreviews, setFilePreviews] = useState<FilePreview[]>([]);

  const [isJoining, setIsJoining] = useState(true);
  const [roomId, setRoomId] = useState<string | null>(null);
  const [peerUser, setPeerUser] = useState<{
    id: number;
    nickname: string;
    profileImgUrl: string;
  } | null>(null);

  const [socketError, setSocketError] = useState<{
    title: string;
    description?: string;
    type: "unauthorized" | "general";
  } | null>(null);

  const socketRef = useRef<Socket | null>(null);
  const roomIdRef = useRef<string | null>(null);
  const bottomRef = useRef<HTMLDivElement | null>(null);

  if (!friendId) {
    return (
      <div className="flex h-screen items-center justify-center text-text-secondary">
        잘못된 접근입니다
      </div>
    );
  }

  useEffect(() => {
    if (!user || !friendId) return;

    const peerUserId = Number(friendId);
    if (Number.isNaN(peerUserId)) return;

    const socket = io(process.env.NEXT_PUBLIC_WS_URL!, {
      withCredentials: true,
      transports: ["websocket"],
    });

    socketRef.current = socket;

    socket.on("connect", () => {
      console.log("connect socket id", socket.id);
      socket.emit("chat:join", { peerUserId });
      console.log("emit chat:join", peerUserId);
    });

    socket.on("chat:joined", ({ roomId, peerUser }) => {
      roomIdRef.current = roomId;
      setRoomId(roomId);
      setPeerUser(peerUser);
      setIsJoining(false);
    });

    socket.on("chat:message", (message: ChatMessage) => {
      setRealtimeMessages((prev) =>
        prev.some((m) => m.id === message.id) ? prev : [...prev, message]
      );
    });

    socket.on("chat:updated", ({ messageId, newContent, editedAt }) => {
      setRealtimeMessages((prev) =>
        prev.map((m) =>
          m.id === messageId
            ? { ...m, content: newContent, editedAt }
            : m
        )
      );

      queryClient.setQueryData<ChatMessage[]>(
        ["chatMessages", roomIdRef.current],
        (old) =>
          old
            ? old.map((m) =>
                m.id === messageId
                  ? { ...m, content: newContent, editedAt }
                  : m
              )
            : old
      );
    });

    socket.on("chat:media:deleted", ({ messageId, mediaId }) => {
      setRealtimeMessages((prev) =>
        prev.map((m) =>
          m.id === messageId
            ? {
                ...m,
                medias: m.medias?.filter((md) => md.id !== mediaId),
              }
            : m
        )
      );
    });

    socket.on("chat:error", (err) => {
      console.error("chat error:", err);
      setIsJoining(false);

      if (err?.message === "Unauthorized") {
        setSocketError({
          title: "로그인이 필요합니다",
          description: "세션이 만료되었습니다. 다시 로그인해주세요.",
          type: "unauthorized",
        });
      } else {
        setSocketError({
          title: "채팅 오류",
          description: err?.message ?? "채팅 중 문제가 발생했습니다.",
          type: "general",
        });
      }
    });

    return () => {
      socket.disconnect();
      socketRef.current = null;
    };
  }, [user, friendId, queryClient]);

  const { data: history = [] } = useQuery({
    queryKey: ["chatMessages", roomId],
    queryFn: () => getChatMessages(roomId!, 30),
    enabled: !!roomId,
  });

  const messages = Array.from(
    new Map([...history, ...realtimeMessages].map((m) => [m.id, m])).values()
  );

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages.length]);

  const handleSendMessage = async () => {
    if (!roomIdRef.current) return;

    const hasContent = messageInput.trim().length > 0;
    const hasFiles = files.length > 0;
    if (!hasContent && !hasFiles) return;

    let medias: { url: string; type: "IMAGE" | "VIDEO" }[] = [];

    if (hasFiles) {
      const media = await uploadChatMedia(files[0]);
      medias = [media];
    }

    socketRef.current?.emit("chat:send", {
      roomId: roomIdRef.current,
      content: hasContent ? messageInput : null,
      medias,
    });

    setMessageInput("");
    setFiles([]);
    setFilePreviews([]);
  };

  const handleUpdateMessage = (messageId: string) => {
    if (!editingContent.trim()) return;

    socketRef.current?.emit("chat:update", {
      messageId,
      newContent: editingContent.trim(),
    });

    setEditingMessageId(null);
    setEditingContent("");
  };

  const handleDeleteMedia = (mediaId: string) => {
    socketRef.current?.emit("chat:media:delete", { mediaId });
  };

  if (isJoining) {
    return (
      <div className="flex h-screen items-center justify-center text-text-secondary">
        입장 중…
      </div>
    );
  }

  return (
    <>
      {socketError && (
        <ConfirmModal
          title={socketError.title}
          description={socketError.description}
          confirmText={
            socketError.type === "unauthorized" ? "로그인" : "확인"
          }
          cancelText="닫기"
          onConfirm={() => {
            setSocketError(null);
            if (socketError.type === "unauthorized") {
              window.location.href = "/login";
            }
          }}
          onCancel={() => {
            setSocketError(null);
            window.location.href = "/";
          }}
        />
      )}

      <main className="flex h-screen flex-col bg-background">
        <header className="flex items-center gap-3 border-b border-surface-muted px-5 py-4">
          {peerUser && (
            <>
              <img
                src={peerUser.profileImgUrl}
                alt={`${peerUser.nickname} 프로필`}
                className="h-8 w-8 rounded-full object-cover"
              />
              <h1 className="text-sm font-medium text-text-primary">
                {peerUser.nickname}님
              </h1>
            </>
          )}
        </header>

        <section className="flex-1 overflow-y-auto px-4 py-6 space-y-4 pb-24">
          {messages.map((msg) => {
            const isMe = msg.senderId === user?.id;
            const isEditing = editingMessageId === msg.id;

            const shouldShowDeleted =
              msg.isDeleted || (!msg.content && msg.medias?.length === 0);

            return (
              <div
                key={msg.id}
                className={`flex ${
                  isMe ? "justify-end" : "justify-start"
                }`}
              >
                <div
                  className={`max-w-[72%] rounded-2xl px-4 py-3 text-sm leading-relaxed relative group ${
                    isMe
                      ? "bg-primary-soft rounded-br-md"
                      : "bg-surface-muted rounded-bl-md"
                  }`}
                >
                  {shouldShowDeleted ? (
                    <p className="italic text-text-secondary">
                      삭제된 메시지입니다
                    </p>
                  ) : (
                    <>
                      {msg.medias?.map((m) => (
                        <div
                          key={m.id}
                          className="relative mb-3 overflow-hidden rounded-xl"
                        >
                          {isMe && (
                            <button
                              onClick={() => handleDeleteMedia(m.id)}
                              className="absolute right-1 top-1 z-20 rounded-md bg-black/60 px-2 py-0.5 text-xs text-white"
                            >
                              삭제
                            </button>
                          )}

                          {m.type === "IMAGE" ? (
                            <img
                              src={m.url}
                              className="w-full object-cover"
                            />
                          ) : (
                            <video
                              src={m.url}
                              controls
                              className="w-full"
                            />
                          )}
                        </div>
                      ))}

                      {msg.content && (
                        <>
                          {isEditing ? (
                            <div className="flex items-center gap-2">
                              <input
                                autoFocus
                                value={editingContent}
                                onChange={(e) =>
                                  setEditingContent(e.target.value)
                                }
                                onKeyDown={(e) => {
                                  if (e.key === "Enter")
                                    handleUpdateMessage(msg.id);
                                  if (e.key === "Escape") {
                                    setEditingMessageId(null);
                                    setEditingContent("");
                                  }
                                }}
                                className="flex-1 rounded-lg bg-white/70 px-2 py-1 text-sm"
                              />
                              <button
                                onClick={() =>
                                  handleUpdateMessage(msg.id)
                                }
                                className="rounded-md bg-primary px-2 py-1 text-xs text-white"
                              >
                                저장
                              </button>
                              <button
                                onClick={() => {
                                  setEditingMessageId(null);
                                  setEditingContent("");
                                }}
                                className="rounded-md bg-surface-muted px-2 py-1 text-xs text-text-secondary"
                              >
                                취소
                              </button>
                            </div>
                          ) : (
                            <p>{msg.content}</p>
                          )}

                          {msg.editedAt && !isEditing && (
                            <span className="ml-1 text-[10px] text-text-secondary">
                              (수정됨)
                            </span>
                          )}
                        </>
                      )}
                    </>
                  )}

                  <div className="mt-2 flex items-center justify-end gap-2">
                    {isMe && msg.content && !isEditing && (
                      <button
                        onClick={() => {
                          setEditingMessageId(msg.id);
                          setEditingContent(msg.content ?? "");
                        }}
                        className="text-xs text-text-secondary opacity-0 group-hover:opacity-100 transition"
                      >
                        수정
                      </button>
                    )}

                    <span className="text-xs text-text-secondary">
                      {formatChatTime(msg.createdAt)}
                    </span>
                  </div>
                </div>
              </div>
            );
          })}
          <div ref={bottomRef} />
        </section>

        {filePreviews.length > 0 && (
          <div className="border-t border-surface-muted bg-surface px-4 py-3">
            <div className="relative w-40 overflow-hidden rounded-xl">
              <button
                onClick={() => {
                  setFiles([]);
                  setFilePreviews([]);
                }}
                className="absolute right-1 top-1 z-10 rounded-full bg-black/60 px-2 py-0.5 text-xs text-white"
              >
                ✕
              </button>

              {filePreviews[0].type === "IMAGE" ? (
                <img
                  src={filePreviews[0].url}
                  className="h-32 w-full object-cover"
                />
              ) : (
                <video
                  src={filePreviews[0].url}
                  className="h-32 w-full object-cover"
                  controls
                />
              )}
            </div>
          </div>
        )}

        <footer className="border-t border-surface-muted bg-surface px-4 py-3">
          <div className="flex items-center gap-2">
            <input
              type="file"
              hidden
              id="media-input"
              accept="image/*,video/*"
              onChange={(e) => {
                const file = e.target.files?.[0];
                if (!file) return;

                setFiles([file]);
                setFilePreviews([
                  {
                    file,
                    url: URL.createObjectURL(file),
                    type: file.type.startsWith("video")
                      ? "VIDEO"
                      : "IMAGE",
                  },
                ]);
              }}
            />

            <label
              htmlFor="media-input"
              className="cursor-pointer rounded-xl bg-surface-muted px-4 py-2 text-sm text-text-secondary"
            >
              파일 첨부
            </label>

            <input
              value={messageInput}
              onChange={(e) => setMessageInput(e.target.value)}
              onKeyDown={(e) =>
                e.key === "Enter" && handleSendMessage()
              }
              placeholder="메시지를 입력하세요"
              className="flex-1 rounded-xl bg-surface-muted px-4 py-2 text-sm"
            />

            <button
              onClick={handleSendMessage}
              className="rounded-xl bg-primary px-4 py-2 text-sm text-white"
            >
              전송
            </button>
          </div>
        </footer>
      </main>
    </>
  );
}
