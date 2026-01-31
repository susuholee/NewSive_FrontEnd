'use client';

import { useState } from 'react';
import Link from 'next/link';
import ThumbnailImage from '@/shared/components/ThumbnailImage';
import { useNewsList } from '../../shared/hooks/useNewsList';

function formatDate(iso: string) {
  return new Date(iso).toLocaleString('ko-KR', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
  });
}

export default function NewsPage() {
  const {
    data: newsList,
    isLoading,
    error,
    refetch,
    dataUpdatedAt,
  } = useNewsList();

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
                <div className="h-3 w-full rounded bg-gray-200" />
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
      {/* ===== 상단 헤더 (반응형 개선) ===== */}
      <div className="mb-4 flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
        <h2 className="text-lg font-semibold">최신 뉴스</h2>

        <div className="flex flex-col items-start gap-2 sm:flex-row sm:items-center sm:gap-3">
          {dataUpdatedAt > 0 && (
            <span className="text-xs text-gray-400 whitespace-nowrap sm:whitespace-normal">
              마지막 업데이트:{' '}
              {new Date(dataUpdatedAt).toLocaleTimeString('ko-KR')}
            </span>
          )}

          <button
            onClick={() => refetch()}
            className="
              w-full sm:w-auto
              flex items-center justify-center gap-1
              rounded-md border border-primary
              bg-primary px-3 py-1 text-sm font-medium text-white
              transition
              hover:bg-primary-hover
              focus-visible:outline-none
              focus-visible:ring-2
              focus-visible:ring-primary
            "
          >
            최신 뉴스 불러오기
          </button>
        </div>
      </div>

      {/* ===== 뉴스 리스트 ===== */}
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
            .map((p) => {
              const isActive = p === page;

              return (
                <button
                  key={p}
                  onClick={() => setPage(p)}
                  className={`
                    min-w-[36px] rounded-md border px-3 py-1 text-sm font-medium transition
                    ${
                      isActive
                        ? 'bg-primary border-primary text-white'
                        : 'border-surface-muted text-text-secondary hover:bg-primary-soft hover:text-primary'
                    }
                  `}
                >
                  {p}
                </button>
              );
            })}
        </div>
      )}
    </main>
  );
}
