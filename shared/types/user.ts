export type User = {
  id: number;
  username: string;
  nickname: string;
  profileImgUrl: string | null;
  birthday: string | null;
  gender?: "male" | "female" | "other"
};


export type UpdateProfileImageResponse  = {
  message: string;
  profileImgUrl: string;
}