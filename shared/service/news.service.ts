import { News } from '../types/news';
import { mapGNewsArticleToNews } from '../mappers/news.mapper';
import { GNewsResponse } from '../dto/gnews.dto';
import { apiClient } from '../lib/axios';

export async function getNewsList(): Promise<News[]> {
  const data = await apiClient.get<GNewsResponse>('/api/news');

  return data.data.articles.map(mapGNewsArticleToNews);
}
