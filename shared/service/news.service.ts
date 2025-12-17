import { GetGNews } from '../external/gnews/gnews.api';
import { News } from '../types/news';
import { GNewsArticle } from '../types/news';

function mapGNewsToNews(article: GNewsArticle): News {
  return {
    id: article.id, // 기사 ID 
    title: article.title, // 제목
    summary: article.description, // 내용
    thumbnail_url: article.image, // 이미지
    published_at: article.publishedAt, // 발행일
    original_link: article.url,
    source_name: article.source.name,
  };
}

export async function getNewsList(): Promise<News[]> {
  const data = await GetGNews();
  return data.articles.map(mapGNewsToNews);
}
