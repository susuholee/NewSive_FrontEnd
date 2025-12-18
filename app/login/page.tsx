export default function LoginPage() {
  return (
    <main className="flex min-h-screen items-center justify-center">
      <div className="w-full max-w-sm space-y-6">
        <h1 className="text-2xl font-bold text-center">로그인</h1>

        <form className="space-y-4">
          <div>
            <label className="block text-sm font-medium">아이디</label>
            <input
              type="text"
              className="mt-1 w-full rounded border px-3 py-2"
              placeholder="아이디를 입력하세요"
            />
          </div>

          <div>
            <label className="block text-sm font-medium">비밀번호</label>
            <input
              type="password"
              className="mt-1 w-full rounded border px-3 py-2"
              placeholder="비밀번호를 입력하세요"
            />
          </div>

          <button
            type="button"
            className="w-full rounded bg-fuchsia-300 py-2 text-black"
          >
            로그인
          </button>
        </form>

        <p className="text-center text-sm">
          아직 회원이 아니신가요?{" "}
          <a href="/signup" className="text-black underline">
            회원가입
          </a>
        </p>
      </div>
    </main>
  );
}
