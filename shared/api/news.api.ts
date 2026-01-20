import { apiClient } from "../lib/axios";
import type { News } from "../types/news";


export const NewsList = async (refresh = false): Promise<News[]> => {
  const url = refresh ? "/news?refresh=true" : "/news";
  const res = await apiClient.get(url);
  return res.data;
};
