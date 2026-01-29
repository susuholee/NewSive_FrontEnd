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
    <main className="flex items-center justify-center bg-background px-4 translate-y-15">
      <div className="w-full max-w-sm rounded-2xl bg-surface p-6 shadow-sm">

        {/* 헤더 최소화 */}
        <div className="mb-4">
          <h1 className="text-xl font-semibold">회원가입</h1>
        </div>

        <SignupForm onSuccess={handleSignupSuccess} />

        <p className="mt-5 text-center text-sm text-text-secondary">
          이미 계정이 있으신가요?{' '}
          <Link
            href="/login"
            className="font-medium text-text-primary hover:underline"
          >
            로그인
          </Link>
        </p>
      </div>
    </main>
  );
}
