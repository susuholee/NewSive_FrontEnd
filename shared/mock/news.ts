import { News } from "../types/news";
export const MockData : News[] = [
    {
        id: '1',
        title:'첫 번째 소식',
        summary: 'Next.js 기반 실시간 뉴스 플랫폼 개발을 시작했습니다.',
        thumbnail_url: '',
        published_at: '2025-01-14T10:00:00',
        original_link: 'https://example.com/news/1',
    },
    {
        id: '2',
        title:'두 번째 소식',
        summary: '기획 -> 설계 -> 구현 -> 배포 작업으로 구현하였습니다.',
        thumbnail_url: '',
        published_at: '2025-01-15T20:00:00',
        original_link: 'https://example.com/news/1',
    }
]