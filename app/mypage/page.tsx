'use client';

import Link from "next/link";
import { useAuthStore } from "@/shared/store/authStore";

export default function MyPage() {
  const user = useAuthStore((state) => state.user);

  return (
    <main className="min-h-screen bg-gray-50 py-10">
      <div className="mx-auto max-w-2xl px-4">
        <h1 className="mb-2 text-3xl font-bold text-gray-900">
          마이페이지
        </h1>
        <p className="mb-8 text-sm text-gray-500">
          계정 정보와 서비스 이용 환경을 관리할 수 있어요
        </p>

        <section className="mb-8 rounded-xl bg-white p-6 shadow-sm">
          <h2 className="mb-4 text-lg font-semibold text-gray-800">
            내 정보
          </h2>

          <dl className="space-y-3 text-sm">
            <div className="flex items-center justify-between">
              <dt className="text-gray-500">계정 아이디</dt>
              <dd className="font-medium text-gray-900">
                {user?.username ?? "-"}
              </dd>
            </div>
            <div className="flex items-center justify-between">
              <dt className="text-gray-500">닉네임</dt>
              <dd className="font-medium text-gray-900">
                {user?.nickname ?? "-"}
              </dd>
            </div>
          </dl>
        </section>

    
        <section className="mb-8 rounded-xl bg-white shadow-sm">
          <h2 className="px-6 pt-6 text-lg font-semibold text-gray-800">
            설정
          </h2>

          <ul className="mt-2 divide-y text-sm">
            <li>
              <Link
                href="/mypage/account"
                className="flex items-center justify-between px-6 py-4 transition hover:bg-gray-50"
              >
                <span className="text-gray-800">계정 정보 수정</span>

              </Link>
            </li>

            <li>
              <Link
                href="/settings/notifications"
                className="flex items-center justify-between px-6 py-4 transition hover:bg-gray-50"
              >
                <span className="text-gray-800">알림 설정</span>

              </Link>
            </li>

            <li>
              <Link
                href="/mypage/friends"
                className="flex items-center justify-between px-6 py-4 transition hover:bg-gray-50"
              >
                <span className="text-gray-800">친구 관리</span>
              </Link>
            </li>
          </ul>
        </section>
      </div>
    </main>
  );
}
