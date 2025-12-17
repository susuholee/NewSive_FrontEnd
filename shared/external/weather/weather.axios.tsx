import axios from "axios";

const baseURL = "https://api.openweathermap.org/data/2.5";
const apiKey = process.env.OPEN_WEATHER_API_KEY;

if (!baseURL) {
  throw new Error("OpenWeather BaseURL을 찾을 수 없습니다");
}

if (!apiKey) {
  throw new Error("OpenWeather API 키를 찾을 수 없습니다");
}

export const weatherAxios = axios.create({
  baseURL,
  timeout: 5000,
  params: {
    appid: apiKey,
    units: "metric",
    lang: "kr",
  },
});
