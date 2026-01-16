"use client";

import { useAuthStore } from "@/shared/store/authStore";
import { useRequireAuth } from "@/shared/hooks/useRequireAuth";
import { useEffect, useRef, useState } from "react";
import { useParams } from "next/navigation";
import { getChatSocket, closeChatSocket } from "@/shared/socket/chatSocket";
import type { Socket } from "socket.io-client";
import type { ChatMessage } from "@/shared/types/chat";

export default function ChatPage() {
  useRequireAuth();

  const user = useAuthStore((state) => state.user);
  const { friendId } = useParams<{ friendId: string }>();
  
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [messageInput, setMessageInput] = useState("");

  const [isJoining, setIsJoining] = useState(true);

  
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

    socket.on("chat:joined", ({ roomId }: { roomId: string }) => {
      roomIdRef.current = roomId;
      setIsJoining(false);                  
    });

    socket.on("chat:message", (message: ChatMessage) => {
      setMessages((prev) => [...prev, message]);
    });

    socket.on("chat:error", (err) => {
      console.error("CHAT ERROR:", err.message);
    });

    return () => {
      socket.off("connect");
      socket.off("chat:joined");
      socket.off("chat:message");
      socket.off("chat:error");
      closeChatSocket();
    };
  }, [user, friendId]);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSendMessage = () => {
    if (!messageInput.trim()) return;
    if (!roomIdRef.current) return;

    socketRef.current?.emit("chat:send", {
      roomId: roomIdRef.current,
      content: messageInput,
    });

    setMessageInput("");
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
      {/* Header */}
      <header className="flex items-center gap-3 border-b bg-surface px-4 py-3">
        <span className="text-sm font-semibold text-text-primary">
          대화 중  
        </span>
      </header>

      {/* Message List */}
      <section className="flex-1 space-y-3 overflow-y-auto px-4 py-4">
        {messages.map((msg) => {
          const isMe = msg.senderId === user?.id;

          return (
            <div
              key={msg.id}
              className={`flex ${isMe ? "justify-end" : "justify-start"}`}
            >
              <div
                className={`max-w-xs rounded-2xl px-3 py-2 ${
                  isMe
                    ? "bg-primary text-white"
                    : "bg-surface-muted text-text-primary"
                }`}
              >
                {!isMe && (
                  <p className="mb-1 text-xs font-medium text-primary">
                    {msg.senderNickname}
                  </p>
                )}

                <p className="text-sm leading-relaxed">
                  {msg.content}
                </p>

                <p className="mt-1 text-right text-[11px] opacity-70">
                  {msg.createdAt}
                </p>
              </div>
            </div>
          );
        })}

        <div ref={bottomRef} />
      </section>

      {/* Input */}
      <footer className="border-t bg-surface px-4 py-3">
        <div className="flex gap-2">
          <input
            type="text"
            placeholder="메시지를 입력하세요"
            className="flex-1 rounded-xl border bg-background px-4 py-2 text-sm text-text-primary placeholder:text-text-secondary focus:border-primary focus:outline-none"
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
            className="rounded-xl bg-primary px-4 py-2 text-sm font-medium text-white transition hover:bg-primary-hover disabled:opacity-50"
            disabled={!messageInput.trim()}
          >
            전송
          </button>
        </div>
      </footer>
    </main>
  );
}
