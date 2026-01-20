import { apiClient } from "../lib/axios";

export const fetchWeather = async (lat: number, lon: number) => {
  const res = await apiClient.get("/weather", {
    params: { lat, lon },
  });
  return res.data;
};
