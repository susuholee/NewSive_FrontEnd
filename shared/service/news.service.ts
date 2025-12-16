import { GetGNews } from '../api/gnews';
import { News } from '../types/news';
import { GNewsArticle } from '../types/news';

function mapGNewsToNews(article: GNewsArticle): News {
  return {
    id: crypto.randomUUID(),
    title: article.title,
    summary: article.description,
    thumbnail_url: article.image,
    published_at: article.publishedAt,
    original_link: article.url,
  };
}

export async function getNewsList(): Promise<News[]> {
  const data = await GetGNews();
  return data.articles.map(mapGNewsToNews);
}
