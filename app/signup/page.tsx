'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { signup } from '@/shared/service/singup.service';

export default function SignupPage() {
  const router = useRouter();

  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [passwordConfirm, setPasswordConfirm] = useState('');
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  const handleSignup = async () => {
    setErrorMsg('');

    if (password !== passwordConfirm) {
      setErrorMsg('비밀번호가 일치하지 않습니다.');
      return;
    }

    setLoading(true);

    try {
      await signup(username, password);
      router.push('/login');
    } catch (err) {
      setErrorMsg(
        typeof err === 'string'
          ? err
          : '회원가입에 실패했습니다.'
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="flex min-h-screen items-center justify-center">
      <div className="w-full max-w-sm space-y-6">
        <h1 className="text-2xl font-bold text-center">회원가입</h1>

        <form className="space-y-4">
          <div>
            <label className="block text-sm font-medium">아이디</label>
            <input
              type="text"
              className="mt-1 w-full rounded border px-3 py-2"
              placeholder="아이디를 입력하세요"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
            />
          </div>

          <div>
            <label className="block text-sm font-medium">비밀번호</label>
            <input
              type="password"
              className="mt-1 w-full rounded border px-3 py-2"
              placeholder="비밀번호를 입력하세요"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>

          <div>
            <label className="block text-sm font-medium">비밀번호 확인</label>
            <input
              type="password"
              className="mt-1 w-full rounded border px-3 py-2"
              placeholder="비밀번호를 다시 입력하세요"
              value={passwordConfirm}
              onChange={(e) => setPasswordConfirm(e.target.value)}
            />
          </div>

          {errorMsg && (
            <p className="text-sm text-red-500">
              {errorMsg}
            </p>
          )}

          <button
            type="button"
            onClick={handleSignup}
            disabled={loading}
            className="w-full rounded bg-fuchsia-300 py-2 text-black disabled:opacity-50"
          >
            {loading ? '가입 중...' : '회원가입'}
          </button>
        </form>

        <p className="text-center text-sm">
          이미 계정이 있으신가요?{' '}
          <a href="/login" className="text-black underline">
            로그인
          </a>
        </p>
      </div>
    </main>
  );
}
