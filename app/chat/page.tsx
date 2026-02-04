import { Suspense } from "react";
import ChatPageClient from "./ChatPageClient";

export default function ChatPage() {
  return (
    <Suspense
      fallback={
        <div className="flex h-screen items-center justify-center text-text-secondary">
          로딩 중…
        </div>
      }
    >
      <ChatPageClient />
    </Suspense>
  );
}
