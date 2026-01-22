'use client';

import Link from "next/link";
import { useAuthStore } from "@/shared/store/authStore";

export default function MyPage() {
  const user = useAuthStore((state) => state.user);

  return (
    <main className="min-h-screen bg-background py-12 text-text-primary">
      <div className="mx-auto max-w-6xl px-4">
        <div className="grid grid-cols-1 gap-10 md:grid-cols-3">

          {/* Profile Sidebar */}
          <aside className="rounded-2xl bg-surface p-8 shadow-sm border border-surface-muted">
            <div className="flex flex-col items-center text-center">
              <div className="relative mb-5 h-24 w-24 overflow-hidden rounded-full bg-surface-muted ring-2 ring-primary/20">
                {user?.profileImgUrl ? (
                  <img
                    src={user.profileImgUrl}
                    alt="프로필"
                    className="h-full w-full rounded-full object-cover"
                  />
                ) : (
                  <div className="flex h-full w-full items-center justify-center text-3xl font-semibold text-text-secondary">
                    {user?.nickname?.[0] || "U"}
                  </div>
                )}
              </div>

              <h3 className="text-lg font-semibold">{user?.nickname}</h3>
              <p className="mt-1 text-sm text-text-secondary">{user?.username}</p>

              <Link
                href="/mypage/account"
                className="mt-6 inline-flex items-center justify-center rounded-full border border-primary px-6 py-2 text-sm font-medium text-primary transition hover:bg-primary hover:text-white"
              >
                프로필 수정
              </Link>
            </div>
          </aside>

  
          <div className="md:col-span-2">
      
            <section className="mb-10 rounded-2xl bg-surface p-8 shadow-sm border border-surface-muted">
              <h2 className="mb-6 text-lg font-semibold">내 정보</h2>

              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div className="rounded-xl bg-surface-muted p-4">
                  <p className="text-xs text-text-secondary">계정 아이디</p>
                  <p className="mt-1 font-medium">{user?.username}</p>
                </div>

                <div className="rounded-xl bg-surface-muted p-4">
                  <p className="text-xs text-text-secondary">닉네임</p>
                  <p className="mt-1 font-medium">{user?.nickname}</p>
                </div>
              </div>
            </section>

            {/* Settings */}
            <section className="mb-8 overflow-hidden rounded-2xl bg-surface shadow-sm border border-surface-muted">
              <h2 className="px-8 pt-6 text-lg font-semibold">설정</h2>

              <ul className="mt-4 divide-y divide-surface-muted text-sm">
                <li>
                  <Link
                    href="/settings/notifications"
                    className="flex items-center justify-between px-8 py-4 transition hover:bg-surface-muted"
                  >
                    <span className="font-medium">알림 설정</span>
                    <span className="text-text-secondary">변경</span>
                  </Link>
                </li>
              </ul>
            </section>
          </div>
        </div>
      </div>
    </main>
  );
}
