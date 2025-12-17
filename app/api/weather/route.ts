import { NextResponse } from "next/server";
import { getCurrentWeatherByCity } from "@/shared/external/weather/weather.api";

export async function GET() {
  try {
    const data = await getCurrentWeatherByCity("Seoul");

    return NextResponse.json(data);
  } catch (e) {
    return NextResponse.json(
      { message: "날씨 조회 실패 오류" },
      { status: 500 }
    );
  }
}
