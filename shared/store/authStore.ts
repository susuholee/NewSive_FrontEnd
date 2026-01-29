import { create } from 'zustand';
import type { LoginResponse } from '@/shared/types/login';
import { useFriendStore } from './useFriendStore';

type LoginUser = LoginResponse["user"];

type AuthState = {
  user: LoginUser | null;

  setUser: (user: LoginUser) => void;

  patchUser: (partial: Partial<LoginUser>) => void;

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
