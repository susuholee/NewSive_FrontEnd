import { useQuery } from "@tanstack/react-query";
import axios from "axios";

export function useWeatherQuery(city = "Seoul") {
  return useQuery({
    queryKey: ["weather", city],
    queryFn: async () => {
      const res = await axios.get("/api/weather");
      return res.data;
    },
    staleTime: 5 * 60 * 1000,       
    refetchInterval: 10 * 60 * 1000,
  });
}
