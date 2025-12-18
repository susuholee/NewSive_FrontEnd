export default function SignupPage() {
  return (
    <main className="flex min-h-screen items-center justify-center">
      <div className="w-full max-w-sm space-y-6">
        <h1 className="text-2xl font-bold text-center">회원가입</h1>

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

          <div>
            <label className="block text-sm font-medium">비밀번호 확인</label>
            <input
              type="password"
              className="mt-1 w-full rounded border px-3 py-2"
              placeholder="비밀번호를 다시 입력하세요"
            />
          </div>

  
          <p className="text-sm text-red-500">
          </p>

          <button
            type="button"
            className="w-full rounded bg-fuchsia-300 py-2 text-black"
          >
            회원가입
          </button>
        </form>

        <p className="text-center text-sm">
          이미 계정이 있으신가요?{" "}
          <a href="/login" className="text-black underline">
            로그인
          </a>
        </p>
      </div>
    </main>
  );
}
