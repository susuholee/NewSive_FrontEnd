export default function MyPage() {
  return (
    <main className="mx-auto max-w-2xl px-4 py-8">
      <h1 className="mb-6 text-2xl font-bold">마이페이지</h1>

      <section className="mb-8 rounded border p-4">
        <h2 className="mb-2 font-semibold">내 정보</h2>
        <p className="text-sm text-gray-700">아이디: user123</p>
        <p className="text-sm text-gray-700">닉네임: 뉴스유저</p>
      </section>

      <section className="mb-8 rounded border p-4">
        <h2 className="mb-3 font-semibold">설정</h2>
        <ul className="space-y-2 text-sm">
          <li>
            <a
              href="/mypage/account"
              className="text-blue-600 underline"
            >
              계정 정보 수정
            </a>
          </li>
          <li>
            <a
              href="/settings/notifications"
              className="text-blue-600 underline"
            >
              알림 설정
            </a>
          </li>
          <li>
            <a
              href="/mypage/friends"
              className="text-blue-600 underline"
            >
              친구 관리
            </a>
          </li>
        </ul>
      </section>

      <section className="rounded border p-4">
        <button className="text-sm text-red-500">
          로그아웃
        </button>
      </section>
    </main>
  );
}
