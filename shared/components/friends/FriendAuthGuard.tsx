'use client';

import { ReactNode, useState } from 'react';
import { useAuthGuard } from '@/shared/hooks/useAuthGuard';
import LoginRequiredModal from '@/shared/components/LoginRequiredModal';

interface Props {
  children: ReactNode;
  lockedMessage?: string;
}

export default function FriendAuthGuard({ children, lockedMessage }: Props) {
  const { isAuthenticated } = useAuthGuard();
  const [showLoginModal, setShowLoginModal] = useState(false);

  if (!isAuthenticated) {
    return (
      <>
        <div className="rounded-2xl bg-white p-5 shadow-md text-center text-sm text-gray-400">
          <p className="mb-3">
            {lockedMessage || '친구 기능은 로그인 후 사용할 수 있습니다'}
          </p>

          <button
            onClick={() => setShowLoginModal(true)}
            className="rounded-lg bg-primary px-4 py-2 text-white hover:bg-primary/90"
          >
            로그인하기
          </button>
        </div>

        {showLoginModal && (
          <LoginRequiredModal onClose={() => setShowLoginModal(false)} />
        )}
      </>
    );
  }

  return <>{children}</>;
}
