import { create } from 'zustand';
import type { User } from '@/shared/types/user';
import type { FriendRequest } from '@/shared/types/friendRequest';

type FriendState = {
  friends: User[];
  sent: FriendRequest[];
  received: FriendRequest[];

  setFriends: (friends: User[]) => void;
  setSent: (sent: FriendRequest[]) => void;
  setReceived: (received: FriendRequest[]) => void;

  reset: () => void;
};

export const useFriendStore = create<FriendState>((set) => ({
  friends: [],
  sent: [],
  received: [],

  setFriends: (friends) => set({ friends }),
  setSent: (sent) => set({ sent }),
  setReceived: (received) => set({ received }),

  reset: () =>
    set({
      friends: [],
      sent: [],
      received: [],
    }),
}));
