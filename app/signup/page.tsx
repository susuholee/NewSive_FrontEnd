'use client';

import { useRouter } from 'next/navigation';
import SignupForm from './signupForm';
import Link from 'next/link';

export default function SignupPage() {
  const router = useRouter();

  const handleSignupSuccess = () => {
    router.push('/login');
  };

  return (
    <main className="flex min-h-screen items-center justify-center bg-background text-text-primary">
      <div className="w-full max-w-sm rounded-2xl bg-surface p-7 shadow-sm">
        {/* 헤더 */}
        <div className="mb-6">
          <h1 className="text-xl font-semibold tracking-tight">
            회원가입
          </h1>
          <p className="mt-1 text-sm text-text-secondary">
            간단한 정보 입력으로 계정을 만들어보세요
          </p>
        </div>

        <SignupForm onSuccess={handleSignupSuccess} />

        <p className="mt-6 text-sm text-text-secondary">
          이미 계정이 있으신가요?{' '}
          <Link
            href="/login"
            className="underline hover:text-text-primary"
          >
            로그인
          </Link>
        </p>
      </div>
    </main>
  );
}
