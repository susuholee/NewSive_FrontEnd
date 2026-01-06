'use client';

import Link from 'next/link';
import { useState } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { useAuthStore } from '../store/authStore';
import { useAuthGuard } from '@/shared/hooks/useAuthGuard';
import LoginRequiredModal from '@/shared/components/LoginRequiredModal';
import { logout as logoutApi } from '../api/auth.api';
import { ConfirmModal } from './ConfirmModal';

export default function Header() {
  const router = useRouter();
  const { user, logout: clearUser } = useAuthStore();
  const { isAuthenticated } = useAuthGuard();
  const pathname = usePathname();

  const [showLoginModal, setShowLoginModal] = useState(false);
  const [showLogoutModal, setShowLogoutModal] = useState(false);

  const handleProtectedClick = (path: string) => {
    if (!isAuthenticated) {
      setShowLoginModal(true);
      return;
    }
    router.push(path);
  };

  const handleLogout = async () => {
    try {
      await logoutApi();
    } catch (e) {
      console.log(e);
    } finally {
      clearUser();
      setShowLogoutModal(false);
      router.replace('/login');
    }
  };

  const NAV_ITEMS = [
  { label: '뉴스', path: '/news', protected: false },
  { label: '알림', path: '/notifications', protected: true },
  { label: '채팅', path: '/chat', protected: true },
  { label: '마이페이지', path: '/mypage', protected: true },
];


const isActive = (path: string) => {
  return pathname === path || pathname.startsWith(path + '/');
};

  return (
    <>
      <header className="sticky top-0 z-50 bg-surface/90 backdrop-blur">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3">
          <Link
            href="/"
            className="flex items-center gap-2 text-lg font-bold text-primary"
          >
            <span className="relative flex h-2 w-2">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-primary opacity-75" />
              <span className="relative inline-flex h-2 w-2 rounded-full bg-primary" />
            </span>
            NewSive
          </Link>

      <nav className="flex items-center gap-1 rounded-full bg-surface-muted p-1 text-sm">
  {NAV_ITEMS.map((item) => {
    const active = isActive(item.path);

    const handleClick = () => {
      if (item.protected) {
        handleProtectedClick(item.path);
      } else {
        router.push(item.path);
      }
    };

    return (
      <button
        key={item.path}
        onClick={handleClick}
        className={[
          'rounded-full px-4 py-1.5 transition',
          active
            ? 'bg-primary-soft text-primary font-medium'
            : 'text-text-secondary hover:bg-primary-soft/40 hover:text-primary',
        ].join(' ')}
      >
        {item.label}
      </button>
    );
  })}
</nav>


          <div className="flex items-center gap-2 text-sm">
            {user ? (
              <div className="flex items-center gap-2 rounded-full bg-surface-muted px-2 py-1">
                <div className="flex h-7 w-7 items-center justify-center rounded-full bg-primary text-xs font-bold text-white">
                  {user.nickname?.[0]}
                </div>
                <span className="text-text-primary">
                  {user.nickname}
                </span>
                <button
                  onClick={() => setShowLogoutModal(true)}
                  className="ml-1 rounded-full px-2 py-1 text-xs text-text-secondary hover:bg-surface"
                >
                  로그아웃
                </button>
              </div>
            ) : (
              <>
                <Link
                  href="/login"
                  className="text-text-secondary hover:text-primary"
                >
                  로그인
                </Link>
                <Link
                  href="/signup"
                  className="rounded-full bg-primary px-4 py-1.5 text-white hover:bg-primary-hover"
                >
                  회원가입
                </Link>
              </>
            )}
          </div>
        </div>
      </header>


      {showLoginModal && (
        <LoginRequiredModal onClose={() => setShowLoginModal(false)} />
      )}

      {showLogoutModal && (
        <ConfirmModal
          title="로그아웃"
          description="정말 로그아웃 하시겠어요?"
          confirmText="로그아웃"
          cancelText="취소"
          onConfirm={handleLogout}
          onCancel={() => setShowLogoutModal(false)}
        />
      )}
    </>
  );
}
