export type FriendRequest = {
  id: number;
  createdAt: string;


  user?: {
    id: number;
    username: string;
    nickname: string;
    profileImgUrl?: string;
  };

  friendUser?: {
    id: number;
    username: string;
    nickname: string;
    profileImgUrl?: string;
  };
};
