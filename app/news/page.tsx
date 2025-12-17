import WeatherWidget from "@/shared/components/WeatherWidget";
import { getNewsList } from "../../shared/service/news.service";
import ThumbnailImage from "@/shared/components/ThumbnailImage";

function formatDate(iso: string) {
  return new Date(iso).toLocaleString("ko-KR", {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
  });
}

export default async function NewsPage() {
  const newsList = await getNewsList();

  return (
    <>
      <WeatherWidget/>
      <h1>뉴스 리스트</h1>

      <ul>
        {newsList.map((news) => (
          <li key={news.id}>
            {news.thumbnail_url && (
              <ThumbnailImage
                src={news.thumbnail_url}
                alt={news.title}
              />
            )}

            <h3>
              <a
                href={news.original_link}
                target="_blank"
                rel="noopener noreferrer"
              >
                {news.title}
              </a>
            </h3>

            <p>
              출처: {news.source_name} · {formatDate(news.published_at)}
            </p>

            <p>
              {news.summary}
            </p>
          </li>
        ))}
      </ul>
    </>
  );
}
