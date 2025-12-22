import { LoginResult } from "../types/login";

export async function login(
  username: string,
  password: string
): Promise<LoginResult> {
    await new Promise((resolve) => setTimeout(resolve, 600));


  if (username !== 'suho123' || password !== '1234') {
    throw new Error('아이디 또는 비밀번호가 올바르지 않습니다.');
  }

  return {
    user: {
      id: 1,
      username: 'suho123',
      nickname: '수호',
    },
  };
}