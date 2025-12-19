
import { GNewsArticle } from '@/shared/dto/gnews.dto';
import { News } from '../types/news';

export const mapGNewsArticleToNews = (article: GNewsArticle): News => {
    return {
        id: article.id,
        title: article.title,
        summary: article.description,
        thumbnailUrl: article.image,
        publishedAt: article.publishedAt,
        originalLink: article.url,
        sourceName: article.source.name,
    };
};
