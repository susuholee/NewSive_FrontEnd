type Friend = {
  id: number;
  username: string;
  nickname: string;
};

const mockFriends: Friend[] = [
  { id: 1, username: "alice", nickname: "앨리스" },
  { id: 2, username: "bob", nickname: "밥" },
];

export default function FriendsPage() {
  return (
    <main className="mx-auto max-w-2xl px-4 py-8">
      <h1 className="mb-6 text-2xl font-bold">친구 관리</h1>

      <section className="mb-8 rounded border p-4">
        <h2 className="mb-2 font-semibold">친구 추가</h2>
        <div className="flex gap-2">
          <input
            type="text"
            placeholder="친구 아이디 입력"
            className="flex-1 rounded border px-3 py-2"
          />
          <button className="rounded bg-blue-600 px-4 py-2 text-white">
            추가
          </button>
        </div>
      </section>

      <section className="rounded border p-4">
        <h2 className="mb-4 font-semibold">친구 목록</h2>

        {mockFriends.length === 0 ? (
          <p className="text-sm text-gray-500">
            등록된 친구가 없습니다.
          </p>
        ) : (
          <ul className="space-y-3">
            {mockFriends.map((friend) => (
              <li
                key={friend.id}
                className="flex items-center justify-between rounded border px-3 py-2"
              >
                <div>
                  <p className="text-sm font-medium">
                    {friend.nickname}
                  </p>
                  <p className="text-xs text-gray-500">
                    @{friend.username}
                  </p>
                </div>
                <button className="text-sm text-red-500">
                  삭제
                </button>
              </li>
            ))}
          </ul>
        )}
      </section>
    </main>
  );
}
