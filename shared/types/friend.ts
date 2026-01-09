export type Friend = {
  id: number;    
  userId: number;   
  username: string;
  nickname: string;
};


export type FriendApiResponse = {
  id: number;
  friendUserId: number;
  createdAt: string;
  friend: {
    id: number;
    username: string;
    nickname: string;
  };
};