export default function NotificationSettingsPage() {
  return (
    <main className="mx-auto max-w-2xl px-4 py-8">
      <h1 className="mb-6 text-2xl font-bold">알림 설정</h1>


      <section className="mb-8 rounded border p-4">
        <h2 className="mb-3 font-semibold">알림 수신</h2>

        <label className="flex items-center gap-3 text-sm">
          <input type="checkbox" className="h-4 w-4" />
          전체 알림 받기
        </label>
      </section>


      <section className="mb-8 rounded border p-4">
        <h2 className="mb-3 font-semibold">뉴스 알림</h2>

        <label className="flex items-center gap-3 text-sm">
          <input type="checkbox" className="h-4 w-4" />
          뉴스 속보 알림 받기
        </label>
      </section>

      <section className="rounded border p-4">
        <h2 className="mb-3 font-semibold">관심 키워드</h2>

        <input
          type="text"
          placeholder="예: 정치, 경제, AI"
          className="w-full rounded border px-3 py-2 text-sm"
        />
        <p className="mt-2 text-xs text-gray-500">
          쉼표(,)로 구분하여 입력하세요
        </p>
      </section>


      <div className="mt-8">
        <button className="rounded bg-blue-600 px-4 py-2 text-white">
          저장
        </button>
      </div>
    </main>
  );
}
