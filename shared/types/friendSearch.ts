export type FriendRelation = 'FRIEND' | 'SENT' | 'RECEIVED' | 'NONE';

export interface FriendSearchResult {
  id: number;
  nickname: string;
  username: string;
  profileImgUrl: string | null;
  relation: FriendRelation;
}
