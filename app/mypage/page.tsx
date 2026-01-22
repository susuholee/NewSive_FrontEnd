'use client';

import { useState, useRef } from "react";
import { useRouter } from "next/navigation";
import { useAuthStore } from "@/shared/store/authStore";
import {changeNickname,changePassword,updateProfileImage,deleteUser} from "@/shared/api/users.api";
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
  const updateUser = useAuthStore((state) => state.updateUser);
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
      onConfirm: handleConfirmImageConfirm,
    });
  };

  const handleConfirmImageConfirm = () => {
    closeModal();
    fileInputRef.current?.click();
  };

  const handleChangeProfileImage = async (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const formData = new FormData();
    formData.append("file", file);

    try {
      setIsUploadingImage(true);
      const data = await updateProfileImage(formData);

      const newProfileUrl = `${data.profileImgUrl}?t=${Date.now()}`;

      updateUser({ profileImgUrl: newProfileUrl });
      openInfoModal("완료", "프로필 이미지가 변경되었습니다.");
    } catch {
      openInfoModal("실패", "프로필 이미지 변경에 실패했습니다.");
    } finally {
      setIsUploadingImage(false);
    }
  };


  const handleSaveNickname = async () => {
    if (!nickname.trim()) {
      openInfoModal("오류", "닉네임을 입력해주세요.");
      return;
    }

    if (nickname === user?.nickname) {
      openInfoModal("안내", "변경된 내용이 없습니다.");
      return;
    }

    try {
      setIsSavingNickname(true);
      await changeNickname(nickname);
      updateUser({ nickname });
      openInfoModal("완료", "닉네임이 변경되었습니다.");
    } catch {
      openInfoModal("실패", "닉네임 변경에 실패했습니다.");
    } finally {
      setIsSavingNickname(false);
    }
  };

  /* ---------- 비밀번호 ---------- */
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

  /* ---------- 회원 탈퇴 ---------- */
  const openConfirmDeleteModal = () => {
    setModal({
      open: true,
      title: "회원 탈퇴",
      description:
        "정말로 회원 탈퇴를 진행하시겠습니까? 탈퇴 후에는 계정을 복구할 수 없습니다.",
      confirmText: "탈퇴",
      cancelText: "취소",
      onConfirm: handleConfirmDeleteUser,
    });
  };

  const handleConfirmDeleteUser = async () => {
    closeModal();

    try {
      await deleteUser();
      logout();

      openInfoModal("탈퇴 완료", "회원 탈퇴가 정상적으로 처리되었습니다.");

      setTimeout(() => {
        router.replace("/");
      }, 500);
    } catch {
      openInfoModal("실패", "회원 탈퇴 처리에 실패했습니다.");
    }
  };

  return (
    <main className="min-h-screen bg-background py-12 text-text-primary">
      <div className="mx-auto max-w-6xl px-4">
        <div className="grid grid-cols-1 gap-10 md:grid-cols-3">
          <aside className="
            sticky top-24 h-fit self-start rounded-xl bg-white p-0 shadow-sm border border-surface-muted overflow-hidden
            animate-fade-in-up
          ">

           <div className="bg-primary-soft px-4 py-2 text-[11px] tracking-wide text-text-secondary border-b border-surface-muted">
            내 프로필
            </div>

            <div className="p-4">
              <div className="flex flex-col items-center text-center gap-3">

             
                <div
                  onClick={openConfirmImageModal}
                  className="group relative h-20 w-20 overflow-hidden rounded-full bg-surface-muted border cursor-pointer transition"
                >
                  {user?.profileImgUrl ? (
                    <img
                      src={user.profileImgUrl}
                      alt="프로필"
                      className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-110"
                    />
                  ) : (
                    <div className="flex h-full w-full items-center justify-center text-2xl font-semibold text-text-secondary">
                      {user?.nickname?.[0] || "U"}
                    </div>
                  )}

              
                  <div className="absolute inset-0 flex items-center justify-center bg-black/40 opacity-0 transition-opacity duration-300 group-hover:opacity-100">
                    <span className="text-white text-xs font-medium">변경</span>
                  </div>

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
              </div>

             
              <div className="my-4 h-px w-full bg-surface-muted" />

           
              <div className="flex flex-col items-center gap-2">
                <button
                  onClick={openConfirmImageModal}
                  disabled={isUploadingImage}
                  className="
                    rounded-md border border-primary px-4 py-1.5 text-[12px] font-medium text-primary
                    transition-all duration-200
                    hover:bg-primary hover:text-white
                    active:scale-95
                    disabled:opacity-50
                  "
                >
                  사진 변경
                </button>
              </div>

              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                className="hidden"
                onChange={handleChangeProfileImage}
              />
            </div>
          </aside>


          <div className="md:col-span-2">

            <section className="mb-10 rounded-2xl bg-surface p-8 shadow-sm border border-surface-muted">
              <h2 className="mb-6 text-lg font-semibold">내 정보</h2>

              <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">

                <div>
                  <p className="mb-1 text-xs text-text-secondary">계정 아이디</p>
                  <div className="rounded-xl bg-surface-muted p-3 font-medium">
                    {user?.username}
                  </div>
                </div>

                <div>
                  <p className="mb-1 text-xs text-text-secondary">닉네임</p>
                  <input
                    value={nickname}
                    onChange={(e) => setNickname(e.target.value)}
                    className="w-full rounded-xl border border-surface-muted bg-white px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
                  />

                  <button
                    onClick={handleSaveNickname}
                    disabled={isSavingNickname}
                    className="mt-3 inline-flex rounded-lg bg-primary px-4 py-2 text-sm font-medium text-white transition hover:bg-primary/90 disabled:opacity-50"
                  >
                    {isSavingNickname ? "저장 중..." : "닉네임 저장"}
                  </button>
                </div>
              </div>
            </section>

    
            <section className="mb-10 rounded-2xl bg-surface p-8 shadow-sm border border-surface-muted">
              <h2 className="mb-6 text-lg font-semibold">비밀번호 변경</h2>

              <div className="space-y-4 max-w-md">
                <input
                  type="password"
                  placeholder="현재 비밀번호"
                  value={currentPassword}
                  onChange={(e) => setCurrentPassword(e.target.value)}
                  className="w-full rounded-xl border border-surface-muted px-3 py-2"
                />

                <input
                  type="password"
                  placeholder="새 비밀번호"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  className="w-full rounded-xl border border-surface-muted px-3 py-2"
                />

                <input
                  type="password"
                  placeholder="새 비밀번호 확인"
                  value={newPasswordConfirm}
                  onChange={(e) => setNewPasswordConfirm(e.target.value)}
                  className="w-full rounded-xl border border-surface-muted px-3 py-2"
                />

                <button
                  onClick={handleChangePassword}
                  disabled={isSavingPassword}
                  className="inline-flex rounded-lg bg-primary px-4 py-2 text-sm font-medium text-white transition hover:bg-primary/90 disabled:opacity-50"
                >
                  {isSavingPassword ? "변경 중..." : "비밀번호 변경"}
                </button>
              </div>
            </section>

           
            <section className="rounded-2xl bg-surface p-8 shadow-sm border border-surface-muted">
              <h2 className="mb-4 text-lg font-semibold text-red-600">회원 탈퇴</h2>

              <p className="mb-4 text-sm text-text-secondary">
                회원 탈퇴 시 모든 정보가 삭제되며 복구할 수 없습니다.
              </p>

              <button
                onClick={openConfirmDeleteModal}
                className="rounded-lg border border-red-500 px-4 py-2 text-sm font-medium text-red-600 transition hover:bg-red-50"
              >
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
