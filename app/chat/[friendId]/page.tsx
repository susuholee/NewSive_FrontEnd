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
import { uploadChatMedia } from "@/shared/api/media.api";

type FilePreview = {
  file: File;
  url: string;
  type: "IMAGE" | "VIDEO";
};

export default function ChatPage() {
  useRequireAuth();

  const user = useAuthStore((state) => state.user);
  const { friendId } = useParams<{ friendId: string }>();
  const queryClient = useQueryClient();

  const [realtimeMessages, setRealtimeMessages] = useState<ChatMessage[]>([]);
  const [messageInput, setMessageInput] = useState("");
  const [files, setFiles] = useState<File[]>([]);
  const [filePreviews, setFilePreviews] = useState<FilePreview[]>([]);
  const [isJoining, setIsJoining] = useState(true);
  const [roomId, setRoomId] = useState<string | null>(null);
  const [peerUser, setPeerUser] = useState<{
    id: number;
    nickname: string;
    profileImgUrl: string;
  } | null>(null);

  const socketRef = useRef<Socket | null>(null);
  const roomIdRef = useRef<string | null>(null);
  const bottomRef = useRef<HTMLDivElement | null>(null);

  /* ================= SOCKET ================= */

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
      setRealtimeMessages((prev) =>
        prev.some((m) => m.id === message.id) ? prev : [...prev, message]
      );
    });

    socket.on(
      "chat:media:deleted",
      ({ messageId, mediaId }: { messageId: string; mediaId: string }) => {
        setRealtimeMessages((prev) =>
          prev.map((m) =>
            m.id === messageId
              ? { ...m, medias: m.medias?.filter((md) => md.id !== mediaId) }
              : m
          )
        );

        queryClient.setQueryData<ChatMessage[]>(
          ["chatMessages", roomIdRef.current],
          (old) =>
            old
              ? old.map((m) =>
                  m.id === messageId
                    ? {
                        ...m,
                        medias: m.medias?.filter(
                          (md) => md.id !== mediaId
                        ),
                      }
                    : m
                )
              : old
        );
      }
    );

    socket.on("chat:error", (err) => alert(err.message));

    return () => {
      socket.off();
      closeChatSocket();
    };
  }, [user, friendId, queryClient]);

  /* ================= HISTORY ================= */

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

  /* ================= ACTIONS ================= */

  const handleSendMessage = async () => {
    if (!roomIdRef.current) return;

    const hasContent = messageInput.trim().length > 0;
    const hasFiles = files.length > 0;
    if (!hasContent && !hasFiles) return;

    let medias: { url: string; type: "IMAGE" | "VIDEO" }[] = [];

    if (hasFiles) {
      medias = await Promise.all(files.map((f) => uploadChatMedia(f)));
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

  const handleDeleteMedia = (mediaId: string) => {
    socketRef.current?.emit("chat:media:delete", { mediaId });
  };

  /* ================= UI ================= */

  if (isJoining) {
    return (
      <div className="flex h-screen items-center justify-center text-text-secondary">
        입장 중…
      </div>
    );
  }

  return (
    <main className="flex h-screen flex-col bg-background">
      {/* Header */}
      <header className="flex items-center gap-3 border-b border-surface-muted px-5 py-4">
        {peerUser && (
          <>
            <img
              src={peerUser.profileImgUrl}
              alt={`${peerUser.nickname} 프로필`}
              className="h-8 w-8 rounded-full object-cover"
            />
            <h1 className="text-sm font-medium text-text-primary">
              {peerUser.nickname} 님과의 대화
            </h1>
          </>
        )}
      </header>

      {/* Messages */}
      <section className="flex-1 overflow-y-auto px-4 py-6 space-y-4">
        {messages.map((msg) => {
          const isMe = msg.senderId === user?.id;

          const shouldShowDeleted =
            msg.isDeleted || (!msg.content && msg.medias?.length === 0);

          return (
            <div
              key={msg.id}
              className={`flex ${isMe ? "justify-end" : "justify-start"}`}
            >
              <div
                className={`
                  max-w-[72%]
                  rounded-2xl
                  px-4 py-3
                  text-sm
                  leading-relaxed
                  ${
                    isMe
                      ? "bg-primary-soft rounded-br-md"
                      : "bg-surface-muted rounded-bl-md"
                  }
                `}
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

                    {msg.content && <p>{msg.content}</p>}
                  </>
                )}

                <p className="mt-2 text-right text-xs text-text-secondary">
                  {formatChatTime(msg.createdAt)}
                </p>
              </div>
            </div>
          );
        })}
        <div ref={bottomRef} />
      </section>

      {/* Input */}
      <footer className="border-t border-surface-muted bg-surface px-4 py-3">
        <div className="flex items-center gap-2">
          <input
            type="file"
            multiple
            hidden
            id="media-input"
            onChange={(e) => {
              if (!e.target.files) return;

              const selected = Array.from(e.target.files);
              setFiles(selected);
              setFilePreviews(
                selected.map((file) => ({
                  file,
                  url: URL.createObjectURL(file),
                  type: file.type.startsWith("video")
                    ? "VIDEO"
                    : "IMAGE",
                }))
              );
            }}
          />

          <label
            htmlFor="media-input"
            className="cursor-pointer rounded-xl border px-4 py-2 text-sm"
          >
            파일 첨부
          </label>

          <input
            value={messageInput}
            onChange={(e) => setMessageInput(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleSendMessage()}
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
  );
}
