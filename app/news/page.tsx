'use client';

import WeatherWidget from "@/shared/components/WeatherWidget";
import ThumbnailImage from "@/shared/components/ThumbnailImage";
import { useNewsList } from "../../shared/hooks/useNewsList";

function formatDate(iso: string) {
  return new Date(iso).toLocaleString("ko-KR", {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
  });
}

export default function NewsPage() {
  const { data: newsList, isLoading, error } = useNewsList();

  if (isLoading) return <div>로딩중...</div>;
  if (error) return <div>에러 발생</div>;

  return (
    <>
      <WeatherWidget />
      <h1>뉴스 리스트</h1>

      <ul>
        {newsList?.map((news) => (
          <li key={news.id}>
            {news.thumbnailUrl && (
              <ThumbnailImage src={news.thumbnailUrl} alt={news.title} />
            )}

            <h3>
              <a href={news.originalLink} target="_blank" rel="noopener noreferrer">
                {news.title}
              </a>
            </h3>

            <p>
              출처: {news.sourceName} · {formatDate(news.publishedAt)}
            </p>

            <p>{news.summary}</p>
          </li>
        ))}
      </ul>
    </>
  );
}
