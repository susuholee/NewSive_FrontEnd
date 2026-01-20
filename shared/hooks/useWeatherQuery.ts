import { useQuery } from "@tanstack/react-query";
import { getWeather } from "@/shared/api/weather.api";

export const useWeatherQuery = (city: string = "Seoul")  => {
  return useQuery({
    queryKey: ["weather", city],
    queryFn: () => getWeather(city),
    staleTime: 5 * 60 * 1000,     
    refetchInterval: 10 * 60 * 1000, 
  });
}
