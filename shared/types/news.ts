export interface News {
  id: string;
  title: string;
  summary: string;
  thumbnailUrl: string | null;
  publishedAt: string;
  originalLink: string;
  sourceName: string;
}
