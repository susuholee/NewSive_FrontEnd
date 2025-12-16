import { getNewsList } from "../../../shared/service/news.service";
import { redirect } from "next/navigation";

type Props = {
  params: Promise<{
    id: string;
  }>;
};

export default async function NewsDetailPage({ params }: Props) {
  const { id } = await params;
  const decodedId = decodeURIComponent(id);

  const newsList = await getNewsList();
  const news = newsList.find(item => item.id === decodedId);

  if (!news) {
    return <div>존재하지 않는 뉴스입니다.</div>;
  }

  redirect(news.original_link);
}
