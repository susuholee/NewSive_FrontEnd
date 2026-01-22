export type User = {
  id: number;
  username: string;
  nickname: string;
  profileImgUrl: string | null;
  birthday?: string;
  gender?: "male" | "female" | "other"
};


export type UpdateProfileImageResponse  = {
  message: string;
  profileImgUrl: string;
}