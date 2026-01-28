import { useQuery } from '@tanstack/react-query';
import { getTopNews } from '../api/news.api';

export function useNewsList(options?: { enabled?: boolean }) {
  return useQuery({
    queryKey: ['news'],
    queryFn: getTopNews,
    staleTime: 1000 * 60,
    refetchOnWindowFocus: false,
    enabled: options?.enabled ?? true,
  });
}
