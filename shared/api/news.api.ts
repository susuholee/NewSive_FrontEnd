import { apiClient } from "../lib/axios";
import type { News } from "../types/news";


export const getTopNews = async (): Promise<News[]> => {
  const res = await apiClient.get("/news");
  return res.data;
};

