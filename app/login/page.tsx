'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useMutation } from '@tanstack/react-query';
import { login } from '@/shared/api/login.api';
import { useAuthStore } from '@/shared/store/authStore';
import Link from 'next/link';

export default function LoginPage() {
  const router = useRouter();
  const {user, login: setLogin } = useAuthStore();

  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [errorMsg, setErrorMsg] = useState('');

    useEffect(() => {
    if (user) {
      router.replace('/news');
    }
  }, [user, router]);


  const loginMutation = useMutation({
    mutationFn: login,
    onSuccess: (data) => {
      setLogin(data.user);
    },
    onError: (error) => {
      if (error instanceof Error) {
        setErrorMsg(error.message);
      } else {
        setErrorMsg('로그인에 실패했습니다.');
      }
    },
  });

  const handleLogin = () => {
    if (!username || !password) {
      setErrorMsg('아이디와 비밀번호를 입력해주세요.');
      return;
    }

    setErrorMsg('');
    loginMutation.mutate({ username, password });
  };

  return (
    <main className="flex min-h-screen items-center justify-center">
      <div className="w-full max-w-sm space-y-6">
        <h1 className="text-2xl font-bold text-center">로그인</h1>

        <form
          className="space-y-4"
          onSubmit={(e) => {
            e.preventDefault();
            handleLogin();
          }}
        >
          <div>
            <label className="block text-sm font-medium">아이디</label>
            <input
              type="text"
              className="mt-1 w-full rounded border px-3 py-2"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
            />
          </div>

          <div>
            <label className="block text-sm font-medium">비밀번호</label>
            <input
              type="password"
              className="mt-1 w-full rounded border px-3 py-2"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>

          <button
            type="submit"
            disabled={loginMutation.isPending}
            className="w-full rounded bg-fuchsia-300 py-2 disabled:opacity-50"
          >
            {loginMutation.isPending ? '로그인 중...' : '로그인'}
          </button>

          {errorMsg && (
            <p className="text-center text-sm text-red-500">
              {errorMsg}
            </p>
          )}
        </form>

        <p className="text-center text-sm">
          아직 회원이 아니신가요?{' '}
          <Link href="/signup" className="underline">
            회원가입
          </Link>
        </p>
      </div>
    </main>
  );
}
