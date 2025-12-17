import { weatherAxios } from "./weather.axios";

export async function getCurrentWeatherByCity(city: string) {
  const data = await weatherAxios.get("/weather", {
    params: { q: city },
  });

  return data.data;
}
