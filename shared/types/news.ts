export interface GNewsSource {
  name: string;
  url: string;
}

export interface GNewsArticle {
  id: string;
  title: string;
  description: string;
  content: string;
  url: string;
  image: string | null;
  publishedAt: string;
  source: GNewsSource;
}

export interface GNewsResponse {
  totalArticles: number;
  articles: GNewsArticle[];
}


export type News = {
    id : string;
    title : string;
    summary : string;
    thumbnail_url : string | null;
    published_at : string;
    original_link : string;
    source_name : string;
}