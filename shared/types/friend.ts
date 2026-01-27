export type Friend = {
  id: number;    
  friendId: number;   
  username: string;
  nickname: string;
  profileImgUrl?: string;  
};


export type FriendApiResponse = {
  id: number;
  friendUserId: number;
  createdAt: string;
  friend: {
    id: number;
    username: string;
    nickname: string;
    profileImgUrl?: string;  
  };
};