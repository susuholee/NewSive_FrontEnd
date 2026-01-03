'use client';

import { useRouter } from 'next/navigation';
import  SignupForm from './signupForm';

export default function SignupPage() {
  const router = useRouter();

  const handleSignupSuccess = () => {
    router.push('/login');
  };

  return (
    <main className="flex min-h-screen items-center justify-center">
      <div className="w-full max-w-sm space-y-6">
        <h1 className="text-2xl font-bold text-center">회원가입</h1>

        <SignupForm onSuccess={handleSignupSuccess} />

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
