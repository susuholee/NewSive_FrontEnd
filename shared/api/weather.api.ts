import { apiClient } from "../lib/axios";

export const getWeather = async (
  city: string,
  refresh: boolean = false,
) => {
  const res = await apiClient.get("/weather", {
    params: {
      city,
      refresh: refresh ? "true" : "false",
    },
  });

  return res.data;
};
