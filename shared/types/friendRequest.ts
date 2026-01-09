export type FriendRequest = {
  id: number;
  user: {
    id: number;
    username: string;
    nickname: string;
  };
  createdAt: string;
};
