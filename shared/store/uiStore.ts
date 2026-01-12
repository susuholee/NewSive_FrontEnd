import { create } from 'zustand';

export type FriendsTab = 'friends' | 'received' | 'sent';

type UIState = {
  isFriendsSidebarOpen: boolean;
  friendsTab: FriendsTab;

  openFriendsSidebar: (tab?: FriendsTab) => void;
  closeFriendsSidebar: () => void;
};

export const useUIStore = create<UIState>((set) => ({
  isFriendsSidebarOpen: false,
  friendsTab: 'friends',

  openFriendsSidebar: (tab = 'friends') =>
    set({
      isFriendsSidebarOpen: true,
      friendsTab: tab,
    }),

  closeFriendsSidebar: () =>
    set({
      isFriendsSidebarOpen: false,
    }),
}));
