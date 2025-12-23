'use client';
import { useAuthStore } from "@/shared/store/authStore";
import { useEffect, useState } from "react";
export default function AccountPage() {
  const user = useAuthStore((state) => state.user);
  const [nickname, setNickname] = useState('');
  useEffect(() => {
    if (user) {
      setNickname(user.nickname)
    }
  }, [user]);

  const handleSave = () => {
    console.log({
      username : user?.username,
      nickname,
    })
  }
  return (
    <main className="mx-auto max-w-2xl px-4 py-8">
      <h1 className="mb-6 text-2xl font-bold">계정 정보 수정</h1>

      <form className="space-y-6">
        <div>
          <label className="block text-sm font-medium">닉네임</label>
          <input
            type="text"
            className="mt-1 w-full rounded border px-3 py-2"
            placeholder="닉네임을 입력하세요"
            value={nickname}
            onChange={(e) => setNickname(e.target.value)}
          />
        </div>


        <div>
          <label className="block text-sm font-medium">아이디</label>
          <input
            type="text"
            disabled
            className="mt-1 w-full rounded border bg-gray-100 px-3 py-2 text-gray-500"
            value={user?.username}
          />
        </div>

   
        <div>
          <label className="block text-sm font-medium">
            새 비밀번호
          </label>
          <input
            type="password"
            className="mt-1 w-full rounded border px-3 py-2"
            placeholder="새 비밀번호"
          />
        </div>

        <div>
          <label className="block text-sm font-medium">
            새 비밀번호 확인
          </label>
          <input
            type="password"
            className="mt-1 w-full rounded border px-3 py-2"
            placeholder="새 비밀번호 확인"
          />
        </div>

       
        <button
          type="button"
          className="rounded bg-blue-600 px-4 py-2 text-white"
          onClick={handleSave}
        >
          저장
        </button>
      </form>

      <section className="mt-10 border-t pt-6">
        <button className="text-sm text-red-500">
          회원 탈퇴
        </button>
      </section>
    </main>
  );
}
