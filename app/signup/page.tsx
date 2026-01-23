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
    <main className="flex min-h-screen items-center justify-center bg-background text-text-primary px-4">
      <div className="w-full max-w-sm rounded-2xl bg-surface p-7 shadow-sm">

    
        <div className="mb-6 space-y-1">
          <h1 className="text-xl font-semibold tracking-tight">
            회원가입
          </h1>
          <p className="text-sm text-text-secondary leading-relaxed">
            가입하고 <span className="text-text-primary font-medium">채팅</span>과{' '}
            <span className="text-text-primary font-medium">친구</span> 기능으로<br />
            사람들과 소통해보세요
          </p>
        </div>

        <div className="mb-6 rounded-xl border border-text-secondary/20 bg-background p-4">
          <div className="flex items-start gap-3">
            <div className="mt-0.5 h-9 w-9 shrink-0 rounded-xl bg-primary/10 flex items-center justify-center">
              <span className="text-primary font-semibold">N</span>
            </div>
            <div className="space-y-1">
              <p className="text-sm font-medium text-text-primary">
                뉴스는 자유롭게, 소통은 회원만
              </p>
              <p className="text-xs text-text-secondary leading-relaxed">
                비회원도 뉴스 정보는 볼 수 있어요.<br />
                가입하면 채팅과 친구 기능을 바로 사용할 수 있어요.
              </p>
            </div>
          </div>
        </div>

        <SignupForm
          onSuccess={handleSignupSuccess}
        />

        <div className="mt-6 space-y-3">

          <p className="text-center text-sm text-text-secondary">
            이미 계정이 있으신가요?{' '}
            <Link
              href="/login"
              className="font-medium text-text-primary hover:underline"
            >
              로그인
            </Link>
          </p>

          <p className="text-[11px] text-center text-text-secondary leading-relaxed">
            회원가입 시 NewSive의{' '}
            <span className="underline cursor-pointer hover:text-text-primary">
              이용약관
            </span>{' '}
            및{' '}
            <span className="underline cursor-pointer hover:text-text-primary">
              개인정보 처리방침
            </span>
            에 동의한 것으로 간주합니다.
          </p>
        </div>
      </div>
    </main>
  );
}
