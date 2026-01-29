'use client';

import { useState, useRef, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuthStore } from "@/shared/store/authStore";
import { changeNickname, changePassword,updateProfileImage,deleteUser} from "@/shared/api/users.api";
import { ConfirmModal } from "@/shared/components/ConfirmModal";

function getAge(birthday?: string) {
  if (!birthday) return null;

  const birth = new Date(birthday);
  if (isNaN(birth.getTime())) return null;

  const today = new Date();
  let age = today.getFullYear() - birth.getFullYear();

  const m = today.getMonth() - birth.getMonth();
  if (m < 0 || (m === 0 && today.getDate() < birth.getDate())) {
    age--;
  }

  if (age < 0 || age > 150) return null;
  return age;
}

export default function MyPage() {
  const router = useRouter();

  const user = useAuthStore((state) => state.user);
  const patchUser = useAuthStore((state) => state.patchUser);
  const logout = useAuthStore((state) => state.logout);

  const age = getAge(user?.birthday);

  const [nickname, setNickname] = useState(user?.nickname || "");
  const [isSavingNickname, setIsSavingNickname] = useState(false);

  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [newPasswordConfirm, setNewPasswordConfirm] = useState("");
  const [isSavingPassword, setIsSavingPassword] = useState(false);

  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isUploadingImage, setIsUploadingImage] = useState(false);
  const [avatarUrl, setAvatarUrl] = useState<string | null>(null);

  useEffect(() => {
    if (user?.nickname) setNickname(user.nickname);
  }, [user?.nickname]);

  useEffect(() => {
    setAvatarUrl(user?.profileImgUrl ?? null);
  }, [user?.profileImgUrl]);

  const [modal, setModal] = useState<{
    open: boolean;
    title: string;
    description?: string;
    confirmText?: string;
    cancelText?: string;
    onConfirm?: () => void;
  }>({ open: false, title: "" });

  const closeModal = () => {
    setModal((prev) => ({ ...prev, open: false }));
  };

  const openInfoModal = (title: string, description: string) => {
    setModal({
      open: true,
      title,
      description,
      confirmText: "확인",
      cancelText: "닫기",
      onConfirm: closeModal,
    });
  };

  const openConfirmImageModal = () => {
    setModal({
      open: true,
      title: "프로필 이미지 변경",
      description: "프로필 이미지를 변경하시겠습니까?",
      confirmText: "변경",
      cancelText: "취소",
      onConfirm: () => {
        closeModal();
        fileInputRef.current?.click();
      },
    });
  };

  const handleChangeProfileImage = async (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = e.target.files?.[0];
    if (!file) return;

    e.target.value = "";

    const previewUrl = URL.createObjectURL(file);
    setAvatarUrl(previewUrl);

    const formData = new FormData();
    formData.append("file", file);

    try {
      setIsUploadingImage(true);
      const res = await updateProfileImage(formData);
      patchUser({ profileImgUrl: res.profileImgUrl });
      openInfoModal("완료", "프로필 이미지가 변경되었습니다.");
    } catch {
      setAvatarUrl(user?.profileImgUrl ?? null);
      openInfoModal("실패", "프로필 이미지 변경에 실패했습니다.");
    } finally {
      setIsUploadingImage(false);
    }
  };

  const handleSaveNickname = async () => {
    const trimmed = nickname.trim();

    if (!trimmed || trimmed === user?.nickname) {
      setNickname(user?.nickname ?? "");
      openInfoModal("안내", "변경된 내용이 없습니다.");
      return;
    }

    try {
      setIsSavingNickname(true);
      await changeNickname(trimmed);
      patchUser({ nickname: trimmed });
      openInfoModal("완료", "닉네임이 변경되었습니다.");
    } catch {
      openInfoModal("실패", "닉네임 변경에 실패했습니다.");
    } finally {
      setIsSavingNickname(false);
    }
  };

  const handleChangePassword = async () => {
    if (!currentPassword || !newPassword || !newPasswordConfirm) {
      openInfoModal("오류", "모든 비밀번호를 입력해주세요.");
      return;
    }

    if (newPassword !== newPasswordConfirm) {
      openInfoModal("오류", "새 비밀번호가 서로 일치하지 않습니다.");
      return;
    }

    try {
      setIsSavingPassword(true);
      await changePassword(currentPassword, newPassword);
      openInfoModal("완료", "비밀번호가 변경되었습니다.");
      setCurrentPassword("");
      setNewPassword("");
      setNewPasswordConfirm("");
    } catch {
      openInfoModal("실패", "비밀번호 변경에 실패했습니다.");
    } finally {
      setIsSavingPassword(false);
    }
  };

  const handleConfirmDeleteUser = async () => {
    closeModal();
    try {
      await deleteUser();
      logout();
      openInfoModal("탈퇴 완료", "회원 탈퇴가 정상적으로 처리되었습니다.");
      setTimeout(() => router.replace("/"), 500);
    } catch {
      openInfoModal("실패", "회원 탈퇴 처리에 실패했습니다.");
    }
  };

  return (
    <main className="min-h-screen bg-background py-12 text-text-primary">
      <div className="mx-auto max-w-6xl px-4">
        <div className="flex flex-col gap-10 md:flex-row md:items-start">


          <aside className="sticky top-24 h-fit w-full md:w-[280px] rounded-xl bg-white border border-surface-muted shadow-sm overflow-hidden">
            <div className="bg-primary-soft px-4 py-2 text-[11px] text-text-secondary border-b">
              내 프로필
            </div>

            <div className="p-4">
              <div className="flex flex-col items-center gap-3 text-center">
                <div
                  onClick={openConfirmImageModal}
                  className="group relative h-20 w-20 rounded-full overflow-hidden bg-surface-muted border cursor-pointer"
                >
                  {avatarUrl ? (
                    <img
                      src={avatarUrl}
                      alt="프로필"
                      className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-110"
                    />
                  ) : (
                    <div className="flex h-full w-full items-center justify-center text-2xl font-semibold text-text-secondary">
                      {user?.nickname?.[0] || "U"}
                    </div>
                  )}

                  {isUploadingImage && (
                    <div className="absolute inset-0 flex items-center justify-center bg-black/50 text-white text-xs">
                      업로드 중...
                    </div>
                  )}
                </div>

                <div>
                  <p className="text-sm font-semibold">{user?.nickname}</p>
                  <p className="text-xs text-text-secondary">{user?.username}</p>

                  {(age !== null || user?.gender) && (
                    <div className="mt-1 flex justify-center gap-2 text-[11px] text-text-secondary">
                      {age !== null && <span>{age}세</span>}
                      {user?.gender && (
                        <span>{user.gender === "male" ? "남성" : "여성"}</span>
                      )}
                    </div>
                  )}
                </div>

                <button
                  onClick={openConfirmImageModal}
                  disabled={isUploadingImage}
                  className="rounded-md border border-primary px-4 py-1.5 text-[12px] font-medium text-primary hover:bg-primary hover:text-white disabled:opacity-50"
                >
                  사진 변경
                </button>

                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={handleChangeProfileImage}
                />
              </div>
            </div>
          </aside>

          <div className="flex-1 space-y-10">
            <section className="rounded-2xl bg-surface p-8 border border-surface-muted shadow-sm">
              <h2 className="mb-6 text-lg font-semibold">내 정보</h2>

              <div className="flex flex-col gap-6 sm:flex-row">
                <div className="flex-1">
                  <p className="mb-1 text-xs text-text-secondary">계정 아이디</p>
                  <div className="rounded-xl bg-surface-muted p-3 font-medium">
                    {user?.username}
                  </div>
                </div>

                <div className="flex-1">
                  <p className="mb-1 text-xs text-text-secondary">닉네임</p>
                  <input
                    value={nickname}
                    onChange={(e) => setNickname(e.target.value)}
                    className="w-full rounded-xl border border-surface-muted bg-white px-3 py-2 text-sm focus:ring-2 focus:ring-primary"
                  />

                  <button
                    onClick={handleSaveNickname}
                    disabled={isSavingNickname}
                    className="mt-3 inline-flex rounded-lg bg-primary px-4 py-2 text-sm font-medium text-white hover:bg-primary/90 disabled:opacity-50"
                  >
                    {isSavingNickname ? "저장 중..." : "닉네임 저장"}
                  </button>
                </div>
              </div>
            </section>

            <section className="rounded-2xl bg-surface p-8 border border-surface-muted shadow-sm">
              <h2 className="mb-6 text-lg font-semibold">비밀번호 변경</h2>

              <div className="space-y-4 max-w-md">
                <input type="password" placeholder="현재 비밀번호" value={currentPassword} onChange={(e) => setCurrentPassword(e.target.value)} className="w-full rounded-xl border border-surface-muted px-3 py-2" />
                <input type="password" placeholder="새 비밀번호" value={newPassword} onChange={(e) => setNewPassword(e.target.value)} className="w-full rounded-xl border border-surface-muted px-3 py-2" />
                <input type="password" placeholder="새 비밀번호 확인" value={newPasswordConfirm} onChange={(e) => setNewPasswordConfirm(e.target.value)} className="w-full rounded-xl border border-surface-muted px-3 py-2" />

                <button onClick={handleChangePassword} disabled={isSavingPassword} className="rounded-lg bg-primary px-4 py-2 text-sm font-medium text-white hover:bg-primary/90 disabled:opacity-50">
                  {isSavingPassword ? "변경 중..." : "비밀번호 변경"}
                </button>
              </div>
            </section>

            <section className="rounded-2xl bg-surface p-8 border border-surface-muted shadow-sm">
              <h2 className="mb-4 text-lg font-semibold text-red-600">회원 탈퇴</h2>
              <button onClick={handleConfirmDeleteUser} className="rounded-lg border border-red-500 px-4 py-2 text-sm font-medium text-red-600 hover:bg-red-50">
                회원 탈퇴
              </button>
            </section>
          </div>
        </div>
      </div>

      {modal.open && (
        <ConfirmModal
          title={modal.title}
          description={modal.description}
          confirmText={modal.confirmText}
          cancelText={modal.cancelText}
          onConfirm={modal.onConfirm || closeModal}
          onCancel={closeModal}
        />
      )}
    </main>
  );
}
