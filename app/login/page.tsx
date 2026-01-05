'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { login } from '@/shared/api/auth.api';
import { useAuthStore } from '@/shared/store/authStore';
import Link from 'next/link';

export default function LoginPage() {
  const router = useRouter();

  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  const {login : SetLogin} = useAuthStore()

  const handleLogin = async () => {
  setLoading(true);
  setErrorMsg('');
  try {
    const data =  await login(username, password);
    SetLogin(data.user);
    router.push('/news');
  } catch (err) {
    setErrorMsg(
      typeof err === 'string'
        ? err
        : '로그인에 실패했습니다.'
    );
  } finally {
    setLoading(false);
  }
};


return (
    <main className="flex min-h-screen items-center justify-center">
      <div className="w-full max-w-sm space-y-6">
        <h1 className="text-2xl font-bold text-center">로그인</h1>

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

          <button
            type="button"
            onClick={handleLogin}
            disabled={loading}
            className="w-full rounded bg-fuchsia-300 py-2 text-black disabled:opacity-50"
          >
            {loading ? '로그인 중...' : '로그인'}
          </button>

          {errorMsg && (
            <p className="text-center text-sm text-red-500">
              {errorMsg}
            </p>
          )}
        </form>

        <p className="text-center text-sm">
          아직 회원이 아니신가요?{' '}
          <Link href="/signup" className="text-black underline">
            회원가입
          </Link>
        </p>
      </div>
    </main>
  );
}
