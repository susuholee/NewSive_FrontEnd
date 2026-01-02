import { useQuery } from "@tanstack/react-query";
import { mockNews } from "../mock/news";
import { News } from "../types/news";

// 임시 플래그
const USE_MOCK = true;

export function useNewsList() {
  return useQuery<News[]>({
    queryKey: ["news"],
    queryFn: async () => {
      if (USE_MOCK) {
        // 네트워크 흉내
        await new Promise((r) => setTimeout(r, 300));
        return mockNews;
      }

      const res = await fetch("/api/news");
      if (!res.ok) throw new Error("뉴스 조회 실패");
      return res.json();
    },
    staleTime: 1000 * 60 * 5,
  });
}
