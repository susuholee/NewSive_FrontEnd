'use client';

import Link from 'next/link';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '../store/authStore';
import { useAuthGuard } from '@/shared/hooks/useAuthGuard';
import LoginRequiredModal from '@/shared/components/LoginRequiredModal';
import { logout as logoutApi } from '../api/auth.api';

export default function Header() {
  const router = useRouter();
  const { user, logout: clearUser } = useAuthStore();
  const { isAuthenticated } = useAuthGuard();
  const [showModal, setShowModal] = useState(false);

  const handleLogout = async () => {
    try {
      await logoutApi();
    } catch (error) {
      console.log('로그아웃 실패', error);
    } finally {
      clearUser();
      router.replace('/login');
    }
  };

  const handleProtectedClick = (path: string) => {
    if (!isAuthenticated) {
      setShowModal(true);
      return;
    }
    router.push(path);
  };

  return (
    <>
      <header className="border-b bg-white">
        <div className="mx-auto flex max-w-5xl items-center justify-between px-4 py-3">
          <Link href="/" className="text-lg font-bold">
            NewSive
          </Link>

          <nav className="flex items-center gap-4 text-sm">
            <Link href="/news" className="hover:underline">
              뉴스
            </Link>

         
            <button
              onClick={() => handleProtectedClick('/notifications')}
              className="hover:underline"
            >
              알림
            </button>
            <button
              onClick={() => handleProtectedClick('/chat')}
              className="hover:underline"
            >
              채팅
            </button>
            <button
              onClick={() => handleProtectedClick('/mypage')}
              className="hover:underline"
            >
              마이페이지
            </button>
          </nav>

          <div className="flex items-center gap-3 text-sm">
            {user ? (
              <>
                <span className="text-gray-700">
                  {user.nickname}님
                </span>
                <button
                  onClick={handleLogout}
                  className="rounded border px-3 py-1 hover:bg-gray-100"
                >
                  로그아웃
                </button>
              </>
            ) : (
              <>
                <Link href="/login" className="hover:underline">
                  로그인
                </Link>
                <Link
                  href="/signup"
                  className="rounded border px-3 py-1"
                >
                  회원가입
                </Link>
              </>
            )}
          </div>
        </div>
      </header>

      {showModal && (
        <LoginRequiredModal onClose={() => setShowModal(false)} />
      )}
    </>
  );
}
