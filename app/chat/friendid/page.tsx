import ChatPageClient from './ChatPage.client';

export const dynamic = 'force-static';

export async function generateStaticParams() {
  return [];
}

export default function Page() {
  return <ChatPageClient />;
}
