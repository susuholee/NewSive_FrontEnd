import { create } from 'zustand';
import type { User } from '@/shared/types/user';

type AuthState = {
  user: User | null;
  login: (user: User) => void;
  updateUser: (partial: Partial<User>) => void;
  logout: () => void;
};

export const useAuthStore = create<AuthState>((set) => ({
  user: null,

  login: (user) =>
    set({
      user,
    }),

  updateUser: (partial) =>
    set((state) => ({
      user: state.user ? { ...state.user, ...partial } : state.user,
    })),

  logout: () =>
    set({
      user: null,
    }),
}));
