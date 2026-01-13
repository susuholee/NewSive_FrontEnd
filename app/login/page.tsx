'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useMutation } from '@tanstack/react-query';
import { login } from '@/shared/api/auth.api';
import { useAuthStore } from '@/shared/store/authStore';
import Link from 'next/link';
import axios from 'axios';

export default function LoginPage() {
  const router = useRouter();
  const { user, login: setLogin } = useAuthStore();

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
      if (axios.isAxiosError(error)) {
        setErrorMsg(
          error.response?.data?.message ??
            '아이디 또는 비밀번호가 올바르지 않습니다.'
        );
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
    <main className="flex min-h-screen items-center justify-center bg-background text-text-primary">
      <div className="w-full max-w-sm rounded-2xl bg-surface p-7 shadow-sm">
        {/* 헤더 */}
        <div className="mb-6">
          <h1 className="text-xl font-semibold tracking-tight">
            로그인
          </h1>
          <p className="mt-1 text-sm text-text-secondary">
            계속하려면 계정에 로그인하세요
          </p>
        </div>

        <form
          className="space-y-5"
          onSubmit={(e) => {
            e.preventDefault();
            handleLogin();
          }}
        >
          <div>
            <label className="mb-1 block text-sm text-text-secondary">
              아이디
            </label>
            <input
              type="text"
              className="
                w-full rounded-lg
                border border-text-secondary/25
                bg-surface
                px-3 py-2.5
                text-text-primary
                transition
                focus:outline-none
                focus:ring-1 focus:ring-primary/60
              "
              value={username}
              onChange={(e) => setUsername(e.target.value)}
            />
          </div>

          <div>
            <label className="mb-1 block text-sm text-text-secondary">
              비밀번호
            </label>
            <input
              type="password"
              className="
                w-full rounded-lg
                border border-text-secondary/25
                bg-surface
                px-3 py-2.5
                text-text-primary
                transition
                focus:outline-none
                focus:ring-1 focus:ring-primary/60
              "
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>

          <button
            type="submit"
            disabled={loginMutation.isPending}
            className="
              w-full rounded-lg
              bg-primary py-2.5
              font-medium text-white
              transition
              hover:bg-primary-hover/90
              disabled:opacity-50
            "
          >
            {loginMutation.isPending ? '로그인 중...' : '로그인'}
          </button>

          {errorMsg && (
            <p className="text-sm text-danger">
              {errorMsg}
            </p>
          )}
        </form>

        <p className="mt-6 text-sm text-text-secondary">
          아직 회원이 아니신가요?{' '}
          <Link href="/signup" className="underline hover:text-text-primary">
            회원가입
          </Link>
        </p>
      </div>
    </main>
  );
}
