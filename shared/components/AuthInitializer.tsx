'use client';

import { useEffect } from 'react';
import { getMe } from '@/shared/api/auth.api';
import { useAuthStore } from '@/shared/store/authStore';

export default function AuthInitializer({children}: {children: React.ReactNode;}) {
  const { login, logout } = useAuthStore();
  useEffect(() => {
    const initAuth = async () => {
      try {
        const user = await getMe();
        login(user);
      } catch {
        logout();
      }
    };

    initAuth();
  }, []);

  return <>{children}</>;
}
