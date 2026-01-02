'use client';

import { useState } from "react";
import Link from "next/link";
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

  const PAGE_SIZE = 5;
  const [page, setPage] = useState(1);

  const totalCount = newsList?.length ?? 0;
  const totalPages = Math.ceil(totalCount / PAGE_SIZE);

  const start = (page - 1) * PAGE_SIZE;
  const end = start + PAGE_SIZE;

  const visibleNews = newsList?.slice(start, end) ?? [];

  if (isLoading) {
    return (
      <main className="mx-auto max-w-3xl px-4 py-6">
        <div className="space-y-4 animate-pulse">
          {Array.from({ length: 5 }).map((_, i) => (
            <div
              key={i}
              className="flex gap-3 rounded-xl border border-gray-200 p-3"
            >
              <div className="h-20 w-28 rounded-md bg-gray-200" />
              <div className="flex flex-1 flex-col gap-2">
                <div className="h-4 w-3/4 rounded bg-gray-200" />
                <div className="h-3 w-full rounded bg-gray-200">
                </div>
                <div className="h-3 w-1/2 rounded bg-gray-200" />
              </div>
            </div>
          ))}
        </div>
      </main>
    );
  }

  if (error) {
    return (
      <main className="mx-auto max-w-3xl px-4 py-6 text-center text-gray-500">
        뉴스를 불러오지 못했습니다.
      </main>
    );
  }

  return (
    <main className="mx-auto max-w-3xl px-4 py-6">
      <ul className="space-y-4">
        {visibleNews.map((news) => (
          <li
            key={news.id}
            className="rounded-xl border border-gray-200 bg-white transition hover:bg-gray-50"
          >
            <Link
              href={news.originalLink}
              target="_blank"
              rel="noopener noreferrer"
              className="block p-3"
            >
              <div className="flex gap-3">
                <div className="h-20 w-28 flex-shrink-0 overflow-hidden rounded-md bg-gray-200">
                  {news.thumbnailUrl && (
                    <ThumbnailImage
                      src={news.thumbnailUrl}
                      alt={news.title}
                    />
                  )}
                </div>

                <div className="flex flex-col justify-between">
                  <div>
                    <h3 className="line-clamp-2 text-sm font-semibold text-gray-900">
                      {news.title}
                    </h3>

                    <p className="mt-1 line-clamp-2 text-sm text-gray-700">
                      {news.summary}
                    </p>
                  </div>

                  <p className="mt-2 text-xs text-gray-400">
                    {news.sourceName} · {formatDate(news.publishedAt)}
                  </p>
                </div>
              </div>
            </Link>
          </li>
        ))}
      </ul>


      {totalPages > 1 && (
        <div className="mt-8 flex justify-center gap-1">
          {Array.from({ length: totalPages }, (_, i) => i + 1)
            .slice(Math.max(0, page - 3), page + 2)
            .map((p) => (
              <button
                key={p}
                onClick={() => setPage(p)}
                className={`px-3 py-1 text-sm border rounded
                  ${p === page
                    ? "bg-gray-900 text-white"
                    : "hover:bg-gray-100"
                  }`}
              >
                {p}
              </button>
            ))}

        </div>
      )}
    </main>
  );
}
