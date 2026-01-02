import { gnewsAxios } from './gnews.axios';
import { News } from '../../types/news';

let cachedNews: News | null = null;
let lastFetched = 0;

const CACHE_TTL = 15 * 60 * 1000;

export async function GetGNews(): Promise<News> {
  const now = Date.now();

  if (cachedNews && now - lastFetched < CACHE_TTL) {
    return cachedNews;
  }

  const { data } = await gnewsAxios.get<News>('/top-headlines', {
    params: {
      country: 'kr',
      max: 10,
    },
  });

  cachedNews = data;
  lastFetched = now;

  return data;
}
