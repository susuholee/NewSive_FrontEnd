import { create } from 'zustand';
import type { User } from '@/shared/types/user';
import { useFriendStore } from './useFriendStore';

type AuthState = {
  user: User | null;

  setUser: (user: User) => void;

  patchUser: (partial: Partial<User>) => void;

  logout: () => void;
};

export const useAuthStore = create<AuthState>((set) => ({
  user: null,

  setUser: (user) =>
    set({
      user,
    }),

  patchUser: (partial) =>
    set((state) => ({
      user: state.user ? { ...state.user, ...partial } : state.user,
    })),

  logout: () => {
    useFriendStore.getState().reset();
    set({ user: null });
  },
}));
