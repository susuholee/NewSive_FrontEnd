export type SignupRequest = {
    username: string;
    password: string;
    passwordConfirm: string;
    nickname: string;
    birthday?: string;
    gender?: 'male' | 'female' | 'other';
}

export type SignupResponse = {
  id: number;
  username: string;
  nickname: string;
  birthday?: string;
  gender?: 'male' | 'female' | 'other';
  profileImageUrl: string;
  createdAt: string;
};
