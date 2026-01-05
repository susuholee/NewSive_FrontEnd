'use client';

import { useRouter } from 'next/navigation';

type Props = {
  onClose: () => void;
};

export default function LoginRequiredModal({ onClose }: Props) {
  const router = useRouter();

  const handleLogin = () => {
    onClose();         
    router.push('/login'); 
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/40"
      onClick={onClose}
    >
      <div
        className="w-80 rounded bg-white p-6 text-center"
        onClick={(e) => e.stopPropagation()}
      >
        <h2 className="mb-2 text-lg font-semibold">
          로그인 후 이용해주세요
        </h2>
        <p className="mb-4 text-sm text-gray-600">
          해당 기능은 로그인 후 사용할 수 있습니다.
        </p>

        <div className="flex gap-2">
          <button
            onClick={onClose}
            className="flex-1 rounded border py-2"
          >
            닫기
          </button>
          <button
            onClick={handleLogin}
            className="flex-1 rounded bg-fuchsia-300 py-2"
          >
            로그인
          </button>
        </div>
      </div>
    </div>
  );
}
