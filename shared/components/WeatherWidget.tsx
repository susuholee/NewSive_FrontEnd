"use client";

import { useWeatherQuery } from "@/shared/queries/useWeatherQuery";

export default function WeatherWidget() {
  const { data, isLoading, isError, refetch } = useWeatherQuery("Seoul");

  if (isLoading) return <div>불러오는 중...</div>;
  if (isError) return <button onClick={() => refetch()}>다시 시도</button>;

  const w = data.weather[0];

  return (
    <div>
      <div>{data.name}</div>
      <div>{Math.round(data.main.temp)}도</div>
      <div>{w.description}</div>
    </div>
  );
}
