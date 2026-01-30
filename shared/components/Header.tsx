'use client';

import Link from 'next/link';
import Image from 'next/image';
import { useEffect, useRef, useState } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { useQueryClient } from '@tanstack/react-query';

import { useAuthStore } from '../store/authStore';
import { useAuthGuard } from '@/shared/hooks/useAuthGuard';

import LoginRequiredModal from '@/shared/components/LoginRequiredModal';
import { logout as logoutApi } from '../api/auth.api';
import { ConfirmModal } from './ConfirmModal';

import { getNotifications, getUnreadCount, readNotification, deleteReadNotifications} from '@/shared/api/notifications.api';

import type { Notification } from '../types/notification';
import { notificationUIMap } from '@/shared/constants/notificationUI';
import { formatRelativeTime } from '../utils/time';

export default function Header() {
  const router = useRouter();
  const pathname = usePathname();
  const queryClient = useQueryClient();

  const { user, logout: clearUser } = useAuthStore();
  const { isAuthenticated } = useAuthGuard();

  const [showLoginModal, setShowLoginModal] = useState(false);
  const [showLogoutModal, setShowLogoutModal] = useState(false);

  const [unreadCount, setUnreadCount] = useState(0);
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [showDropdown, setShowDropdown] = useState(false);

  const dropdownRef = useRef<HTMLDivElement>(null);

  const NAV_ITEMS = [
    { label: '뉴스', path: '/news', protected: false },
    { label: '내 정보', path: '/mypage', protected: true },
  ];

  const isActive = (path: string) =>
    pathname === path || pathname.startsWith(path + '/');

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
      queryClient.clear();
      setShowLogoutModal(false);
      router.replace('/login');
    }
  };


  const fetchUnread = async () => {
    const res = await getUnreadCount();
    setUnreadCount(res.unreadCount);
  };

  useEffect(() => {
    if (!isAuthenticated) return;

    fetchUnread();
    const interval = setInterval(fetchUnread, 15000);
    return () => clearInterval(interval);
  }, [isAuthenticated]);

 
  const fetchNotifications = async () => {
    const data = await getNotifications();
    setNotifications(data);
  };

  useEffect(() => {
    if (!showDropdown || !isAuthenticated || !user) return;
    fetchNotifications();
  }, [showDropdown, isAuthenticated, user]);


  useEffect(() => {
    if (!showDropdown) return;

    const handleClickOutside = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setShowDropdown(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () =>
      document.removeEventListener('mousedown', handleClickOutside);
  }, [showDropdown]);

  const hasReadNotifications = notifications.some((n) => n.isRead);

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

          {/* 네비 */}
          <nav className="flex items-center gap-1 rounded-full bg-surface-muted p-1 text-sm">
            {NAV_ITEMS.map((item) => (
              <button
                key={item.path}
                onClick={() =>
                  item.protected
                    ? handleProtectedClick(item.path)
                    : router.push(item.path)
                }
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
                    className="relative rounded-full p-2 transition hover:bg-gray-100"
                  >
                    <Image src="/icon/bell.jpg" alt="알림" width={20} height={20} />
                    {unreadCount > 0 && (
                      <span className="absolute -right-0.5 -top-0.5 flex h-4 min-w-4 items-center justify-center rounded-full bg-red-500 px-1 text-[10px] font-bold text-white">
                        {unreadCount}
                      </span>
                    )}
                  </button>

                  {showDropdown && (
                    <div className="absolute right-0 top-10 z-50 w-80 overflow-hidden rounded-2xl border bg-white shadow-xl">
                      <div className="flex items-center justify-between border-b px-4 py-3">
                        <div className="flex flex-col">
                          <span className="text-sm font-semibold">알림</span>
                          {unreadCount > 0 && (
                            <span className="text-xs text-gray-400">
                              안 읽은 알림 {unreadCount}개
                            </span>
                          )}
                        </div>

                        {hasReadNotifications && (
                          <button
                            onClick={async (e) => {
                              e.stopPropagation();

                              await deleteReadNotifications();

                              await fetchNotifications();
                              await fetchUnread();

                              queryClient.invalidateQueries({
                                queryKey: ['notifications'],
                              });
                              queryClient.invalidateQueries({
                                queryKey: ['unreadCount'],
                              });
                            }}
                            className="text-xs text-gray-400 hover:text-gray-600 transition"
                          >
                            읽은 알림 정리
                          </button>
                        )}
                      </div>

                      {/* 목록 */}
                      <ul className="max-h-80 overflow-y-auto">
                        {notifications.length === 0 && (
                          <li className="px-4 py-10 text-center text-sm text-gray-400">
                            새 알림이 없습니다
                          </li>
                        )}

                        {notifications.slice(0, 5).map((n) => {
                          const ui = notificationUIMap[n.type];

                          return (
                            <li
                              key={n.id}
                              onClick={async () => {
                                if (!n.isRead) {
                                  await readNotification(n.id);

                                  await fetchNotifications();
                                  await fetchUnread();

                                  queryClient.invalidateQueries({
                                    queryKey: ['notifications'],
                                  });
                                  queryClient.invalidateQueries({
                                    queryKey: ['unreadCount'],
                                  });
                                }
                                setShowDropdown(false);
                                
                                router.push('/notifications');
                              }}
                              className={[
                                'cursor-pointer px-4 py-3 transition',
                                n.isRead
                                  ? 'bg-white hover:bg-gray-50'
                                  : 'bg-primary-soft/30 hover:bg-primary-soft/50',
                              ].join(' ')}
                            >
                              <div className="flex gap-3">
                                {!n.isRead && (
                                  <span
                                    className={`mt-2 h-2 w-2 rounded-full ${ui.dotColor}`}
                                  />
                                )}
                                <div>
                                  <span
                                    className={`text-xs font-medium ${ui.color}`}
                                  >
                                    {ui.label}
                                  </span>
                                  <p className="text-sm">{n.message}</p>
                                  <p className="mt-1 text-xs text-gray-400">
                                    {formatRelativeTime(n.createdAt)}
                                  </p>
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
                          className="w-full rounded-xl bg-primary py-2.5 text-sm font-semibold text-white hover:bg-primary-hover transition"
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
                <Link
                  href="/login"
                  className="text-sm text-text-secondary hover:text-primary"
                >
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
