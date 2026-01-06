'use client';

import { useRouter } from 'next/navigation';
import { ConfirmModal } from './ConfirmModal';

export default function LoginRequiredModal({
  onClose,
}: {
  onClose: () => void;
}) {
  const router = useRouter();

  const handleLogin = () => {
    onClose();
    router.push('/login');
  };

  return (
    <ConfirmModal
      title="로그인 후 이용해주세요"
      description="해당 기능은 로그인 후 사용할 수 있습니다."
      confirmText="로그인"
      cancelText="닫기"
      onConfirm={handleLogin}
      onCancel={onClose}
    />
  );
}
