"use client";

import { useWeatherQuery } from "@/shared/queries/useWeatherQuery";

function getWeatherEmoji(main: string) {
  switch (main) {
    case "Clear":
      return "☀️";
    case "Clouds":
      return "☁️";
    case "Rain":
      return "🌧️";
    case "Snow":
      return "❄️";
    case "Thunderstorm":
      return "⛈️";
    default:
      return "🌤️";
  }
}

function dustGrade(value?: number) {
  if (value == null) return "-";
  if (value <= 15) return "좋음";
  if (value <= 35) return "보통";
  if (value <= 75) return "나쁨";
  return "매우 나쁨";
}

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

  const weather = data.weather[0];
  const temp = Math.round(data.main.temp);

  return (
    <div className="rounded-xl border bg-white p-4">
      {/* 위치 */}
      <div className="mb-2 flex items-center gap-1 text-sm text-gray-600">
        <span className="font-medium">지역: {data.name}</span>
      </div>

      {/* 메인 영역 */}
      <div className="flex items-center gap-4">
        <div className="text-4xl">
          {getWeatherEmoji(weather.main)}
        </div>

        <div>
          <div className="text-3xl font-semibold leading-none">
            {temp}°
          </div>
          <div className="text-sm text-gray-500">
            {weather.description}
          </div>
        </div>
      </div>

      {/* 미세먼지 */}
      {data.air && (
        <div className="mt-3 flex gap-4 text-sm text-gray-600">
          <div>
            초미세먼지{" "}
            <span className="font-medium">
              {dustGrade(data.air.pm25)}
            </span>
          </div>
          <div>
            미세먼지{" "}
            <span className="font-medium">
              {dustGrade(data.air.pm10)}
            </span>
          </div>
        </div>
      )}
    </div>
  );
}
