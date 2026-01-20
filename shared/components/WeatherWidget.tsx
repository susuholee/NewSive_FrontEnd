"use client";

import { useWeatherQuery } from "@/shared/hooks/useWeatherQuery";

export default function WeatherWidget() {
  const { data, isLoading, isError, refetch } = useWeatherQuery("Seoul");

  if (isLoading) {
    return (
      <div className="rounded-xl border bg-white p-4 text-sm text-gray-400">
        날씨 불러오는 중...
      </div>
    );
  }

  if (isError || !data) {
    return (
      <button
        onClick={() => refetch()}
        className="rounded-xl border bg-white p-4 text-sm text-gray-500 hover:bg-gray-50"
      >
        날씨 다시 불러오기
      </button>
    );
  }

  const temp = Math.round(data.temperature);

  return (
    <div className="rounded-xl border bg-white p-4">
      <div className="mb-2 flex items-center gap-1 text-sm text-gray-600">
        <span className="font-medium">지역: {data.city}</span>
      </div>

      <div className="flex items-center gap-4">

        <div className="text-4xl">
          {data.iconUrl ? (
            <img
              src={data.iconUrl}
              alt={data.weather}
              width={60}
              height={60}
            />
          ) : (
            "🌤️"
          )}
        </div>

        <div>
          <div className="text-3xl font-semibold leading-none">
            {temp}°
          </div>
          <div className="text-sm text-gray-500">
            {data.weather}
          </div>
          <div className="text-xs text-gray-400">
            체감 {Math.round(data.feelsLike)}° · 습도 {data.humidity}%
          </div>
        </div>
      </div>


      <div className="mt-3 text-xs text-gray-400">
        마지막 업데이트:{" "}
        {new Date(data.updatedAt).toLocaleTimeString("ko-KR")}
      </div>
    </div>
  );
}
