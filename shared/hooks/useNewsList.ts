import { useQuery } from '@tanstack/react-query';
import { getNewsList } from '../service/news.service';

export const useNewsList = () =>
  useQuery({
    queryKey: ['news'],
    queryFn: getNewsList,
  });
