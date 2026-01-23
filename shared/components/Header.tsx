'use client';

import Link from 'next/link';
import Image from 'next/image';
import { useEffect, useRef, useState } from 'react';
import { useRouter, usePathname } from 'next/navigation';

import { useAuthStore } from '../store/authStore';
import { useUIStore } from '../store/uiStore';
import { useAuthGuard } from '@/shared/hooks/useAuthGuard';

import LoginRequiredModal from '@/shared/components/LoginRequiredModal';
import { logout as logoutApi } from '../api/auth.api';
import { ConfirmModal } from './ConfirmModal';

import { getNotifications, getUnreadCount, readNotification } from '@/shared/api/notifications.api';

import type { Notification } from '../types/notification';
import { notificationUIMap } from '@/shared/constants/notificationUI';
import { formatRelativeTime } from '../utils/time';

export default function Header() {
  const router = useRouter();
  const pathname = usePathname();

  const { user, logout: clearUser } = useAuthStore();
  const { isAuthenticated } = useAuthGuard();


  const rawOpenFriendsSidebar = useUIStore((s) => s.openFriendsSidebar);


  const [showLoginModal, setShowLoginModal] = useState(false);
  const openFriendsSidebarWithAuth = (tab: 'friends' | 'received' | 'sent') => {
    if (!isAuthenticated) {
      setShowLoginModal(true);
      return;
    }
    rawOpenFriendsSidebar(tab);
  };

  const [showLogoutModal, setShowLogoutModal] = useState(false);

  const [unreadCount, setUnreadCount] = useState(0);
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [showDropdown, setShowDropdown] = useState(false);

  const dropdownRef = useRef<HTMLDivElement>(null);

  const NAV_ITEMS = [
    { label: '뉴스', path: '/news', protected: false },
    { label: '내 정보', path: '/mypage', protected: true },
  ];

  const isActive = (path: string) => pathname === path || pathname.startsWith(path + '/');

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
    } finally {
      clearUser();
      setShowLogoutModal(false);
      router.replace('/login');
    }
  };

  useEffect(() => {
    if (!isAuthenticated) return;

    const fetchUnread = async () => {
      const res = await getUnreadCount();
      setUnreadCount(res.unreadCount);
    };

    fetchUnread();
    const interval = setInterval(fetchUnread, 15000);
    return () => clearInterval(interval);
  }, [isAuthenticated]);

  useEffect(() => {
    if (!showDropdown || !isAuthenticated || !user) return;
    getNotifications().then(setNotifications);
  }, [showDropdown, isAuthenticated, user]);

  useEffect(() => {
    if (!showDropdown) return;

    const handleClickOutside = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setShowDropdown(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [showDropdown]);

  return (
    <>
      <header className="sticky top-0 z-50 bg-surface/90 backdrop-blur">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3">
          <Link href="/" className="flex items-center gap-2 text-lg font-bold text-primary">
            <span className="relative flex h-2 w-2">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-primary opacity-75" />
              <span className="relative inline-flex h-2 w-2 rounded-full bg-primary" />
            </span>
            NewSive
          </Link>

   
          <nav className="flex items-center gap-1 rounded-full bg-surface-muted p-1 text-sm">
            {NAV_ITEMS.map((item) => (
              <button
                key={item.path}
                onClick={() => (item.protected ? handleProtectedClick(item.path) : router.push(item.path))}
                className={[
                  'rounded-full px-4 py-1.5 transition',
                  isActive(item.path)
                    ? 'bg-primary-soft text-primary font-medium'
                    : 'text-text-secondary hover:bg-primary-soft/40 hover:text-primary',
                ].join(' ')}
              >
                {item.label}
              </button>
            ))}
          </nav>


          <div className="relative flex items-center gap-3">
            {user ? (
              <>
                <div ref={dropdownRef} className="relative">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      setShowDropdown((prev) => !prev);
                    }}
                    className="relative rounded-full p-2 transition hover:opacity-80"
                    aria-label="알림"
                  >
                    <Image src="/icon/bell.jpg" alt="알림" width={20} height={20} />
                    {unreadCount > 0 && (
                      <span className="absolute -right-0.5 -top-0.5 flex h-4 min-w-4 items-center justify-center rounded-full bg-red-500 px-1 text-[10px] font-bold text-white">
                        {unreadCount}
                      </span>
                    )}
                  </button>

                  {showDropdown && (
                    <div className="absolute right-0 top-10 z-50 w-80 rounded-2xl border bg-white shadow-xl">
                      <div className="border-b px-4 py-3 text-sm font-semibold">알림</div>

                      <ul className="max-h-80 overflow-y-auto">
                        {notifications.length === 0 && (
                          <li className="px-4 py-8 text-center text-sm text-gray-500">새 알림이 없습니다</li>
                        )}

                        {notifications.slice(0, 5).map((n) => {
                          const ui = notificationUIMap[n.type];

                          return (
                            <li
                              key={n.id}
                              onClick={async () => {
                                if (!n.isRead) {
                                  await readNotification(n.id);
                                  setUnreadCount((c) => Math.max(c - 1, 0));
                                  setNotifications((prev) =>
                                    prev.map((item) => (item.id === n.id ? { ...item, isRead: true } : item)),
                                  );
                                }

                                setShowDropdown(false);

                          
                                if (n.type === 'FRIEND_REQUEST') {
                                  openFriendsSidebarWithAuth('received');
                                  return;
                                }

                                if (n.type === 'FRIEND_ACCEPTED') {
                                  openFriendsSidebarWithAuth('friends');
                                  return;
                                }

                                if (n.link) {
                                  router.push(n.link);
                                }
                              }}
                              className="cursor-pointer px-4 py-3 transition hover:bg-gray-50"
                            >
                              <div className="flex gap-3">
                                {!n.isRead && <span className={`mt-2 h-2 w-2 rounded-full ${ui.dotColor}`} />}
                                <div>
                                  <span className={`text-xs font-medium ${ui.color}`}>{ui.label}</span>
                                  <p className="text-sm">{n.message}</p>
                                  <p className="mt-1 text-xs text-gray-400">{formatRelativeTime(n.createdAt)}</p>
                                </div>
                              </div>
                            </li>
                          );
                        })}
                      </ul>

                      <div className="border-t px-4 py-3">
                        <button
                          onClick={() => {
                            setShowDropdown(false);
                            router.push('/notifications');
                          }}
                          className="w-full rounded-lg bg-primary-soft py-2 text-sm font-medium text-primary hover:bg-primary-soft/70"
                        >
                          모든 알림 보기
                        </button>
                      </div>
                    </div>
                  )}
                </div>

   
                <div className="flex items-center gap-2 rounded-full bg-surface-muted px-2 py-1">
                  <div className="flex h-7 w-7 items-center justify-center rounded-full bg-primary text-xs font-bold text-white">
                    {user.nickname?.[0]}
                  </div>
                  <span>{user.nickname}</span>
                  <button
                    onClick={() => setShowLogoutModal(true)}
                    className="ml-1 rounded-full px-2 py-1 text-xs text-text-secondary hover:bg-surface"
                  >
                    로그아웃
                  </button>
                </div>
              </>
            ) : (
              <>
                <Link href="/login" className="text-sm text-text-secondary hover:text-primary">
                  로그인
                </Link>
                <Link
                  href="/signup"
                  className="rounded-full bg-primary px-4 py-1.5 text-sm text-white hover:bg-primary-hover"
                >
                  회원가입
                </Link>
              </>
            )}
          </div>
        </div>
      </header>

      {showLoginModal && <LoginRequiredModal onClose={() => setShowLoginModal(false)} />}

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
