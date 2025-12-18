import Link from "next/link";

export default function Header() {
  return (
    <header className="border-b bg-white">
      <div className="mx-auto flex max-w-5xl items-center justify-between px-4 py-3">
        <Link href="/" className="text-lg font-bold">
          NewSive
        </Link>

        <nav className="flex items-center gap-4 text-sm">
          <Link href="/news" className="hover:underline">
            뉴스
          </Link>
          <Link href="/notifications" className="hover:underline">
            알림
          </Link>
          <Link href="/chat" className="hover:underline">
            채팅
          </Link>
          <Link href="/mypage" className="hover:underline">
            마이페이지
          </Link>
        </nav>

        <div className="flex items-center gap-3 text-sm">
          <Link href="/login" className="hover:underline">
            로그인
          </Link>
          <Link
            href="/signup"
            className="rounded border px-3 py-1"
          >
            회원가입
          </Link>
        </div>
      </div>
    </header>
  );
}
