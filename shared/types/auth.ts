export type SignupFormData = {
    username: string;
    password: string;
    passwordConfirm: string;
    nickname?: string;
    birthday?: string;
    gender?: 'male' | 'female' | 'other';
}

export type SignupRequest = {
  username: string;
  password: string;
  passwordConfirm: string; 
  nickname?: string;
  birthday: string;
  gender: 'male' | 'female' | 'other';
};