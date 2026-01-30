'use client';

import { useEffect } from 'react';
import { getMe } from '@/shared/api/users.api';
import { useAuthStore } from '@/shared/store/authStore';

export default function AuthInitializer({children}: {children: React.ReactNode;}) {
  const { setUser, logout } = useAuthStore();
  useEffect(() => {
    const initAuth = async () => {
      try {
        const user = await getMe();
        setUser(user);
      } catch {
        logout();
      }
    };

    initAuth();
  }, []);

  return <>{children}</>;
}
