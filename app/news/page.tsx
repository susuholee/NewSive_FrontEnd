import { getNewsList } from "../../shared/service/news.service";
import Link from "next/link";

export default async function NewsPage() {
  const newsList = await getNewsList();

  return (
    <>
      <h1>뉴스 리스트 페이지입니다.</h1>
      <ul>
        {newsList.map(news => (
          <li key={news.id}>
            <Link href={`/news/${encodeURIComponent(news.id)}`}>
              {news.title}
            </Link>
          </li>
        ))}
      </ul>
    </>
  );
}
