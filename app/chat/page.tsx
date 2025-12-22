"use client";
import Protected from "@/shared/components/Protected";

type ChatMessage = {
  id: number;
  user: string;
  message: string;
  createdAt: string;
  isMe?: boolean;
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
    user: "me",
    message: "네, 속보가 많네요.",
    createdAt: "08:06",
    isMe: true,
  },
];

export default function ChatPage() {
  return (
    <Protected>

    <main className="flex h-screen flex-col">
      <header className="border-b px-4 py-3 font-semibold">
        실시간 채팅
      </header>

      <section className="flex-1 space-y-3 overflow-y-auto px-4 py-4">
        {mockMessages.map((msg) => (
          <div
          key={msg.id}
          className={`flex ${
              msg.isMe ? "justify-end" : "justify-start"
            }`}
            >
            <div
              className={`max-w-xs rounded-lg px-3 py-2 text-sm ${
                msg.isMe
                ? "bg-blue-600 text-white"
                : "bg-gray-100 text-black"
              }`}
              >
              {!msg.isMe && (
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
        ))}
      </section>

      <footer className="border-t px-4 py-3">
        <div className="flex gap-2">
          <input
            type="text"
            placeholder="메시지를 입력하세요"
            className="flex-1 rounded border px-3 py-2"
            />
          <button className="rounded bg-blue-600 px-4 py-2 text-white">
            전송
          </button>
        </div>
      </footer>
    </main>
  </Protected>
  );
}
