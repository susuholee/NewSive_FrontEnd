
type Notification = {
  id: number;
  message: string;
  isRead: boolean;
  createdAt: string;
};

const mockNotifications: Notification[] = [
  {
    id: 1,
    message: "속보: 주요 뉴스가 업데이트되었습니다.",
    isRead: false,
    createdAt: "2025-12-18 08:30",
  },
  {
    id: 2,
    message: "관심 키워드와 관련된 뉴스가 도착했습니다.",
    isRead: true,
    createdAt: "2025-12-17 21:10",
  },
  {
    id: 3,
    message: "새로운 알림이 있습니다.",
    isRead: true,
    createdAt: "2025-12-16 14:05",
  },
];

export default function NotificationsPage() {
  return (
    <main className="mx-auto max-w-2xl px-4 py-8">
      <h1 className="mb-6 text-2xl font-bold">알림</h1>

      <ul className="space-y-3">
        {mockNotifications.map((notification) => (
          <li
            key={notification.id}
            className={`cursor-pointer rounded border p-4 ${
              notification.isRead
                ? "bg-white"
                : "bg-blue-50 border-blue-200"
            }`}
          >
            <p className="text-sm">{notification.message}</p>
            <p className="mt-1 text-xs text-gray-500">
              {notification.createdAt}
            </p>
          </li>
        ))}
      </ul>

      {mockNotifications.length === 0 && (
        <p className="mt-8 text-center text-sm text-gray-500">
          받은 알림이 없습니다.
        </p>
      )}
    </main>
  );
}
