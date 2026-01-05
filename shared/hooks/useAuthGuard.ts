import { useAuthStore } from '@/shared/store/authStore';

export function useAuthGuard() {
  const user = useAuthStore((state) => state.user);
  return {
    isAuthenticated: !!user,
  };
}
