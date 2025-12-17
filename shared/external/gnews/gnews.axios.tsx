import axios from "axios";

const baseURL = process.env.GNEWS_API_BASE_URL;
const apiKey = process.env.GNEWS_API_KEY;

if (!baseURL) {
  throw new Error("BaseURL을 찾을 수 없습니다");
}

if (!apiKey) {
  throw new Error("GNews API 키를 찾을 수 없습니다");
}

export const gnewsAxios = axios.create({
  baseURL,
  timeout: 5000,
  params: {
    apikey: apiKey
  },
});
