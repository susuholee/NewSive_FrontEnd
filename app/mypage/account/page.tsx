'use client';

import { useEffect, useState } from 'react';
import { useAuthStore } from '@/shared/store/authStore';
import type { AxiosError } from 'axios';
import { changeNickname, changePassword,deleteUser} from '@/shared/api/users.api';
import { ConfirmModal } from '@/shared/components/ConfirmModal';

export default function AccountPage() {
  const user = useAuthStore((state) => state.user);
  const updateUser = useAuthStore((state) => state.updateUser);
  const logout = useAuthStore((state) => state.logout);

  const [nickname, setNickname] = useState('');
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [deleteLoading, setDeleteLoading] = useState(false);
  const [deleteError, setDeleteError] = useState('');

  useEffect(() => {
    if (user) setNickname(user.nickname);
  }, [user]);

  if (!user) return null;


  const handleNicknameSave = async () => {
    if (!nickname || nickname === user.nickname) return;

    try {
      setLoading(true);
      setError('');
      setSuccess('');

      const res = await changeNickname(nickname);
      updateUser({ nickname: res.nickname });

      setSuccess('닉네임이 변경되었습니다.');
    } catch (err) {
      const error = err as AxiosError<{ message?: string }>;
      setError(
        error.response?.data?.message || '닉네임 변경에 실패했습니다.'
      );
    } finally {
      setLoading(false);
    }
  };

 
  const handlePasswordChange = async () => {
    if (!currentPassword || !newPassword) return;

    if (newPassword !== confirmPassword) {
      setError('새 비밀번호가 일치하지 않습니다.');
      return;
    }

    try {
      setLoading(true);
      setError('');
      setSuccess('');

      await changePassword(currentPassword, newPassword);

      setSuccess('비밀번호가 변경되었습니다.');
      setCurrentPassword('');
      setNewPassword('');
      setConfirmPassword('');
    } catch (err) {
      const error = err as AxiosError<{ message?: string }>;
      setError(
        error.response?.data?.message || '비밀번호 변경에 실패했습니다.'
      );
    } finally {
      setLoading(false);
    }
  };


  const handleDeleteUser = async () => {
    try {
      setDeleteLoading(true);
      setDeleteError('');

      await deleteUser();
      logout();
    } catch {
      setDeleteError(
        '회원 탈퇴에 실패했습니다. 잠시 후 다시 시도해주세요.'
      );
    } finally {
      setDeleteLoading(false);
    }
  };

  return (
    <>
    <main className="mx-auto max-w-2xl space-y-10 px-4 py-10 bg-surface-muted">
  <h1 className="text-2xl font-bold text-text-primary">
    계정 설정
  </h1>

  {error && (
    <p className="rounded-lg bg-primary-soft/40 px-4 py-2 text-sm text-text-primary">
      {error}
    </p>
  )}

  {success && (
    <p className="rounded-lg bg-primary-soft/40 px-4 py-2 text-sm text-text-primary">
      {success}
    </p>
  )}

  {/* 기본 정보 */}
  <section className="rounded-xl bg-surface p-6 shadow-sm space-y-4">
    <h2 className="text-lg font-semibold text-text-primary">
      기본 정보
    </h2>

    <div>
      <label className="block text-sm text-text-secondary">
        닉네임
      </label>
      <input
        value={nickname}
        onChange={(e) => setNickname(e.target.value)}
        className="mt-1 w-full rounded-md border px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary-soft"
      />
    </div>

    <div>
      <label className="block text-sm text-text-secondary">
        아이디
      </label>
      <input
        disabled
        value={user.username}
        className="mt-1 w-full rounded-md border bg-surface-muted px-3 py-2 text-text-secondary"
      />
    </div>

    <button
      onClick={handleNicknameSave}
      disabled={loading}
      className="rounded-md bg-primary px-4 py-2 text-sm font-medium text-white hover:bg-primary-hover disabled:opacity-50"
    >
      닉네임 저장
    </button>
  </section>

  {/* 비밀번호 변경 */}
  <section className="rounded-xl bg-surface p-6 space-y-4">
    <h2 className="text-lg font-semibold text-text-primary">
      비밀번호 변경
    </h2>

    <div className="space-y-3">
      <input
        type="password"
        placeholder="현재 비밀번호"
        value={currentPassword}
        onChange={(e) => setCurrentPassword(e.target.value)}
        className="w-full rounded-md border px-3 py-2"
      />
      <input
        type="password"
        placeholder="새 비밀번호"
        value={newPassword}
        onChange={(e) => setNewPassword(e.target.value)}
        className="w-full rounded-md border px-3 py-2"
      />
      <input
        type="password"
        placeholder="새 비밀번호 확인"
        value={confirmPassword}
        onChange={(e) => setConfirmPassword(e.target.value)}
        className="w-full rounded-md border px-3 py-2"
      />
    </div>

    <button
      onClick={handlePasswordChange}
      disabled={loading}
      className="rounded-md bg-primary px-4 py-2 text-sm font-medium text-white hover:bg-primary-hover disabled:opacity-50"
    >
      비밀번호 변경
    </button>
  </section>

<section className="rounded-xl bg-surface-muted p-6">
  <p className="mt-1 text-sm text-text-secondary">
    회원 탈퇴 시 계정 정보는 복구할 수 없습니다.
  </p>

  <button
    onClick={() => setIsDeleteModalOpen(true)}
    className="mt-4 rounded-md bg-primary px-4 py-2 text-sm font-medium text-white hover:bg-primary-hover"
  >
    회원 탈퇴
  </button>
</section>


</main>


  
      {isDeleteModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
          <div className="w-80 rounded-lg bg-white p-6 text-center space-y-4">
            <h2 className="text-lg font-semibold">
              회원 탈퇴
            </h2>

            <p className="text-sm text-gray-600">
              정말 탈퇴하시겠습니까?
              <br />
              이 작업은 되돌릴 수 없습니다.
            </p>

            {deleteError && (
              <p className="text-sm text-red-600">
                {deleteError}
              </p>
            )}

            <div className="flex gap-2">
              <button
                onClick={() => setIsDeleteModalOpen(false)}
                disabled={deleteLoading}
                className="flex-1 rounded-md border py-2 text-sm"
              >
                취소
              </button>

              {isDeleteModalOpen && (
              <ConfirmModal
                title="회원 탈퇴"
                description="정말 탈퇴하시겠습니까? 이 작업은 되돌릴 수 없습니다."
                confirmText={deleteLoading ? '탈퇴 중...' : '탈퇴'}
                cancelText="취소"
                onConfirm={handleDeleteUser}
                onCancel={() => setIsDeleteModalOpen(false)}
              />
            )}
            </div>
          </div>
        </div>
      )}
    </>
  );
}
