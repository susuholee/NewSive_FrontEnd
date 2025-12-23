"use client";
import Protected from "@/shared/components/Protected";
import { useAuthStore } from "@/shared/store/authStore";
import { use, useState } from "react";

type ChatMessage = {
  id: number;
  user: string;
  message: string;
  createdAt: string;
};

const mockMessages: ChatMessage[] = [
  {
    id: 1,
    user: "관리자",
    message: "NewSive 채팅방에 오신 것을 환영합니다.",
    createdAt: "08:00",
  },
  {
    id: 2,
    user: "alice",
    message: "오늘 뉴스 다들 봤어요?",
    createdAt: "08:05",
  },
  {
    id: 3,
    user: "Tom",
    message: "네, 속보가 많네요.",
    createdAt: "08:06",
  },
];

export default function ChatPage() {
  const user = useAuthStore((state) => state.user);
  const [message, setMessage] = useState<ChatMessage[]>(mockMessages);
  const [messageInput, setMessageInput] = useState('');

  const handleSendMessage = () => {
  if (!user) return;
  if (!messageInput.trim()) return;

  const newMessage = {
    id: Date.now(),
    user: user.nickname,
    message: messageInput,
    createdAt: new Date().toLocaleTimeString([], {
      hour: '2-digit',
      minute: '2-digit',
    }),
  };

  setMessage((prev) => [...prev, newMessage]);
  setMessageInput('');
};

  return (
    <Protected>
    <main className="flex h-screen flex-col">
      <header className="border-b px-4 py-3 font-semibold">
        {
          user && (
            <span>
              접속한 계정 : {user.nickname}
            </span>
          )
        }
      </header>

      <section className="flex-1 space-y-3 overflow-y-auto px-4 py-4">
       {message.map((msg) => {
        const isMe = msg.user === user?.nickname;
        return (
      <div
      key={msg.id}
      className={`flex ${isMe ? "justify-end" : "justify-start"}`}>
      <div
        className={`max-w-xs rounded-lg px-3 py-2 text-sm ${
          isMe
            ? "bg-blue-600 text-white"
            : "bg-gray-100 text-black"
        }`}
      >
        {!isMe && (
          <p className="mb-1 text-xs text-gray-500">
            {msg.user}
          </p>
        )}
        <p>{msg.message}</p>
        <p className="mt-1 text-right text-xs opacity-70">
          {msg.createdAt}
        </p>
      </div>
    </div>
  );
})}
    </section>

      <footer className="border-t px-4 py-3">
        <div className="flex gap-2">
          <input
            type="text"
            placeholder="메시지를 입력하세요"
            className="flex-1 rounded border px-3 py-2"
            value={messageInput}
            onChange={(e) => setMessageInput(e.target.value)}
            onKeyDown={(e) => {
              if(e.key === "Enter"){
                e.preventDefault();
                handleSendMessage()
              }
            }}
            />
          <button onClick={handleSendMessage}
          className="rounded bg-red-200 px-4 py-2 text-black">
            전송
          </button>
        </div>
      </footer>
    </main>
  </Protected>
  );
}
